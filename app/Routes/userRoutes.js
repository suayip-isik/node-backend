import { Router } from "express";
import {
  signup,
  login,
  getUsers,
  uploadPhoto,
} from "../Controllers/userController.js";
import { saveUser, auth } from "../Middleware/userAuth.js";
import { upload } from "../Config/index.js";

const router = Router();

router.post("/signup", saveUser, signup);

router.post("/login", login);

router.get("/users", auth, getUsers);

router.post("/uploads", auth, upload.single("file"), uploadPhoto);

export default router;
