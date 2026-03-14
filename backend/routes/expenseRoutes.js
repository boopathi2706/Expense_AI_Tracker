const express = require('express');
const router = express.Router();
const multer = require('multer');
const { 
    addExpense, 
    getExpenses, 
    getExpenseSummary, 
    exportExpensesCsv, 
    importExpensesCsv,
    uploadReceipt,
    deleteExpense
} = require('../controllers/expenseController');
const { protect } = require('../middleware/authMiddleware');

// Setup multer for in-memory file uploads
const upload = multer({ storage: multer.memoryStorage() });
// OCR Receipt Upload route
router.post('/upload', protect, upload.single('receipt'), uploadReceipt);
// Specific routes (MUST go before generic routes like '/')
router.get('/summary', protect, getExpenseSummary);
router.get('/export', protect, exportExpensesCsv);

// The import route expects a file field named "file"
router.post('/import', protect, upload.single('file'), importExpensesCsv);

// Generic routes
router.post('/', protect, addExpense);
router.delete('/:id', protect, deleteExpense);
router.get('/', protect, getExpenses);

module.exports = router;