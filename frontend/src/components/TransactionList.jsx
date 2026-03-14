import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';

const TransactionList = ({ expenses, setExpenses, showToast }) => {
  
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(expenses.filter(expense => expense._id !== id));
      showToast('Transaction deleted successfully!', 'success');
    } catch (err) {
      showToast(`Failed to delete expense.,${err}`);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Expense Report', 14, 15);
    const tableRows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(),
      e.title,
      e.category,
      `₹${e.amount.toFixed(2)}`,
    ]);
    autoTable(doc, {
      head: [['Date', 'Title', 'Category', 'Amount']],
      body: tableRows,
      startY: 20,
      theme: 'striped',
    });
    doc.save('expense_report.pdf');
  };

  const exportCSV = () => {
    if (expenses.length === 0) return;
    const headers = ['Date', 'Title', 'Category', 'Amount'];
    const rows = expenses.map(e => [
      new Date(e.date).toLocaleDateString(), `"${e.title}"`, e.category, e.amount.toFixed(2)
    ]);
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'expense_report.csv';
    link.click();
  };

  return (
    <div className="p-6 glass-card">
      <div className="flex flex-col items-start justify-between mb-4 sm:flex-row sm:items-center">
        <h2 className="mb-2 text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 sm:mb-0">Recent Transactions</h2>
        <div className="flex space-x-3">
          <button onClick={exportCSV} disabled={expenses.length === 0} className={`px-4 py-2 text-sm font-bold border rounded-lg transition-all duration-300 ${expenses.length === 0 ? 'bg-gray-800 text-gray-600 border-gray-700' : 'bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20'}`}>Export CSV</button>
          <button onClick={exportPDF} disabled={expenses.length === 0} className={`px-4 py-2 text-sm font-bold border rounded-lg transition-all duration-300 ${expenses.length === 0 ? 'bg-gray-800 text-gray-600 border-gray-700' : 'bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20'}`}>Download PDF</button>
        </div>
      </div>
      
      {expenses.length === 0 ? (
        <p className="text-center text-gray-500">No expenses found.</p>
      ) : (
        <ul className="divide-y divide-gray-800">
          {expenses.map((expense) => (
            <li key={expense._id} className="flex items-center justify-between py-4 hover:bg-gray-800/40 px-2 rounded-lg transition-colors -mx-2">
              <div>
                <p className="text-lg font-bold text-gray-200">{expense.title}</p>
                <span className="inline-block px-3 py-1 mt-1 text-xs font-bold text-purple-400 bg-purple-500/10 rounded-full border border-purple-500/20">{expense.category}</span>
                <p className="mt-1 text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xl font-black text-gray-200">₹{expense.amount.toFixed(2)}</span>
                <button onClick={() => handleDelete(expense._id)} className="p-2 text-red-400 bg-red-500/10 rounded-full hover:bg-red-500/20 hover:text-red-300 transition-colors" title="Delete Expense">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;