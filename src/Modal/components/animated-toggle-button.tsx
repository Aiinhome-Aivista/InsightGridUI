import { useState } from 'react';

interface AnimatedToggleProps {
  options: string[];
  defaultSelected?: number;
  onChange?: (selectedIndex: number) => void;
}

export default function AnimatedToggleButton({ 
  options, 
  defaultSelected = 0,
  onChange 
}: AnimatedToggleProps) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  return (
    <div className="relative inline-flex bg-gray-100 rounded-lg p-1 gap-1">
      {/* Animated Background Slider */}
      <div
        className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `calc(${selected * 50}% + 0.25rem)`,
          width: `calc(50% - 0.5rem)`
        }}
      />

      {/* Toggle Options */}
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSelect(index)}
          className={`
            relative z-10 px-6 py-2 text-sm font-medium rounded-md
            transition-colors duration-300
            ${selected === index 
              ? 'text-gray-900' 
              : 'text-gray-500 hover:text-gray-700'
            }
          `}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

// Demo Component
function Demo() {
  const [mode, setMode] = useState(0);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-lg font-semibold mb-6 text-gray-800">
          Selection Mode
        </h2>
        
        <AnimatedToggleButton 
          options={['Multi Select', 'Drag & Drop']}
          defaultSelected={0}
          onChange={(index) => {
            setMode(index);
            console.log('Selected:', index === 0 ? 'Multi Select' : 'Drag & Drop');
          }}
        />

        <div className="mt-6 text-sm text-gray-600">
          Current mode: <span className="font-medium text-gray-900">
            {mode === 0 ? 'Multi Select' : 'Drag & Drop'}
          </span>
        </div>
      </div>
    </div>
  );
}