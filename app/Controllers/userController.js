import bcrypt from "bcrypt";
import db from "../Models/index.js";
import dotenv from "dotenv";
import { generateAndSendToken } from "../Helpers/index.js";

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
    let formattedBirthday = new Date(birthday);
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
      let token = generateAndSendToken(user, res);
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
        let token = generateAndSendToken(user, res);
        return res.status(201).json({
          status: true,
          message: "Login işlemi başarıyla tamamlandı",
          token,
          user,
        });
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

const uploadUserProfilePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res
      .status(200)
      .json({ status: true, message: "Profil fotoğrafı güncellendi", user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

const getUserProfilePhoto = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    res.sendFile(`${user.id}.jpg`, {
      root: "app/uploads/data/uploadUserProfilePhoto/",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Bir hata oluştu" });
  }
};

export { signup, login, getUsers, uploadUserProfilePhoto, getUserProfilePhoto };
