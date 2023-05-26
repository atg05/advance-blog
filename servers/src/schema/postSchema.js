import mongoose from "mongoose";
import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
const blogPostSchema = new mongoose.Schema(
  {
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      default: "Blog",
    },
    slug: {
      type: String,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: [
      {
        type: String,
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
    },
    featuredImage: {
      type: String,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    privacy: {
      type: String,
      required: true,
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

blogPostSchema.pre("save", async function (next) {
  try {
    this.slug = slugify(uuidv4());
    next();
  } catch (error) {
    next(error);
  }
});

export const BlogPost = mongoose.model("blogs", blogPostSchema);
