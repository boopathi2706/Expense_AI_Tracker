const Budget = require('../models/Budget');

const getBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id });
    res.json(budgets);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const setBudget = async (req, res) => {
  const { category, limit } = req.body;
  try {
    let budget = await Budget.findOne({ user: req.user.id, category });
    if (budget) {
      budget.limit = limit;
      await budget.save();
      return res.json(budget);
    }
    budget = new Budget({ user: req.user.id, category, limit });
    await budget.save();
    res.json(budget);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id);
    if (!budget) {
      return res.status(404).json({ msg: 'Budget not found' });
    }

    // Check user
    if (budget.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    await budget.deleteOne();
    res.json({ msg: 'Budget removed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// Export them together at the bottom like this:
module.exports = {
  getBudgets,
  setBudget,
  deleteBudget
};