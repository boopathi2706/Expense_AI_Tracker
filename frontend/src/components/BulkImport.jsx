import { useState } from 'react';
import axios from 'axios';

const BulkImport = ({ onImportSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [importLog, setImportLog] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setImportLog([]);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setImportLog(["🚀 Initializing Bulk AI Import..."]);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      // Split by lines and remove empty ones
      const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
      
      if (lines.length < 2) {
        setImportLog(["❌ Error: File appears to be empty."]);
        setUploading(false);
        return;
      }

      const dataRows = lines.slice(1); // Skip header
      const token = localStorage.getItem('token');
      let successCount = 0;

      for (let i = 0; i < dataRows.length; i++) {
        // IMPROVED SPLIT: Handles spaces around commas
        const columns = dataRows[i].split(',').map(col => col.trim());
        
        const rawDate = columns[0];
        const rawTitle = columns[1];
        const rawAmount = columns[2];

        // VALIDATION
        if (!rawTitle || !rawAmount) {
          setImportLog(prev => [...prev, `⚠️ Row ${i+1}: Missing Title or Amount. Skipped.`]);
          continue;
        }

        // CLEANING
        const cleanAmount = parseFloat(rawAmount.replace(/[^0-9.-]+/g, ""));
        const cleanDate = rawDate && !isNaN(Date.parse(rawDate)) ? new Date(rawDate) : new Date();

        try {
          // Sending to backend - AI will categorize based on 'title'
          const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/expenses`, {
            title: rawTitle,
            amount: cleanAmount,
            date: cleanDate,
          }, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          successCount++;
          // Show the AI-detected category in the log!
          const detectedCat = response.data.category || "Categorized";
          setImportLog(prev => [...prev, `✔ [${detectedCat}] ${rawTitle} - ₹${cleanAmount}`]);
        } catch (err) {
          const errorDetail = err.response?.data?.message || "Check format";
          setImportLog(prev => [...prev, `❌ Failed: ${rawTitle} (${errorDetail})`]);
        }
      }

      setImportLog(prev => [...prev, `✅ FINISHED: ${successCount} items processed.`]);
      setUploading(false);
      setFile(null);
      onImportSuccess(); 
    };

    reader.readAsText(file);
  };

  return (
    <div className="p-6 mt-4 border-2 border-dashed border-gray-700 rounded-2xl bg-gray-900/40 backdrop-blur-md shadow-sm">
      <h3 className="mb-3 text-sm font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 tracking-wider">AI BULK IMPORT (CSV)</h3>
      
      <div className="flex flex-col space-y-4">
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleFileChange} 
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border file:border-purple-500/30 file:text-sm file:font-semibold file:bg-purple-500/10 file:text-purple-400 hover:file:bg-purple-500/20 file:transition-colors cursor-pointer"
        />
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className={`py-3 px-4 rounded-xl font-bold transition-all ${
            !file || uploading ? 'bg-gray-800 text-gray-600 cursor-not-allowed border border-gray-700' : 'glass-button'
          }`}
        >
          {uploading ? '🤖 AI is Categorizing...' : 'Upload to Database'}
        </button>
      </div>

      {importLog.length > 0 && (
        <div className="mt-5 p-4 bg-black/60 backdrop-blur-md text-purple-400 text-xs font-mono rounded-xl max-h-48 overflow-y-auto shadow-inner border border-gray-800 custom-scrollbar">
          {importLog.map((log, idx) => (
            <div key={idx} className="mb-1.5 border-b border-gray-800/50 pb-1.5 last:border-0">
              {log}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BulkImport;