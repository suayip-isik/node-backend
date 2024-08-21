import bcrypt from "bcrypt";
import db from "../Models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import moment from "moment";
dotenv.config();

const User = db.users;

const signup = async (req, res) => {
  try {
    const {
      userName,
      email,
      password,
      name,
      surname,
      phone,
      birthday,
      gender,
      country,
      city,
    } = req.body;
    const requiredFields = ["userName", "email", "password", "name", "surname"];
    for (const field of requiredFields) {
      if (!req.body[field]) {
        return res.status(400).json({
          success: false,
          message: `${field} alanı zorunludur`,
        });
      }
    }
    let formattedBirthday = moment(birthday, "D-M-YYYY");
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
      name,
      surname,
      phone,
      formattedBirthday,
      gender,
      country,
      city,
    };

    const user = await User.create(data);

    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      return res.status(201).json({
        status: true,
        message: "Kullanıcı başarıyla kaydedildi",
        token,
        user,
      });
    } else {
      return res.status(409).json({
        success: false,
        message: "Bu kullanıcı zaten kayıtlı.",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        return res.status(200).send({ ...user.dataValues, token });
      } else {
        return res.status(401).json({
          status: false,
          message: "Parolanızı kontrol ederek tekrar giriş yapmayı deneyiniz",
        });
      }
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Kayıtlı kullanıcı bulunamadı" });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    return res.status(200).send(users);
  } catch (error) {
    console.log(error);
  }
};

const uploadPhoto = async (req, res) => {
  try {
    const { file } = req;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    res.json({
      message: "File uploaded successfully",
      filename: file.filename,
    });
  } catch (error) {
    console.log(error);
  }
};

export { signup, login, getUsers, uploadPhoto };
