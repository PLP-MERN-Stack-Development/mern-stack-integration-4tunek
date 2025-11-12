const Joi = require("joi");
const mongoose = require("mongoose");

// Custom ObjectId validator for MongoDB
const objectIdValidator = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.error("any.invalid", { value });
  }
  return value;
};

// Schema for validating route params like /posts/:id
const idParamSchema = Joi.object({
  id: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "ID parameter is required",
    "any.invalid": "Invalid ID format",
  }),
});

// ✅ Allow featuredImage field here
const postCreateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 200 characters",
  }),
  content: Joi.string().trim().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters",
  }),
  category: Joi.string().custom(objectIdValidator).required().messages({
    "any.required": "Category is required",
    "any.invalid": "Invalid category ID",
  }),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
  author: Joi.string().trim().max(100).optional(),
  featuredImage: Joi.string().optional(), // ✅ newly added field
}).unknown(false); // still strict, but featuredImage is now valid

// ✅ Allow featuredImage also for updates
const postUpdateSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  content: Joi.string().trim().min(10).optional(),
  category: Joi.string().custom(objectIdValidator).optional(),
  tags: Joi.array().items(Joi.string().trim().max(50)).optional(),
  author: Joi.string().trim().max(100).optional(),
  featuredImage: Joi.string().optional(), // ✅ add this here too
}).min(1);

module.exports = {
  objectIdValidator,
  idParamSchema,
  postCreateSchema,
  postUpdateSchema,
};
