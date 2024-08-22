import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `app/uploads/data/${req.url.split("/")[1]}`);
  },
  filename: (req, file, cb) => {
    const { id } = req.params;
    cb(null, id + "." + file.originalname.split(".")[1]);
  },
});

const upload = multer({ storage, limits: { fileSize: 1024 * 1024 * 5 } });

export { upload };
