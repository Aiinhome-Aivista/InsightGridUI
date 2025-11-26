import { useState } from 'react';

function Sidebar() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const collections = [
    "AI-Based Category Insights Request",
    "Product Data Classification Query",
    "Department-Wise Summary Analysis",
    "Smart Inventory Categorization Chat",
    "Dynamic Database Categorization Assistant"
  ];

  return (
    <div className="w-1/5 px-8 py-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Collection</h2>
      <div className="space-y-2">
        {collections.map((collection, index) => (
          <button
            key={index}
            onClick={() => setSelectedIndex(index)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`
              w-full text-left py-2 px-3 text-sm text-gray-600
              transition-colors duration-150 rounded
              ${selectedIndex === index 
                ? 'bg-gray-100 text-gray-700 font-medium' 
                : hoveredIndex === index 
                ? 'bg-gray-100' 
                : ''
              }
            `}
          >
            {collection}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;