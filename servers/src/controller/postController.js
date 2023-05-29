import { BlogPost } from "../schema/postSchema.js";
import { User } from "../schema/userSchema.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Comment from "../schema/commentSchema.js";
import { uploadToCloudinary } from "../utils/cloudinary.config.js";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (req, res) => {
  const { authorId, content, category } = req.body;
  let newPost;
  try {
    if (req.file) {
      const imageUrl = await uploadToCloudinary(req.file);
      // Create a new blog post with the uploaded image URL
      newPost = new BlogPost({
        authorId,
        content,
        featuredImage: imageUrl,
        tags: [category], // Add category to the tags array
      });
    } else {
      newPost = new BlogPost({
        authorId,
        content,
        tags: [category], // Add category to the tags array
      });
    }

    // Save the new post to the database
    const post = await newPost.save();
    // Return the saved post as a JSON response with HTTP status code 201 (Created)
    res.status(201).json(post);
  } catch (error) {
    // If an error occurs, return an error message as a JSON response with HTTP status code 400 (Bad Request)
    res.status(400).json({ error: error.message });
  }
};

export const getAllPosts = async (req, res) => {
  const { userId, onlyUserPost, onlyLikePost } = req.query;

  const fetchPostsByAuthorId = async (authorId) => {
    try {
      const posts = await BlogPost.find({ authorId });
      return posts;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  try {
    let posts = await BlogPost.find().sort({ _id: -1 });

    if (onlyUserPost) {
      fetchPostsByAuthorId(userId)
        .then((posts) => {
          posts = posts;
        })
        .catch((error) => {
          console.log(error);
        });
    }

    let postPromises;
    postPromises = posts?.map(async (post) => {
      const authorDetails = await User.findById(post.authorId);
      if (post._doc?.likes?.includes(userId)) {
        post._doc.liked = true;
      } else {
        post._doc.liked = false;
      }

      // Check if the current user is following the author
      const isFollowing = authorDetails?.followers?.includes(userId);

      const {
        _id,
        author,
        authorId,
        comments,
        content,
        featuredImage,
        privacy,
        tags,
        slug,
        liked,
      } = post._doc;

      return {
        id: _id,
        author,
        comments,
        content,
        featuredImage: featuredImage,
        privacy,
        tags,
        slug,
        liked,
        author: {
          id: authorId,
          name: `${authorDetails?.firstName} ${authorDetails?.lastName}`,
          avatar:
            authorDetails?.avatar ||
            "https://icons-for-free.com/iconfiles/png/512/avatar+human+people+profile+user+icon-1320168139431219590.png",
        },
        following: isFollowing,
      };
    });

    let postWithAuthor = await Promise.all(postPromises);

    res.json(postWithAuthor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

// Controller function to READ a specific blog post by slug
export const getPostBySlug = async (req, res) => {
  try {
    // Find a specific blog post by slug in the database
    const post = await BlogPost.findOne({ slug: req.params.slug });
    // If the post is not found, return an error message as a JSON response with HTTP status code 404 (Not Found)
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      // If the post is found, return the post as a JSON response with HTTP status code 200 (OK)
      res.status(200).json(post);
    }
  } catch (error) {
    // If an error occurs, return an error message as a JSON response with HTTP status code 500 (Internal Server Error)
    res.status(500).json({ error: error.message });
  }
};

// Controller function to UPDATE a specific blog post by slug
export const updatePostBySlug = async (req, res) => {
  try {
    // Find a specific blog post by slug in the database and update it with the request body
    const post = await BlogPost.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    );
    // If the post is not found, return an error message as a JSON response with HTTP status code 404 (Not Found)
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      // If the post is found and updated successfully, return the updated post as a JSON response
      res.json(post);
    }
  } catch (error) {
    // If an error occurs, return an error message as a JSON response with HTTP status code 500 (Internal Server Error)
    res.status(500).json({ error: error.message });
  }
};

// Controller function to DELETE a specific blog post by slug
export const deletePostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await BlogPost.findByIdAndDelete(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const likeBlogPost = async (req, res) => {
  const { userId } = req.body;
  const { postId } = req.params;

  try {
    const user = await User.findById(userId);
    const post = await BlogPost.findById(postId);

    // Check if the user has already liked the post
    if (post.likes.includes(userId)) {
      return res.status(400).json({ msg: "Post already liked" });
    }

    // Add the user's ID to the post's "likes" array
    post.likes.push(userId);
    await post.save();

    // Add the post's ID to the user's "likedPosts" array
    user.likedPosts.push(postId);
    await user.save();

    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const unlikeBlogPost = async (req, res) => {
  const { postId } = req.params;
  const { userId } = req.body;

  try {
    const post = await BlogPost.findById(postId);

    // Check if the post exists
    if (!post) {
      return res.status(404).json({ msg: "Post not found" });
    }

    // Check if the user has liked the post
    if (!post.likes || !post.likes.includes(userId)) {
      return res.status(400).json({ msg: "Post has not been liked" });
    }

    // Remove the user's ID from the post's "likes" array
    post.likes = post.likes.filter((id) => id.toString() !== userId);

    await post.save();

    // Convert the ObjectId instances to strings in the response
    const likes = post.likes.map((id) => id.toString());

    res.json({ likes });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body, commenterId } = req.body;

    // Check if the post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Check if the user exists
    const user = await User.findById(commenterId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create a new comment using the request body
    const comment = new Comment({ body, postId });

    // Set the commenter's ID and save the comment to the database
    comment.user = user._id;
    const savedComment = await comment.save();

    // Add the comment to the post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    // Get the comment's creation date in days
    const creationDate = Math.round(
      (Date.now() - savedComment.createdAt) / (1000 * 60 * 60 * 24)
    );

    // Prepare the commenter object with ID, name, and avatar
    const commenter = {
      id: user._id,
      name: user.firstName + user.lastName,
      avatar: user.avatar,
    };

    // Prepare the response with the comment body, creation date, and commenter object
    const response = {
      body: savedComment.body,
      creationDate,
      commenter,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find all comments that have the given postId
    const comments = await Comment.find({ postId })
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName avatar");

    // Prepare the response array
    const response = comments.map((comment) => {
      // Get the comment's creation date in days
      const creationDate = Math.round(
        (Date.now() - comment.createdAt) / (1000 * 60 * 60 * 24)
      );

      // Prepare the commenter object with ID, name, and avatar
      const commenter = {
        id: comment.user._id,
        name: `${comment.user.firstName} ${comment.user.lastName}`,
        avatar: comment.user.avatar,
      };

      return {
        body: comment.body,
        creationDate,
        commenter,
      };
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPostIds = user.likedPosts;

    // Fetch the liked posts using their IDs
    const likedPosts = await BlogPost.find({ _id: { $in: likedPostIds } });

    const postPromises = likedPosts.map(async (post) => {
      const authorDetails = await User.findById(post.authorId);

      // Calculate posted days ago
      const postedDaysAgo = Math.round(
        (Date.now() - post.createdAt) / (1000 * 60 * 60 * 24)
      );

      // Check if the current user is following the author
      const isFollowing = authorDetails?.followers?.includes(userId);

      const {
        _id,
        author,
        authorId,
        comments,
        content,
        featuredImage,
        privacy,
        tags,
        slug,
      } = post;

      return {
        id: _id,
        author,
        comments,
        content,
        featuredImage: featuredImage,
        privacy,
        tags,
        slug,
        liked: true,
        author: {
          id: authorId,
          name: `${authorDetails?.firstName} ${authorDetails?.lastName}`,
          avatar:
            authorDetails?.avatar ||
            "https://icons-for-free.com/iconfiles/png/512/avatar+human+people+profile+user+icon-1320168139431219590.png",
        },
        following: isFollowing,
        postedDaysAgo, // Add posted days ago information
      };
    });

    const likedPostsWithAuthor = await Promise.all(postPromises);

    return res.json(likedPostsWithAuthor);
  } catch (error) {
    console.error("Error retrieving liked posts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
