import express from "express";
import {
  followUser,
  getUserInfo,
  unfollowUser,
} from "../controller/userController.js";
import { User } from "../schema/userSchema.js";

const router = express.Router();
// Define the routes
router.get("/:userId", getUserInfo);
router.post("/:userId/follow", followUser);
router.post("/:userId/unfollow", unfollowUser);
// Route to ban a user
router.put("/:userId/ban", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the user's ban status to true
    user.isBanned = true;

    // Save the updated user
    await user.save();

    res.json({ message: "User banned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
});
router.put("/:userId/unban", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Set the user's ban status to true
    user.isBanned = false;

    // Save the updated user
    await user.save();

    res.json({ message: "User unbanned successfully" });
  } catch (error) {
    console.error("Error banning user:", error);
    res.status(500).json({ error: "Failed to ban user" });
  }
});

export default router;
