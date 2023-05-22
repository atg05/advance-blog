import express from "express";
import mongoose from "mongoose";
import userRoutes from "./src/routes/userRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import postRoutes from "./src/routes/postRoutes.js";
import cors from "cors";

import * as dotenv from "dotenv";

const app = express();
dotenv.config({ path: "./local.env" });

const Mongo_URI = `mongodb+srv://duplex-admin:<password>@cluster0.e2sunf7.mongodb.net/${process.env.DB_NAME}`;

mongoose
  .connect(
    Mongo_URI.replace("duplex-admin", process.env.MONGO_USER).replace(
      "<password>",
      process.env.MONGO_PASSWORD
    ),
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Db Connected");
  })
  .catch((err) => {
    console.log("Inside");
    console.log(err);
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

app.get(`/health`, (req, res) => {
  res.status(200).send("Working");
});

export default app;