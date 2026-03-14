const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  // 👇 ADD THIS USER FIELD 👇
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User', // References the User model
  },
  // -------------------------
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  category: {
    type: String,
    default: 'Uncategorized' 
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);