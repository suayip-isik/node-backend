import multer from "multer";
import db from "../Models/index.js";

const User = db.users;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `app/uploads/data/${req.url.split("/")[2]}`);
  },
  filename: async (req, file, cb) => {
    const { id } = req.params;
    const user = await User.findByPk(id);
    cb(null, user.userName + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({ storage });

export { upload };
