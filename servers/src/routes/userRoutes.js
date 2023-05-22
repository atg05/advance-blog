import express from "express";
import {
  followUser,
  getUserInfo,
  unfollowUser,
} from "../controller/userController.js";

const router = express.Router();

// Define the routes
router.get("/:userId", getUserInfo);
router.post("/:userToFollowId/follow", followUser);
router.post("/:userToUnfollowId/unfollow", unfollowUser);

export default router;
