import mongoose from "mongoose";
import bcrypt from "bcrypt";

// ? Schema will be updated as per need

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    avatar: {
      type: String,
      default:
        "https://icons-for-free.com/iconfiles/png/512/avatar+human+people+profile+user+icon-1320168139431219590.png",
    },
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
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "BlogPost" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pinnedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    pinnedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving to database
// ! Why I do this?
// * Because, Password can be easily read by memeber of organisation. Which is not good. That's why i have used bcrypt library so that user's password get converted into hash code.

userSchema.pre("save", async function (next) {
  try {
    const hashedPassword = await bcrypt.hash(this.password, 10);
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
// & version intiial

/*
? firstName: { type: String},
? lastName: { type: String },
? email: { type: String },
? password: { type: String },
*/

// & version 1
// email: { type: String, required: true, unique: true },
// password: { type: String, required: true },

// & version 2
// ! I need to add followers and following
// * so again I'm modifying user Schema by adding
/*
  ? followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  ? following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
*/

// & version 3
// ! I need to add pinPost and Pin user Feature
// * That's why I'm adding two new columns
/*
  ? pinnedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  ? pinnedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
*/

// & version 5
// !
// *
/* 
  ? 
  ? 
*/
