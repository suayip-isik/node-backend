import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `app/uploads/data/${req.url.split("/")[1]}`);
  },
  filename: (req, file, cb) => {
    const { id } = req.params;
    cb(null, `${id}.jpg`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    var ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".gif" && ext !== ".jpeg") {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
  limits: { fileSize: 1024 * 1024 * 5 },
});

export { upload };
