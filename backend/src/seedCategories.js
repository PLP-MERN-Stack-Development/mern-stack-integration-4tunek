const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('./models/category');

dotenv.config();

const seedCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const categories = [
      { name: 'Technology', description: 'Posts about modern tech trends' },
      { name: 'Health', description: 'Wellness and fitness topics' },
      { name: 'Education', description: 'Learning and skill development' },
      { name: 'Travel', description: 'Travel experiences and tips' },
      { name: 'Food', description: 'Culinary delights and recipes' },
      { name: 'Politics', description: 'News and discussions about political issues' },
      { name: 'Entertainment', description: 'Movies, music, and more' },
    ];

    // Remove existing categories first
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Add slugs manually to avoid null
    const categoriesWithSlug = categories.map((cat) => ({
      ...cat,
      slug: cat.name.toLowerCase().replace(/[^\w ]+/g, '').replace(/\s+/g, '-'),
    }));

    await Category.insertMany(categoriesWithSlug);

    console.log('Categories seeded successfully!');
  } catch (err) {
    console.error('Error seeding categories:', err);
  } finally {
    mongoose.connection.close();
  }
};

seedCategories();
