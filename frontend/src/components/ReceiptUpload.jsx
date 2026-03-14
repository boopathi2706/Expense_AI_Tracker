import { useState } from 'react';
import axios from 'axios';

const ReceiptUpload = ({ onExpenseAdded, setError, showToast }) => {
  const [receipt, setReceipt] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadReceipt = async (e) => {
    e.preventDefault();
    if (!receipt) return;
    
    setError('');
    setIsUploading(true);
    showToast('AI is analyzing your receipt...', 'ai');
    const formData = new FormData();
    formData.append('receipt', receipt);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/expenses/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      
      onExpenseAdded(response.data.expense);
      setReceipt(null);
      document.getElementById('receipt-upload').value = ''; 
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process receipt.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 glass-card">
      <h3 className="mb-4 text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">Scan Receipt (AI)</h3>
      <form onSubmit={handleUploadReceipt} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-300">Upload Image (.jpg, .png)</label>
          <input 
            type="file" id="receipt-upload" accept="image/*" onChange={(e) => setReceipt(e.target.files[0])}
            className="w-full mt-1 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-purple-500/30 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 file:backdrop-blur-md file:transition-colors cursor-pointer"
          />
        </div>
        <button 
          type="submit" disabled={!receipt || isUploading}
          className={`w-full px-4 py-3 font-bold rounded-xl flex justify-center items-center transition-all ${!receipt || isUploading ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' : 'glass-button'}`}
        >
          {isUploading ? 'Scanning with AI...' : 'Upload & Extract'}
        </button>
      </form>
    </div>
  );
};

export default ReceiptUpload;