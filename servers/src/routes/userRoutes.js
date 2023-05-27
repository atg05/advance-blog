import express from "express";
import {
  followUser,
  getUserInfo,
  unfollowUser,
} from "../controller/userController.js";
import { likeBlogPost } from "../controller/postController.js";

const router = express.Router();
// Define the routes
router.get("/:userId", getUserInfo);
router.post("/:userId/follow", followUser);
router.post("/:userId/unfollow", unfollowUser);

export default router;
