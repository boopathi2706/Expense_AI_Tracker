import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyBarChart = ({ expenses, selectedYear, setSelectedYear }) => {
  const years = Array.from(new Set([...expenses.map(e => new Date(e.date).getFullYear()), new Date().getFullYear()])).sort((a,b) => b-a);

  const monthlyTotals = Array(12).fill(0);
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    if (d.getFullYear() === Number(selectedYear)) monthlyTotals[d.getMonth()] += exp.amount;
  });

  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{ label: 'Monthly', data: monthlyTotals, backgroundColor: '#3B82F6' }]
  };

  return (
    <div className="p-6 glass-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-200">Yearly Overview</h3>
        <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="px-3 py-1 text-sm rounded-lg glass-input">
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>
      <div className="h-72 w-full"><Bar 
  id="monthly-chart" 
  data={data} 
  options={{ 
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }, 
    scales: { 
      y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
      x: { grid: { display: false }, ticks: { color: '#9ca3af' } } 
    } 
  }} 
/></div>
    </div>
  );
};
export default MonthlyBarChart;