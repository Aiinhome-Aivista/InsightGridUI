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
  gap?: string;
  
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
  
  backgroundColor = '#f3f4f6',
  activeBackgroundColor = '#ffffff',
  textColor = '#6b7280',
  activeTextColor = '#111827',
  hoverTextColor = '#374151',
  
  borderRadius = '0.5rem',
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
  
  const buttonWidth = `calc(${100 / options.length}% - ${gap})`;
  
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
      className="relative inline-flex"
      style={{
        backgroundColor,
        borderRadius,
        padding: '0.25rem',
        gap,
        width,
        height
      }}
    >
      {/* Sliding Active Background */}
      <div
        className="absolute transition-all"
        style={{
          top: '0.25rem',
          bottom: '0.25rem',
          backgroundColor: activeBackgroundColor,
          borderRadius: activeBorderRadius,
          boxShadow: shadow,
          left: `calc(${selected * (100 / options.length)}% + 0.25rem)`,
          width: buttonWidth,
          transitionDuration,
          transitionTimingFunction: transitionTiming
        }}
      />
      
      {/* Buttons */}
      {options.map((option, index) => (
        <button
          key={index}
          onClick={() => handleSelect(index)}
          className={`relative z-10 flex items-center justify-center transition-colors ${getFlexDirection()}`}
          style={{
            padding: buttonPadding,
            fontSize,
            fontWeight,
            borderRadius: activeBorderRadius,
            color: selected === index ? activeTextColor : textColor,
            transitionDuration,
            transitionTimingFunction: transitionTiming,
            gap: iconGap,
            flex: 1,
            minWidth: 0
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
            <span className="whitespace-nowrap">{option.label}</span>
          )}
        </button>
      ))}
    </div>
  );
}


