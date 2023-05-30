import mongoose from "mongoose";

// ? Schema will be updated as per need

const randomPic = () => {
  function getRandomIndex(arrayLength) {
    return Math.floor(Math.random() * arrayLength);
  }
  const avatarUrl = [
    "https://i.pinimg.com/474x/e7/a9/4b/e7a94b352d281a23d847a13352be652c.jpg",
    "https://i.pinimg.com/136x136/ef/29/51/ef29513fc46294b48255816fdb386846.jpg",
    "https://i.pinimg.com/236x/95/9f/98/959f98d1df29da313107964217fd681d.jpg",
    "https://i.pinimg.com/170x/fd/a0/e5/fda0e512c6df0833edafb98c6f1f5964.jpg",
  ];
  return avatarUrl[getRandomIndex(avatarUrl.length)];
};

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    role: { type: String, required: true, default: "user" },
    avatar: {
      type: String,
      default: randomPic(),
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
    isBanned: { type: Boolean, default: false },
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
