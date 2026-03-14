const mongoose = require('mongoose');

const categoryCacheSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // "Uber" and "uber" will be saved the same way
    trim: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('CategoryCache', categoryCacheSchema);