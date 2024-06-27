import path from "path";
import multer from "multer";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const fileFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeTypes = ["image/jpeg", "image/jpg", "image/webp", "image/png"];

  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".webp" && ext !== ".png") {
    cb(new Error(`Unsupported file type! ${ext}`), false);
    return;
  }

  if (!mimeTypes.includes(file.mimetype)) {
    cb(new Error(`Unsupported MIME type! ${file.mimetype}`), false);
    return;
  }

  cb(null, true);
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter,
});

export default upload;
