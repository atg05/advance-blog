import { BlogPost } from "../schema/postSchema.js";
import { User } from "../schema/userSchema.js";

// Follow a user
export const followUser = async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;
  console.log("Inside follow User");

  try {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the follower is already following the user
    if (user.followers.includes(followerId)) {
      return res.status(400).json({ msg: "Already following the user" });
    }

    // Add the follower's ID to the user's "followers" array
    user.followers.push(followerId);
    await user.save();

    // Add the user's ID to the follower's "following" array
    follower.following.push(userId);
    await follower.save();

    res.json({ msg: "User followed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  const { userId } = req.params;
  const { followerId } = req.body;

  try {
    const user = await User.findById(userId);
    const follower = await User.findById(followerId);

    if (!user || !follower) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Check if the follower is already not following the user
    if (!user.followers.includes(followerId)) {
      return res.status(400).json({ msg: "Not following the user" });
    }

    // Remove the follower's ID from the user's "followers" array
    user.followers = user.followers.filter((id) => id !== followerId);
    await user.save();

    // Remove the user's ID from the follower's "following" array
    follower.following = follower.following.filter((id) => id !== userId);
    await follower.save();

    res.json({ msg: "User unfollowed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

//User Info
export const getUserInfo = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    // // .populate("likedPosts")
    // .populate("followers")
    // .populate("following")
    // .populate("pinnedPosts")
    // .populate("pinnedUsers");

    const fetchPostsByAuthorId = async (authorId) => {
      try {
        const posts = await BlogPost.find({ authorId });
        return posts;
      } catch (error) {
        console.log(error);
        throw error;
      }
    };

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let userPosts;
    await fetchPostsByAuthorId(userId).then((posts) => {
      userPosts = posts;
    });

    console.log(userPosts);
    // Remove sensitive information like password
    const userInfo = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      avatar: user.avatar,
      userPosts,
      likedPosts: user.likedPosts,
      followers: user.followers,
      following: user.following,
      pinnedPosts: user.pinnedPosts,
      pinnedUsers: user.pinnedUsers,
      createdAt: user.createdAt,
    };

    res.json(userInfo);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
};
