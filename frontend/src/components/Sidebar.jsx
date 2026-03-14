const Sidebar = ({ activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'overview', label: '📊 Overview', icon: '' },
    { id: 'add', label: '➕ Add Expense', icon: '' },
    { id: 'analytics', label: '📈 Analytics', icon: '' },
    { id: 'transactions', label: '📋 Transactions', icon: '' },
    { id: 'budget', label: '🎯 Set Budget', icon: '' },
  ];

  return (
    <div className="flex flex-col w-64 h-screen z-20 glass-panel">
      <div className="flex items-center justify-center h-20 border-b border-gray-800 mt-2">
        <h1 className="text-2xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 uppercase">Menu</h1>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center px-5 py-3.5 mb-2 text-sm font-semibold rounded-xl transition-all duration-300 ${
              activeTab === item.id
                ? 'bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 text-purple-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] border border-purple-500/30 font-bold translate-x-1'
                : 'text-gray-400 hover:bg-gray-800/50 hover:text-gray-200 border border-transparent'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-center text-gray-600">v1.2.0 • Dark UI</p>
      </div>
    </div>
  );
};

export default Sidebar;