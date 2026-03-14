import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const WeeklyBarChart = ({ expenses, selectedYear, selectedMonth, setSelectedMonth }) => {
  
  const handleMove = (dir) => {
    let nextMonth = Number(selectedMonth) + dir;
    if (nextMonth > 11) nextMonth = 0; 
    if (nextMonth < 0) nextMonth = 11;
    setSelectedMonth(nextMonth);
  };

  const weeklyTotals = [0, 0, 0, 0];
  expenses.forEach(exp => {
    const d = new Date(exp.date);
    // CRITICAL: Filter by BOTH Year and Month
    if (d.getFullYear() === Number(selectedYear) && d.getMonth() === Number(selectedMonth)) {
      const day = d.getDate();
      if (day <= 7) weeklyTotals[0] += exp.amount;
      else if (day <= 14) weeklyTotals[1] += exp.amount;
      else if (day <= 21) weeklyTotals[2] += exp.amount;
      else weeklyTotals[3] += exp.amount;
    }
  });

  const monthName = new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className="p-6 glass-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-200">Weekly: <span className="text-purple-400">{monthName}</span></h3>
        <div className="flex space-x-2">
          <button onClick={() => handleMove(-1)} className="px-3 py-1 text-sm rounded-lg glass-input text-gray-300 hover:text-purple-400 transition-colors">←</button>
          <button onClick={() => handleMove(1)} className="px-3 py-1 text-sm rounded-lg glass-input text-gray-300 hover:text-purple-400 transition-colors">→</button>
        </div>
      </div>
      <div className="h-72 w-full"><Bar data={{
        labels: ['W1', 'W2', 'W3', 'W4+'],
        datasets: [{ label: 'Spent', data: weeklyTotals, backgroundColor: '#8B5CF6' }]
      }} options={{
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af' } },
          x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
        }
      }} /></div>
    </div>
  );
};
export default WeeklyBarChart;