import { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryLimits = ({ onLimitUpdated }) => {
  const [category, setCategory] = useState('Food');
  const [limit, setLimit] = useState('');

  const saveLimit = async () => {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/budget`, { category, limit }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    alert(`Limit set for ${category}!`);
    onLimitUpdated();
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md mt-6">
      <h3 className="font-bold text-gray-700 mb-3">Set Category Budget</h3>
      <div className="flex gap-2">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border p-2 rounded flex-1">
          <option>Food</option>
          <option>Travel</option>
          <option>Entertainment</option>
          <option>Shopping</option>
          <option>Utilities</option>
        </select>
        <input 
          type="number" 
          placeholder="Limit $" 
          value={limit} 
          onChange={(e) => setLimit(e.target.value)} 
          className="border p-2 rounded w-24"
        />
        <button onClick={saveLimit} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Set</button>
      </div>
    </div>
  );
};

export default CategoryLimits;