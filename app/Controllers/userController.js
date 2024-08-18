import bcrypt from "bcrypt";
import db from "../Models/index.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const User = db.users;

const signup = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const data = {
      userName,
      email,
      password: await bcrypt.hash(password, 10),
    };

    const user = await User.create(data);

    if (user) {
      let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: 1 * 24 * 60 * 60 * 1000,
      });

      res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
      return res.status(201).send(user);
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

    console.log("user:", user);

    if (user) {
      const isSame = await bcrypt.compare(password, user.password);

      if (isSame) {
        let token = jwt.sign({ id: user.id }, process.env.JWT_SECRET_KEY, {
          expiresIn: 1 * 24 * 60 * 60 * 1000,
        });

        console.log("token:", token);

        res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
        console.log("user", JSON.stringify(user, null, 2));
        console.log(token);
        return res.status(201).send({ ...user.dataValues, token });
      } else {
        return res.status(401).send("Authentication failed 1");
      }
    } else {
      return res.status(401).send("Authentication failed 2");
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

export { signup, login, getUsers };
