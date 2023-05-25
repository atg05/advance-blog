import express from "express";
import {
  followUser,
  getLikedPosts,
  getUserInfo,
  unfollowUser,
} from "../controller/userController.js";

const router = express.Router();
// Define the routes
router.get("/:userId", getUserInfo);
router.post("/:userId/follow", followUser);
router.post("/:userId/unfollow", unfollowUser);

export default router;
