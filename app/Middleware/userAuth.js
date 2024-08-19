import db from "../Models/index.js";
import jwt from "jsonwebtoken";
const User = db.users;

const saveUser = async (req, res, next) => {
  try {
    const username = await User.findOne({
      where: {
        userName: req.body.userName,
      },
    });
    if (username) {
      return res.status(409).json({
        success: false,
        message: "Bu kullanıcı adı zaten mevcut.",
      });
    }

    const emailcheck = await User.findOne({
      where: {
        email: req.body.email,
      },
    });

    if (emailcheck) {
      return res.status(409).json({
        success: false,
        message: "Bu email zaten mevcut.",
      });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null)
    return res.status(401).json({
      message: "Token gerekli",
    });

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ message: "Geçersiz token" });
    req.user = user;
    next();
  });
};

export { saveUser, auth };
