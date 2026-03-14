import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Import Components
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import KPISummary from '../components/KPISummary';
import ManualExpenseForm from '../components/ManualExpenseForm';
import ReceiptUpload from '../components/ReceiptUpload';
import BulkImport from '../components/BulkImport';
import MonthlyBarChart from '../components/MonthlyBarChart';
import WeeklyBarChart from '../components/WeeklyBarChart';
import DailyBarChart from '../components/DailyBarChart';
import TransactionList from '../components/TransactionList';
import BudgetLimits from '../components/BudgetLimits';
import Toast from '../components/Toast';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // 👈 Controls mobile sidebar

  const [expenses, setExpenses] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // { message, type }
  
  // Chart Filters
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeekStart, setSelectedWeekStart] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - d.getDay());
    return d;
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(response.data);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    }
  };

  const handleExpenseAdded = (newExpense, alertMsg) => {
    setExpenses([newExpense, ...expenses]);
    showToast('Expense added successfully!', 'success');
    if (alertMsg) {
      setNotifications((prev) => [{ id: Date.now(), message: alertMsg }, ...prev]);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Helper for Back Button
  const renderBackButton = () => (
    <button onClick={() => setActiveTab('overview')} className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors mb-4 group">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to Overview
    </button>
  );

  // 👈 NEW: A helper function to render the correct content based on the active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2">Dashboard Overview</h2>
            <KPISummary expenses={expenses} />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
               <MonthlyBarChart expenses={expenses} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
               <TransactionList expenses={expenses.slice(0, 5)} setExpenses={setExpenses} setError={setError} />
            </div>
          </div>
        );
     case 'budget':
      return (
    <div className="space-y-6 animate-fade-in">
      {renderBackButton()}
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2">Budget Limits</h2>
      <BudgetLimits expenses={expenses} showToast={showToast} /> 
    </div>
  );
      case 'add':
        return (
          <div className="space-y-6 animate-fade-in">
            {renderBackButton()}
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2">Add New Expenses</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <ManualExpenseForm onExpenseAdded={handleExpenseAdded} setError={setError} showToast={showToast} />
              <ReceiptUpload onExpenseAdded={handleExpenseAdded} setError={setError} showToast={showToast} />
              <div className="md:col-span-2">
                <BulkImport onImportSuccess={fetchExpenses} />
              </div>
            </div>
          </div>
        );
      case 'analytics':
        return (
          <div className="space-y-6 animate-fade-in">
            {renderBackButton()}
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2">Detailed Analytics</h2>
            <div className="flex flex-col gap-6 w-full">
              {/* Row 1: Monthly Chart */}
              <div className="w-full">
                <MonthlyBarChart expenses={expenses} selectedYear={selectedYear} setSelectedYear={setSelectedYear} />
              </div>
              {/* Row 2: Weekly and Daily Charts */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 w-full">
                <WeeklyBarChart expenses={expenses} selectedYear={selectedYear} selectedMonth={selectedMonth} setSelectedMonth={setSelectedMonth} />
                <DailyBarChart expenses={expenses} selectedYear={selectedYear} selectedMonth={selectedMonth} selectedWeekStart={selectedWeekStart} setSelectedWeekStart={setSelectedWeekStart} />
              </div>
            </div>
          </div>
        );
      case 'transactions':
        return (
          <div className="space-y-6 animate-fade-in">
            {renderBackButton()}
            <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white pb-2">All Transactions</h2>
            <TransactionList expenses={expenses} setExpenses={setExpenses} setError={setError} showToast={showToast} />
          </div>
        );
      default:
        return <KPISummary expenses={expenses} />;
    }
  };

  return (
    // 👈 NEW: h-screen and overflow-hidden prevent the whole page from scrolling
    <div className="flex h-screen bg-black overflow-hidden relative">
      {/* Background Blobs for Dashboard */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-800 rounded-full mix-blend-screen filter blur-[100px] opacity-20 pointer-events-none"></div>
      
      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: Fixed on desktop, transforms on mobile */}
      <div className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false); }} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Navbar stays fixed at the top of the content area */}
        <Navbar 
          notifications={notifications} 
          setNotifications={setNotifications} 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} 
        />

        {/* This main tag is the ONLY part that scrolls */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 z-10 relative">
          {error && <p className="p-3 mb-6 text-red-700 bg-red-100 rounded shadow">{error}</p>}
          
          {/* Render the selected view */}
          {renderContent()}
          
          {toast && (
            <Toast 
              message={toast.message} 
              type={toast.type} 
              onClose={() => setToast(null)} 
            />
          )}
          
        </main>
      </div>
    </div>
  );
};

export default Dashboard;