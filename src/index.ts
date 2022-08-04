import express, { Request, Response } from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";
import dotenv from "dotenv";

import checkAuth from "./middleware/checkAuth";

import authRoute from "./routes/auth.routes";
import postRoute from "./routes/post.routes";

const app = express();

dotenv.config();

// хранилище для соххранения картинок
const storage = multer.diskStorage({
  // возвращаем путь
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },

  // перед сохранением укажит как называется файл
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());

// get запрос на получения статичного файла
app.use("/api/uploads", express.static("uploads"));

app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.post(
  "/api/upload",
  checkAuth,
  upload.single("image"),
  (req: Request, res: Response) => {
    res.json({
      url: `/uploads/${req.file?.originalname}`,
    });
  }
);
const PORT = process.env.PORT || 4444;

async function start() {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/blog-express"
      // {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true,
      // }
    );

    app.listen(PORT, () =>
      console.log(`App has been started on port ${PORT}...`)
    );
  } catch (error: any) {
    console.log("Server Error", error.message);
    process.exit(1);
  }
}

start();
