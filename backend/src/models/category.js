const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Category name is required'],
      unique: true,
      trim: true,
      maxlength: [50, 'Category name cannot exceed 50 characters'],
    },
    description: {
      type: String,
      maxlength: [200, 'Description cannot exceed 200 characters'],
      default: '', 
    },
    slug: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
);

// Generate slug before saving
CategorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();

  this.slug = this.name
    .toLowerCase()
    .trim()
    .replace(/[^\w ]+/g, '') 
    .replace(/\s+/g, '-'); 

  next();
});

// Virtual populate: get all posts in this category
CategorySchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'category',
});

// Include virtuals in JSON & Object outputs
CategorySchema.set('toJSON', { virtuals: true });
CategorySchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Category', CategorySchema);
