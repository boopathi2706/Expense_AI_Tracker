import { useState } from 'react';
import axios from 'axios';

const ManualExpenseForm = ({ onExpenseAdded, setError, showToast }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setError('');
    showToast('AI is processing your entry...', 'ai');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/expenses`,
        { title, amount: Number(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onExpenseAdded(response.data.expense, response.data.alert);
      setTitle('');
      setAmount('');
    } catch (err) {
      setError('Failed to add expense. Please try again.');
    }
  };

  return (
    <div className="p-6 glass-card">
      <h3 className="mb-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Add Expense</h3>
      <form onSubmit={handleAddExpense} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">Title / Store</label>
          <input 
            type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input"
            placeholder="e.g., Starbucks"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">Amount (₹)</label>
          <input 
            type="number" step="0.01" required value={amount} onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 rounded-xl glass-input"
            placeholder="5.50"
          />
        </div>
        <button type="submit" className="w-full px-4 py-3 font-bold rounded-xl glass-button">
          Add Manual Expense
        </button>
      </form>
    </div>
  );
};

export default ManualExpenseForm;