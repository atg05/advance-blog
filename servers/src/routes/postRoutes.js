import express from "express";
import { v4 as uuidv4 } from "uuid";
import {
  createComment,
  createPost,
  deletePostById,
  getAllPosts,
  getCommentsByPostId,
  getLikedPosts,
  getPostBySlug,
  likeBlogPost,
  unlikeBlogPost,
  updatePostBySlug,
} from "../controller/postController.js";
import multer from "multer";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueFileName = `${uuidv4()}-${file.originalname}`;
    cb(null, uniqueFileName);
  },
});
const upload = multer({ storage });

// Define the route for creating a new blog post
router.post("/", upload.single("image"), createPost);

// GET request to fetch all blog posts
router.get("/", getAllPosts);

// GET request to fetch a specific blog post by slug
router.get("/:slug", getPostBySlug);

// PUT request to update a specific blog post by slug
router.put("/:slug", updatePostBySlug);

// DELETE request to delete a specific blog post by slug
router.delete("/:postId", deletePostById);

router.post("/:postId/like", likeBlogPost);
router.post("/:postId/unlike", unlikeBlogPost);

router.post("/:postId/comments", createComment);
router.get("/:postId/comments", getCommentsByPostId);

router.get("/liked-post/:userId", getLikedPosts);

export default router;
