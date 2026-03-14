import { useState, useEffect } from 'react';
import axios from 'axios';

const BudgetLimits = ({ expenses, showToast }) => {
  const [budgets, setBudgets] = useState([]);
  const [category, setCategory] = useState('Food & Dining'); // Default category
  const [limit, setLimit] = useState('');
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // 👈 Tracks if we are editing an existing limit

  // Common categories to choose from
  const categories = [
    'Food & Dining', 'Transportation', 'Housing', 'Utilities', 
    'Entertainment', 'Shopping', 'Healthcare', 'Personal Care', 'Miscellaneous'
  ];

  useEffect(() => {
    fetchBudgets();
  }, []);

  // Fetch saved budgets from your backend
  const fetchBudgets = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/budget`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(response.data);
    } catch (err) {
      console.error("Failed to load budgets", err);
    }
  };

  // Save a new budget limit
  const handleSaveLimit = async (e) => {
    e.preventDefault();
    if (!limit || isNaN(limit)) {
      showToast("Please enter a valid number", "error");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/budget`, { 
        category, 
        limit: Number(limit) 
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      showToast(isEditing ? 'Budget updated successfully!' : 'Budget limit set successfully!', 'success');
      setLimit('');
      setIsEditing(false);
      fetchBudgets(); // Refresh the list so the new progress bar appears
    } catch (err) {
      console.error("Failed to save budget", err);
      showToast("Error saving budget limit.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEditBudget = (b) => {
    setCategory(b.category);
    setLimit(b.limit);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteBudget = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget limit?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/budget/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBudgets(budgets.filter(b => b._id !== id));
      showToast('Budget deleted successfully!', 'success');
    } catch (err) {
      console.error("Failed to delete budget", err);
      showToast("Error deleting budget limit.", "error");
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Form to Set Limits */}
      <div className="p-6 glass-card">
        <h3 className="mb-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Set Category Budget Limit</h3>
        <form onSubmit={handleSaveLimit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold mb-1 text-gray-300">Category</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl glass-input appearance-none bg-gray-800 text-gray-200"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold mb-1 text-gray-300">Monthly Limit (₹)</label>
            <input 
              type="number" 
              step="0.01"
              value={limit} 
              onChange={(e) => setLimit(e.target.value)} 
              className="w-full px-4 py-3 rounded-xl glass-input"
              placeholder="e.g. 500"
              required
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className={`w-full md:w-auto px-6 py-3 font-bold rounded-xl transition-all ${loading ? 'bg-gray-800 text-gray-600 pointer-events-none border border-gray-700' : 'glass-button'}`}
          >
            {loading ? 'Saving...' : isEditing ? 'Update Limit' : 'Set Limit'}
          </button>
          
          {isEditing && (
            <button 
              type="button"
              onClick={() => { setIsEditing(false); setLimit(''); }}
              className="w-full md:w-auto px-6 py-3 font-bold rounded-xl bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          )}
        </form>
      </div>

      {/* 2. Progress Bars Display */}
      <div>
        <h3 className="mb-4 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Budget Progress</h3>
        {budgets.length === 0 ? (
          <div className="p-6 text-center text-gray-400 glass-card">No budget limits set yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {budgets.map(b => {
              // Calculate how much has been spent in this category
              const spent = expenses
                .filter(e => e.category === b.category)
                .reduce((sum, e) => sum + e.amount, 0);
              
              // Calculate percentage for the bar
              let percent = (spent / b.limit) * 100;
              if (percent > 100) percent = 100; // Cap visual bar at 100%

              // Determine bar color based on spending
              let barColor = 'bg-green-500';
              if (percent > 75) barColor = 'bg-yellow-500';
              if (percent > 90) barColor = 'bg-red-500';

              return (
                <div key={b.category} className="p-6 glass-card relative group">
                  <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => handleEditBudget(b)}
                      className="p-2 text-gray-500 hover:text-purple-400 bg-gray-800/50 hover:bg-purple-400/10 rounded-full transition-all"
                      title="Edit Budget"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => handleDeleteBudget(b._id)}
                      className="p-2 text-gray-500 hover:text-red-500 bg-gray-800/50 hover:bg-red-500/10 rounded-full transition-all"
                      title="Delete Budget"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex justify-between items-end mb-3 mr-8">
                    <span className="font-bold text-gray-200">{b.category}</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-white">₹{spent.toFixed(2)}</span>
                      <span className="text-sm font-medium text-gray-400"> / ₹{b.limit.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-3 border border-gray-700">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ease-out ${barColor}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  {percent >= 100 && (
                    <p className="mt-2 text-xs font-bold text-red-600">Limit Exceeded!</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetLimits;