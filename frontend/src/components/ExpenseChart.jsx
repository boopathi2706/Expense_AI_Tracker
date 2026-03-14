import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

// We have to register the Chart.js elements we want to use
ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ expenses }) => {
  // 1. Group the expenses by category and sum up the amounts
  const categoryTotals = expenses.reduce((acc, expense) => {
    // If the category doesn't exist in our accumulator yet, start it at 0
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  // 2. Format the data perfectly for Chart.js
  const data = {
    labels: Object.keys(categoryTotals), // e.g., ['Food', 'Travel', 'Utilities']
    datasets: [
      {
        data: Object.values(categoryTotals), // e.g., [45.50, 15.00, 120.00]
        backgroundColor: [
          '#3B82F6', // Blue
          '#EF4444', // Red
          '#10B981', // Green
          '#F59E0B', // Yellow
          '#8B5CF6', // Purple
          '#EC4899', // Pink
        ],
        hoverOffset: 4,
        borderWidth: 1,
      },
    ],
  };

  // 3. If there are no expenses, don't try to draw an empty chart
  if (expenses.length === 0) {
    return <p className="py-10 text-center text-gray-500">Add some expenses to see your chart!</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <h3 className="mb-4 text-lg font-bold text-gray-800">Spending Breakdown</h3>
      <div className="w-64 h-64">
        <Pie 
          data={data} 
          options={{
            plugins: {
              legend: { position: 'bottom' }
            },
            maintainAspectRatio: false 
          }} 
        />
      </div>
    </div>
  );
};

export default ExpenseChart;