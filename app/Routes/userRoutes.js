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
        console.log("girdi");
        res.status(413).json({
          success: false,
          message: "Resim boyutu en fazla 5 MB olmalıdır.",
        });
      }
      next();
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
