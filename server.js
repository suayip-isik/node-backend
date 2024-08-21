import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import userRoutes from "./app/Routes/userRoutes.js";
import { verifyJwt } from "./app/Middleware/verifyJwt.js";
import db from "./app/Models/index.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(verifyJwt);

// WATNING: only for testing sequelize.sync({ force: true })
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("db has been re sync");
// });

app.use("/api/user", userRoutes);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
