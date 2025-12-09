import { ReactNode, useState } from 'react';

// AnimatedToggleButton Component
interface ToggleOption {
  label?: string;
  icon?: ReactNode;
  value: string | number;
}

interface AnimatedToggleButtonProps {
  options: ToggleOption[];
  defaultSelected?: number;
  onChange?: (selectedIndex: number, value: string | number) => void;
  
  // Customization props
  width?: string;
  height?: string;
  buttonPadding?: string;
  gap?: string; // Gap between buttons
  containerPadding?: string; // New prop to control outer padding safely
  
  // Color customization
  backgroundColor?: string;
  activeBackgroundColor?: string;
  textColor?: string;
  activeTextColor?: string;
  hoverTextColor?: string;
  
  // Border & Shadow
  borderRadius?: string;
  activeBorderRadius?: string;
  shadow?: string;
  
  // Typography
  fontSize?: string;
  fontWeight?: string;
  
  // Animation
  transitionDuration?: string;
  transitionTiming?: string;
  
  // Layout
  iconPosition?: 'left' | 'right' | 'top' | 'bottom';
  iconSize?: string;
  iconGap?: string;
  
  // Display mode
  mode?: 'icon' | 'text' | 'both';
}

export default function AnimatedToggleButton({ 
  options,
  defaultSelected = 0,
  onChange,
  
  // Customization with defaults
  width = 'auto',
  height = 'auto',
  buttonPadding = '0.5rem 1.5rem',
  gap = '0.25rem',
  containerPadding = '0.25rem', // Extracted for safety
  
  backgroundColor = '#FFFFFF',
  activeBackgroundColor = '#D9D9D9',
  textColor = '#6b7280',
  activeTextColor = '#111827',
  hoverTextColor = '#374151',
  
  borderRadius = '0.75rem',
  activeBorderRadius = '0.375rem',
  shadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  
  fontSize = '0.875rem',
  fontWeight = '500',
  
  transitionDuration = '300ms',
  transitionTiming = 'ease-out',
  
  iconPosition = 'left',
  iconSize = '1.25rem',
  iconGap = '0.5rem',
  
  mode = 'both'
}: AnimatedToggleButtonProps) {
  const [selected, setSelected] = useState(defaultSelected);
  
  const handleSelect = (index: number) => {
    setSelected(index);
    onChange?.(index, options[index].value);
  };
  
  // 1. Calculate the exact width of one button slot based on container size
  // Formula: (100% - Total Gaps) / Number of Items
  const totalGapSpace = `calc(${options.length - 1} * ${gap})`;
  const buttonWidth = `calc((100% - ${totalGapSpace}) / ${options.length})`;
  
  const getFlexDirection = () => {
    if (iconPosition === 'top') return 'flex-col';
    if (iconPosition === 'bottom') return 'flex-col-reverse';
    if (iconPosition === 'right') return 'flex-row-reverse';
    return 'flex-row';
  };
  
  const shouldShowIcon = mode === 'icon' || mode === 'both';
  const shouldShowText = mode === 'text' || mode === 'both';
  
  return (
    <div 
      className="relative grid items-center" // Changed to Grid
      // The container itself doesn't need inline styles for grid anymore,
      // but we'll keep the rest for customization.
      style={{
        backgroundColor,
        borderRadius,
        padding: containerPadding,
        width,
        height,
        gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))`,
        gap: gap,
      }}
    >
      {/* Sliding Active Background */}
      <div
        className="h-full" // The slider will be a grid item itself
        style={{
          gridColumn: `${selected + 1}`, // Move to the correct grid column
          gridRow: '1', // Ensure it's on the first row
          backgroundColor: activeBackgroundColor,
          borderRadius: activeBorderRadius,
          boxShadow: shadow,
          // Animate grid-column change. Note: Not all browsers animate this smoothly,
          // but for modern browsers it works well. A transform-based approach is
          // more performant but harder to get right with gaps. This is simpler and more robust.
          transitionProperty: 'grid-column, background-color',
          transitionDuration,
          transitionTimingFunction: transitionTiming
        }}
      />
      
      {/* Buttons */}
      {options.map((option, index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleSelect(index)}
          // The button is now also a grid item, placed on top of the slider
          className={`z-10 flex items-center justify-center transition-colors h-full w-full ${getFlexDirection()}`}
          style={{
            gridColumn: `${index + 1}`, // Place button in its column
            gridRow: '1', // Ensure it's on the first row
            padding: buttonPadding,
            fontSize,
            fontWeight,
            borderRadius: activeBorderRadius,
            color: selected === index ? activeTextColor : textColor,
            transitionDuration,
            transitionTimingFunction: transitionTiming,
            gap: iconGap,
            // Removed margins/flex properties as Grid handles layout now
          }}
          onMouseEnter={(e) => {
            if (selected !== index) {
              e.currentTarget.style.color = hoverTextColor;
            }
          }}
          onMouseLeave={(e) => {
            if (selected !== index) {
              e.currentTarget.style.color = textColor;
            }
          }}
        >
          {shouldShowIcon && option.icon && (
            <span style={{ fontSize: iconSize, display: 'flex', alignItems: 'center' }}>
              {option.icon}
            </span>
          )}
          {shouldShowText && option.label && (
            <span className="whitespace-nowrap truncate">{option.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}