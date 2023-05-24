import { BlogPost } from "../schema/postSchema.js";
import { User } from "../schema/userSchema.js";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import Comment from "../schema/commentSchema.js";

// Get the directory path of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createPost = async (req, res) => {
  const { authorId, content } = req.body;

  try {
    // Create a new BlogPost object using the request body
    const newPost = new BlogPost({
      authorId,
      content,
    });

    // Check if there is an uploaded file
    if (req.file) {
      // Retrieve the unique filename assigned by multer
      const uniqueFileName = req.file.filename;
      // Set the unique filename in the featuredImage field
      newPost.featuredImage = uniqueFileName;
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
  const { userId, onlyUserPost } = req.query;

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

    const postPromises = posts?.map(async (post) => {
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
        featuredImage:
          "https://images.pexels.com/photos/920382/pexels-photo-920382.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-920382.jpg&fm=jpg",
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

    const postWithAuthor = await Promise.all(postPromises);

    res.json(postWithAuthor);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
};

export const authorPosts = async (req, res) => {};

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
export const deletePostBySlug = async (req, res) => {
  try {
    // Find a specific blog post by slug in the database and delete it
    const post = await BlogPost.findOneAndDelete({ slug: req.params.slug });
    // If the post is not found, return an error message as a JSON response with HTTP status code 404 (Not Found)
    if (!post) {
      res.status(404).json({ error: "Post not found" });
    } else {
      // If the post is found and deleted successfully, return a success message as a JSON response
      res.json({ message: "Post deleted successfully" });
    }
  } catch (error) {
    // If an error occurs, return an error message as a JSON response with HTTP status code 500 (Internal Server Error)
    res.status(500).json({ error: error.message });
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
    const { body } = req.body;

    // Check if the post exists
    const post = await BlogPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Create a new comment using the request body
    const comment = new Comment({ body });

    // Save the comment to the database
    const savedComment = await comment.save();

    // Add the comment to the post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getCommentsByPostId = async (req, res) => {
  try {
    const { postId } = req.params;

    // Find the post by ID and populate the comments
    const post = await Post.findById(postId).populate("comments");
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(post.comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
