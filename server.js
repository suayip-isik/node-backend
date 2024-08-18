import express from "express";
// import sequelize from "sequelize";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import db from "./app/Models/index.js";
import userRoutes from "./app/Routes/userRoutes.js";

const PORT = process.env.PORT || 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// WATNING: only for testing sequelize.sync({ force: true })
// db.sequelize.sync({ force: true }).then(() => {
//   console.log("db has been re sync");
// });

app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`Server is connected on ${PORT}`));
