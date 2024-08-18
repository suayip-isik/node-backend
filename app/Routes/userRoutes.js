import { Router } from "express";
import { signup, login, getUsers } from "../Controllers/userController.js";
import { saveUser } from "../Middleware/userAuth.js";

const router = Router();

router.post("/signup", saveUser, signup);

router.post("/login", login);

router.get("/users", getUsers);

export default router;
