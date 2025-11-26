import { useState } from 'react';

// AnimatedToggleButton Component
export default function AnimatedToggleButton({ 
  options, 
  defaultSelected = 0,
  onChange 
}: {
  options: string[];
  defaultSelected?: number;
  onChange?: (selectedIndex: number) => void;
}) {
  const [selected, setSelected] = useState(defaultSelected);

  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index);
  };

  return (
    <div className="relative inline-flex bg-gray-100 rounded-lg p-1 gap-1">
      <div
        className="absolute top-1 bottom-1 bg-white rounded-md shadow-sm transition-all duration-300 ease-out"
        style={{
          left: `calc(${selected * 50}% + 0.25rem)`,
          width: `calc(50% - 0.5rem)`
        }}
      />
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

