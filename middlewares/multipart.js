const multer = require("multer");

const uploadedFilesFolder = "public";
exports.uploadedFilesFolder = uploadedFilesFolder;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./" + uploadedFilesFolder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 * 1024 },
});
exports.upload = upload;
