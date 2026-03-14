import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ notifications, setNotifications, toggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between p-4 z-20 backdrop-blur-xl bg-gray-900/50 border-b border-gray-800 shadow-sm sticky top-0">
      <div className="flex items-center gap-3">
        {/* Hamburger Menu (Mobile Only) */}
        <button 
          onClick={toggleSidebar}
          className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
        <h1 className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">ExpenseAI</h1>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)} 
            className="relative p-2 text-gray-300 transition-colors bg-gray-800/50 rounded-full hover:bg-gray-700/80 focus:outline-none shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 flex w-3 h-3">
                <span className="absolute inline-flex w-full h-full bg-red-400 rounded-full opacity-75 animate-ping"></span>
                <span className="relative inline-flex w-3 h-3 bg-red-500 rounded-full"></span>
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 z-50 w-64 mt-2 bg-gray-900 rounded-md shadow-xl text-gray-200 border border-gray-700">
              <div className="flex items-center justify-between p-3 font-bold border-b border-gray-700 bg-gray-800 rounded-t-md">
                <span>Alerts</span>
                {notifications.length > 0 && (
                  <button onClick={() => setNotifications([])} className="text-xs text-purple-400 hover:text-purple-300">
                    Clear All
                  </button>
                )}
              </div>
              <ul className="overflow-y-auto max-h-60">
                {notifications.length === 0 ? (
                  <li className="p-4 text-sm text-center text-gray-500">No new alerts! You are on budget.</li>
                ) : (
                  notifications.map((n) => (
                    <li key={n.id} className="p-3 text-sm text-red-600 border-b hover:bg-red-50">⚠️ {n.message}</li>
                  ))
                )}
              </ul>
            </div>
          )}
        </div>
        <button onClick={handleLogout} className="px-5 py-2 text-sm font-bold text-white transition-all rounded-xl glass-button">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;