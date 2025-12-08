import CloseIcon from '@mui/icons-material/Close';
import BarChartIcon from '@mui/icons-material/BarChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import CandlestickChartIcon from '@mui/icons-material/CandlestickChart';
import SpeedIcon from '@mui/icons-material/Speed';
import BubbleChartIcon from '@mui/icons-material/BubbleChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import WaterfallChartIcon from '@mui/icons-material/WaterfallChart';
import { useState, useEffect } from 'react';

interface ChartSidebarProps {
  onChartSelect?: (chartTypes: string[]) => void;
  onClose?: () => void;
  selectedCharts?: string[];
}

interface ChartOption {
  id: string;
  name: string;
  icon: React.ReactNode;
  subtitle: string;
}

// Loader component
const Loader = () => (
  <div className="animate-spin">
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#5B21B6" strokeWidth="3" strokeLinecap="round" strokeDasharray="15 30" />
    </svg>
  </div>
);

export default function ChartSidebar({ onChartSelect, onClose, selectedCharts: initialSelectedCharts = [] }: ChartSidebarProps) {
  const [selectedCharts, setSelectedCharts] = useState<string[]>(initialSelectedCharts);
  const [loadingChart, setLoadingChart] = useState<string | null>(null);

  useEffect(() => {
    setSelectedCharts(initialSelectedCharts);
  }, [initialSelectedCharts]);

  const chartOptions: ChartOption[] = [
    {
      id: 'bar',
      name: 'Bar Chart',
      icon: <BarChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'mixed',
      name: 'Mixed Chart',
      icon: <ShowChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Distribution'
    },
    {
      id: 'box',
      name: 'Box Plot',
      icon: <CandlestickChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Distribution'
    },
    {
      id: 'kpi',
      name: 'KPI',
      icon: <SpeedIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Key Metric'
    },
    {
      id: 'bubble',
      name: 'Bubble Chart',
      icon: <BubbleChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'pie',
      name: 'Pie Chart',
      icon: <PieChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    },
    {
      id: 'waterfall',
      name: 'Waterfall Chart',
      icon: <WaterfallChartIcon sx={{ fontSize: '2rem' }} />,
      subtitle: 'Compare Value'
    }
  ];

  const handleChartClick = (chartType: string) => {
    const newSelection = selectedCharts.includes(chartType)
      ? [] // If clicking the same chart, deselect it
      : [chartType]; // Otherwise, replace with the new chart

    setSelectedCharts(newSelection);

    // Show loader briefly after selection
    setLoadingChart(chartType);
    setTimeout(() => {
      setLoadingChart(null);
    }, 400);

    if (onChartSelect) {
      onChartSelect(newSelection);
    }
  };

  return (
    <div className="fixed top-0 right-0 w-80 bg-white shadow-lg h-screen border-l overflow-y-auto z-50">
      <div className="sticky top-0 bg-white z-10 p-4 border-b">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recommended Graph</h3>
            <p className="text-xs text-gray-500 mt-0.5">Table: Product Details</p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-md transition"
              aria-label="Close sidebar"
            >
              <CloseIcon sx={{ fontSize: '1.25rem' }} className="text-gray-500" />
            </button>
          )}
        </div>
        {selectedCharts.length > 0 && (
          <div className="mt-3 text-xs text-blue-600 font-medium">
            {selectedCharts.length} chart selected
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {chartOptions.map((chart) => {
            const isSelected = selectedCharts.includes(chart.id);
            const isLoading = loadingChart === chart.id;

            return (
              <button
                key={chart.id}
                onClick={() => handleChartClick(chart.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-lg transition cursor-pointer border-2 ${isSelected
                    ? 'border-transparent bg-purple-100 shadow-sm'
                    : 'border-transparent bg-gray-50 hover:border-purple-600 hover:shadow-sm'
                  }`}
              >
                <div className={`w-full aspect-square flex items-center justify-center rounded-lg mb-2 relative ${isSelected ? 'bg-purple-200' : 'bg-gray-100'
                  }`}>
                  {isLoading ? (
                    <Loader />
                  ) : (
                    <>
                      <div className={isSelected ? 'text-purple-700' : 'text-gray-700'}>
                        {chart.icon}
                      </div>

                    </>
                  )}
                </div>
                <h4 className={`text-sm font-semibold text-center ${isSelected ? 'text-purple-700' : 'text-gray-900'
                  }`}>
                  {chart.name}
                </h4>
                <p className={`text-xs ${isSelected ? 'text-purple-500' : 'text-gray-500'}`}>
                  {chart.subtitle}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}