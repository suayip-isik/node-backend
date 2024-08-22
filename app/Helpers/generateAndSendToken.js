import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateAndSendToken = (user, res) => {
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
    expiresIn: 1 * 24 * 60 * 60 * 1000,
  });

  res.cookie("jwt", token, { maxAge: 1 * 24 * 60 * 60, httpOnly: true });
  return token
};

export { generateAndSendToken };
