import React from 'react';
import { Performance } from '../types/audit';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  performance: Performance;
}

export const PerformanceSection: React.FC<Props> = ({ performance }) => {
  // Convert load time string to milliseconds for score calculation
  const loadTimeMs = parseInt(performance.loadTime.replace(/[^0-9]/g, ''));
  const performanceScore = Math.max(0, Math.min(100, 100 - (loadTimeMs / 100)));

  const chartData = {
    labels: ['Performance', 'Room for Improvement'],
    datasets: [
      {
        data: [performanceScore, 100 - performanceScore],
        backgroundColor: [
          'rgb(34, 197, 94)',
          'rgb(229, 231, 235)',
        ],
        borderWidth: 0,
      },
    ],
  };

  const chartOptions = {
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => {
            return `${context.label}: ${Math.round(context.raw)}%`;
          }
        }
      }
    },
    maintainAspectRatio: true,
    responsive: true,
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Performance Metrics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Load Time</h3>
            <p className="text-gray-600">{performance.loadTime}</p>
          </div>

          {performance.cacheStrategy && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Cache Strategy</h3>
              <p className="text-gray-600">{performance.cacheStrategy}</p>
            </div>
          )}

          {performance.bottlenecks && performance.bottlenecks.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Known Bottlenecks</h3>
              <ul className="list-disc list-inside text-gray-600">
                {performance.bottlenecks.map((bottleneck, index) => (
                  <li key={index}>{bottleneck}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <div className="relative w-48 h-48">
            <Doughnut data={chartData} options={chartOptions} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold">{Math.round(performanceScore)}%</span>
                <div className="text-sm text-gray-500">Performance</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};