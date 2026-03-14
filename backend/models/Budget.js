const mongoose = require('mongoose');

const BudgetSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users', // links this budget to the specific user
    required: true 
  },
  category: { 
    type: String, 
    required: true 
  },
  limit: { 
    type: Number, 
    required: true 
  }
});

module.exports = mongoose.model('budget', BudgetSchema);