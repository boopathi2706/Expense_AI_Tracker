const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware'); // Check this path matches your setup!
const { getBudgets, setBudget, deleteBudget } = require('../controllers/budgetController');


console.log("1. protect is:", typeof protect);
console.log("2. getBudgets is:", typeof getBudgets);
console.log("3. setBudget is:", typeof setBudget);
console.log("4. deleteBudget is:", typeof deleteBudget);
// Route definitions
router.get('/', protect, getBudgets);
router.post('/', protect, setBudget);
router.delete('/:id', protect, deleteBudget);

module.exports = router;