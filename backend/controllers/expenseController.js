const Expense = require('../models/Expense');
const { categorizeExpense } = require('../services/aiService');
const mongoose = require('mongoose'); // 👈 We need this for aggregation
const { Parser } = require('json2csv');
const csv = require('csv-parser');
const stream = require('stream');
const Budget = require('../models/Budget'); // Add this line!
const Tesseract = require('tesseract.js');

const addExpense = async (req, res) => {
  try {
    const { title, amount } = req.body;

    if (!title || !amount) {
      return res.status(400).json({ message: 'Please provide both title and amount.' });
    }

    const category = await categorizeExpense(title);

    const newExpense = new Expense({
      user: req.user.id,
      title,
      amount,
      category
    });

    const savedExpense = await newExpense.save();

    // --- NEW BUDGET ALERT LOGIC ---
    let alertMessage = null;
    
    // 1. Check if the user has a budget for this category
    const budget = await Budget.findOne({ user: req.user.id, category: savedExpense.category });
    
    if (budget) {
      // 2. Get dates for the current month
      const date = new Date();
      const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
      const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      // 3. Calculate how much they've spent in this category THIS month
      const expensesThisMonth = await Expense.aggregate([
        { $match: { 
            user: new mongoose.Types.ObjectId(req.user.id), 
            category: savedExpense.category,
            date: { $gte: firstDay, $lte: lastDay }
        }},
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);

      const currentTotal = expensesThisMonth.length > 0 ? expensesThisMonth[0].total : 0;

      // 4. If they cross the limit, attach an alert to the response!
      if (currentTotal > budget.limit) {
        alertMessage = `🚨 ALERT: You have exceeded your ${savedExpense.category} budget of $${budget.limit}! Current total: $${currentTotal}`;
      }
    }
    // ------------------------------

    // We send back both the expense AND the alert (if it exists)
    res.status(201).json({
      expense: savedExpense,
      alert: alertMessage
    });

  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ message: 'Server error while adding expense.' });
  }
};

const getExpenses = async (req, res) => {
  try {
    // 👈 Only find expenses that belong to the logged-in user
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ message: 'Server error while fetching expenses.' });
  }
};



// ... (Keep your existing addExpense and getExpenses functions here) ...

// @desc    Get expense summary for charts (Filter by year/month)
// @route   GET /api/expenses/summary
const getExpenseSummary = async (req, res) => {
  try {
    const { year, month } = req.query; // Get filters from the URL

    // 1. Start by only looking at the logged-in user's data
    const matchStage = { user: new mongoose.Types.ObjectId(req.user.id) };

    // 2. If a year or month is provided, filter the dates
    if (year) {
      const startDate = new Date(`${year}-01-01`);
      const endDate = new Date(`${year}-12-31T23:59:59.999Z`);
      
      if (month) {
        // Javascript months are 0-indexed (0 = Jan, 11 = Dec)
        startDate.setMonth(parseInt(month) - 1);
        endDate.setMonth(parseInt(month) - 1);
        // Set to the last day of that specific month
        endDate.setDate(new Date(year, month, 0).getDate()); 
      }
      
      matchStage.date = { $gte: startDate, $lte: endDate };
    }

    // 3. Ask MongoDB to group the data by Category and sum the amounts
    const categoryTotals = await Expense.aggregate([
      { $match: matchStage },
      { $group: { _id: '$category', totalAmount: { $sum: '$amount' } } },
      { $sort: { totalAmount: -1 } } // Sort largest to smallest
    ]);

    // 4. Also fetch the raw matching expenses so the frontend can group by day/week
    const expenses = await Expense.find(matchStage).sort({ date: 1 });

    res.status(200).json({ 
      categoryTotals, 
      expenses 
    });

  } catch (error) {
    console.error('Error generating summary:', error);
    res.status(500).json({ message: 'Server error while generating summary.' });
  }
};
// @desc    Export expenses to CSV
// @route   GET /api/expenses/export
const exportExpensesCsv = async (req, res) => {
  try {
    const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });

    if (expenses.length === 0) {
      return res.status(404).json({ message: 'No expenses found to export.' });
    }

    // Define the fields we want in the CSV
    const fields = ['title', 'amount', 'category', 'date'];
    const json2csvParser = new Parser({ fields });
    const csvData = json2csvParser.parse(expenses);

    // Tell the browser to download this as a file named "expenses.csv"
    res.header('Content-Type', 'text/csv');
    res.attachment('expenses.csv');
    return res.send(csvData);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ message: 'Server error while exporting CSV.' });
  }
};

// @desc    Import expenses from CSV
// @route   POST /api/expenses/import
const importExpensesCsv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a CSV file.' });
    }

    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(req.file.buffer);

    // Parse the CSV file
    bufferStream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        let importedCount = 0;

        // Process each row sequentially so we don't crash the Hugging Face API!
        for (const row of results) {
          if (row.title && row.amount) {
            // Ask AI for the category
            const category = await categorizeExpense(row.title);

            const newExpense = new Expense({
              user: req.user.id,
              title: row.title,
              amount: parseFloat(row.amount),
              category: category,
              date: row.date ? new Date(row.date) : Date.now()
            });

            await newExpense.save();
            importedCount++;
          }
        }

        res.status(200).json({ message: `Successfully imported ${importedCount} expenses!` });
      });
  } catch (error) {
    console.error('Error importing CSV:', error);
    res.status(500).json({ message: 'Server error while importing CSV.' });
  }
};
// @desc    Upload receipt, extract data via OCR, and save expense
// @route   POST /api/expenses/upload
const uploadReceipt = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image file.' });
    }

    console.log('📸 Scanning receipt... (this might take 5-10 seconds)');

    // 1. Run the image buffer through Tesseract AI to extract raw text
    const { data: { text } } = await Tesseract.recognize(req.file.buffer, 'eng');
    console.log('📝 Raw Text Extracted:\n', text);

    // 2. Extract the Title (Assume the first real line of text is the store name)
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 2);
    const title = lines.length > 0 ? lines[0] : 'Unknown Store';

    // 3. Extract the Amount (Hunt for decimals and find the biggest number)
    // This Regex looks for numbers like 12.99, 50.00, 1,200.50
    const amountMatches = text.match(/\d+[.,]\d{2}/g);
    let amount = 0;
    
    if (amountMatches) {
      // Convert matches to standard numbers and find the maximum (usually the Total)
      const numbers = amountMatches.map(num => parseFloat(num.replace(',', '')));
      amount = Math.max(...numbers);
    }

    if (amount === 0) {
       return res.status(400).json({ message: 'Could not detect a valid total amount on the receipt.', extractedText: text });
    }

    console.log(`🎯 Extracted -> Title: ${title}, Amount: ${amount}`);

    // 4. Categorize it using our existing Hugging Face AI!
    const category = await categorizeExpense(title);

    // 5. Save to database
    const newExpense = new Expense({
      user: req.user.id,
      title: title,
      amount: amount,
      category: category
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: 'Receipt processed successfully!',
      expense: savedExpense
    });

  } catch (error) {
    console.error('Error processing receipt:', error);
    res.status(500).json({ message: 'Server error while processing receipt.' });
  }
};
// DELETE: Remove an expense by ID
const deleteExpense = async (req, res) => {
  try {
    // 1. Find the expense by the ID passed in the URL
    const expense = await Expense.findById(req.params.id);

    // 2. If it doesn't exist, return a 404
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    // 3. Security check: Make sure the logged-in user actually owns this expense!
    if (expense.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized to delete this expense' });
    }

    // 4. Delete it from the database
    await expense.deleteOne();
    
    res.json({ message: 'Expense successfully deleted' });
  } catch (err) {
    console.error('Delete Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
};
// 👇 Don't forget to export the new function!
module.exports = { addExpense, getExpenses, getExpenseSummary, exportExpensesCsv, importExpensesCsv, uploadReceipt, deleteExpense };