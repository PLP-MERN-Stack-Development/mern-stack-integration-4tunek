const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const validate = require('../middleware/validate');
const { categorySchema } = require('../validators/categoryValidator');

// @desc    Get all categories
// @route   GET /api/categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }); // Sort alphabetically for dropdown
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create a new category
// @route   POST /api/categories
router.post('/', validate(categorySchema), async (req, res, next) => {
  try {
    const { name, description } = req.body;

    // Prevent duplicates
    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Category already exists',
      });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
