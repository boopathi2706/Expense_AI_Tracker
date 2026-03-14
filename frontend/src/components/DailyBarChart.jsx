import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useEffect } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DailyBarChart = ({ expenses, selectedYear, selectedMonth, selectedWeekStart, setSelectedWeekStart }) => {
  
  // EFFECT: If the Year or Month changes from the charts above, 
  // reset this chart to the 1st day of that Year/Month.
  useEffect(() => {
    const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
    // Align to the start of that week (Sunday)
    firstDayOfMonth.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
    setSelectedWeekStart(firstDayOfMonth);
  }, [selectedYear, selectedMonth]);

  const moveWeek = (days) => {
    const newDate = new Date(selectedWeekStart);
    newDate.setDate(newDate.getDate() + days);
    setSelectedWeekStart(newDate);
  };

  const dailyTotals = Array(7).fill(0);
  const labels = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(selectedWeekStart);
    day.setDate(selectedWeekStart.getDate() + i);
    
    // Formatting label to show which month we are currently looking at
    labels.push(day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }));
    
    expenses.forEach(exp => {
      const expDate = new Date(exp.date);
      if (expDate.toDateString() === day.toDateString()) {
        dailyTotals[i] += exp.amount;
      }
    });
  }
  return (
    <div className="p-6 glass-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-200">Daily View</h3>
        <div className="flex space-x-2 text-sm">
          <button onClick={() => moveWeek(-7)} className="px-3 py-1 rounded-lg glass-input text-gray-300 hover:text-purple-400 transition-colors">Prev</button>
          <button onClick={() => moveWeek(7)} className="px-3 py-1 rounded-lg glass-input text-gray-300 hover:text-purple-400 transition-colors">Next</button>
        </div>
      </div>
      <div className="h-72 w-full"><Bar data={{ 
        labels, 
        datasets: [{ label: 'Daily', data: dailyTotals, backgroundColor: '#8B5CF6' }] 
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
export default DailyBarChart;