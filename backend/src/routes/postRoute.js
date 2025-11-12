const express = require("express");
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const {
  postCreateSchema,
  postUpdateSchema,
  idParamSchema,
} = require("../validators/postValidator");
const validate = require("../middleware/validate");

const router = express.Router();



// GET all posts
router.get("/", async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = "", category } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (category) query.category = category;

    const posts = await Post.find(query)
      .populate("author category")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await Post.countDocuments(query);

    res.json({
      success: true,
      total,
      page: Number(page),
      pageSize: posts.length,
      data: posts,
    });
  } catch (error) {
    next(error);
  }
});

// GET single post
router.get("/:id", validate(idParamSchema), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author category")
      .populate("comments.user", "name email avatar");

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, data: post });
  } catch (error) {
    next(error);
  }
});

// CREATE post
router.post("/", auth, upload.single("featuredImage"), async (req, res, next) => {
  try {
    // Convert tags string -> array if necessary
    let tags = [];
    if (req.body.tags) {
      if (typeof req.body.tags === "string") {
        tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
      } else if (Array.isArray(req.body.tags)) {
        tags = req.body.tags;
      }
    }

    const postData = {
      title: req.body.title,
      content: req.body.content,
      category: req.body.category,
      tags,
      author: req.user.id,
      featuredImage: req.file ? req.file.filename : "default-post.jpg",
    };

    // Validate data
    const { error } = postCreateSchema.validate(postData, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const post = await Post.create(postData);
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// UPDATE post
router.put("/:id", auth, upload.single("featuredImage"), validate(idParamSchema), async (req, res, next) => {
  try {
    // Convert tags string -> array
    if (req.body.tags && typeof req.body.tags === "string") {
      req.body.tags = req.body.tags.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Add featured image if uploaded
    if (req.file) req.body.featuredImage = req.file.filename;

    // Validate update data
    const { error } = postUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.details.map((d) => d.message),
      });
    }

    const post = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, data: post });
  } catch (err) {
    next(err);
  }
});

// DELETE post
router.delete("/:id", auth, validate(idParamSchema), async (req, res, next) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
