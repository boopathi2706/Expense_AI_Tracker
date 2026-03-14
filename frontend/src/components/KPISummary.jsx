const KPISummary = ({ expenses }) => {
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalTransactions = expenses.length;

  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
  
  const topCategory = Object.keys(categoryTotals).length > 0 
    ? Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b) 
    : 'N/A';

  const kpiItems = [
    { title: "Total Expenses", value: totalSpent.toFixed(2), icon: "∑", color: "from-purple-500 to-indigo-500", bg: "bg-purple-900/20", border: "border-purple-500/30" },
    { title: "Highest Category", value: topCategory, icon: "★", color: "from-fuchsia-500 to-pink-500", bg: "bg-fuchsia-900/20", border: "border-fuchsia-500/30" },
    { title: "Avg per Expense", value: totalTransactions > 0 ? (totalSpent / totalTransactions).toFixed(2) : '0.00', icon: "~", color: "from-violet-500 to-purple-500", bg: "bg-violet-900/20", border: "border-violet-500/30" }
  ];

  return (
    <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
      {kpiItems.map((item, index) => (
        <div key={index} className={`p-6 glass-card border-l-4 ${item.border} group relative overflow-hidden`}>
          <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 ${item.bg} rounded-full blur-xl group-hover:${item.bg.replace('/20', '/30')} transition-all`}></div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold tracking-wider text-slate-400 uppercase">{item.title}</p>
            <div className={`flex items-center justify-center w-12 h-12 text-xl font-bold rounded-2xl shadow-inner text-white bg-gradient-to-br ${item.color}`}>
              {item.icon}
            </div>
          </div>
          <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-slate-200 to-slate-500 mt-2">
            {item.title === "Total Expenses" || item.title === "Avg per Expense" ? `$${item.value}` : item.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default KPISummary;