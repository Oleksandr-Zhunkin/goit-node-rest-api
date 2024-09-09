import multer from "multer";
import * as path from "node:path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination,
  filename: async (req, file, callback) => {
    const uniquePrefix = `${Date.now()}`;
    const filename = `${uniquePrefix}_${file.originalname}`;

    callback(null, filename);
  },
});

const upload = multer({
  storage,
});

export default upload;
