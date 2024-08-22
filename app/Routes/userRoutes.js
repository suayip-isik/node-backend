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

const router = Router();

router.post("/signup", saveUser, signup);

router.post("/login", login);

router.get("/getAllUsers", getUsers);

router.post(
  "/uploadUserProfilePhoto/:id",
  upload.single("file"),
  uploadUserProfilePhoto
);

router.get(
  "/getUserProfilePhoto/:id",
  upload.single("file"),
  getUserProfilePhoto
);

export default router;
