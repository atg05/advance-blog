// Import necessary modules
import express from "express";
import Category from "../schema/categorySchema.js";

// Create a router instance
const router = express.Router();

// Route for adding a category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;

    // Create a new category
    const category = new Category({ name });

    // Save the category to the database
    const savedCategory = await category.save();

    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    res.status(500).json({ error: "Failed to add category" });
  }
});

// Route for fetching all categories
router.get("/", async (req, res) => {
  try {
    // Fetch all categories from the database
    const categories = await Category.find();
    const categoryNames = categories.map((category) => category.name);

    res.json(categoryNames);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
