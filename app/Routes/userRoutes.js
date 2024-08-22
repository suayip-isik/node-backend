import { Router } from "express";
import {
  signup,
  login,
  getUsers,
  uploadUserProfilePhoto,
  getUserProfilePhoto,
} from "../Controllers/userController.js";
import { saveUser } from "../Middleware/index.js";
import { upload } from "../Config/index.js";
import multer from "multer";

const router = Router();

router.post("/signup", saveUser, signup);

router.post("/login", login);

router.get("/getAllUsers", getUsers);

router.post(
  "/uploadUserProfilePhoto/:id",
  function (req, res, next) {
    upload.single("file")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        res.status(413).json({
          success: false,
          message: err.message,
        });
      } else if (err) {
        res.status(400).json({
          success: false,
          message: err.message,
        });
      } else if (!req.file) {
        return res.end("File is required!");
      } else {
        next();
      }
    });
  },
  uploadUserProfilePhoto
);

router.get(
  "/getUserProfilePhoto/:id",
  upload.single("file"),
  getUserProfilePhoto
);

export default router;
