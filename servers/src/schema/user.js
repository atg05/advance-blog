import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ? Schema will be updated as per need

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash password before saving to database
// ! Why I do this?
// * Because, Password can be easily read by memeber of organisation. Which is not good. That's why i have used bcrypt library so that user's password get converted into hash code.

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// ! Whatever model name you are providing inside model name it will be a table in your db in plural form.
// * User -> users inside your db.

export const User = mongoose.model("User", userSchema);

// ~ History of User Schema
// & version 1
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },
