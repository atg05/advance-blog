import express from "express";
import mongoose from "mongoose";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import categoryRoutes from "./src/routes/categoriesRoutes.js";
import cors from "cors";

import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

const app = express();
dotenv.config({ path: "./local.env" });

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const mongoURI =
  "mongodb+srv://duplex-admin:<password>@cluster0.e2sunf7.mongodb.net";
mongoose
  .connect(
    mongoURI
      .replace("duplex-admin", process.env.MONGO_USER)
      .replace("<password>", process.env.MONGO_PASSWORD),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//ORIGIN CONFIG
const corsOptions = {
  origin: ["http://localhost:5173"],
  credentials: true,
};

//CORS MIDDLEWARE
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const baseApi = "/api/v1";

app.use(`${baseApi}/user`, userRoutes);
app.use(`${baseApi}/auth`, authRoutes);
// app.use(`${baseApi}`)
app.use(`${baseApi}/post`, postRoutes);
app.use(`${baseApi}/categories`, categoryRoutes);

app.get(`/health`, (req, res) => {
  res.status(200).send("Working");
});

export default app;
