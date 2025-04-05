import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../utils/cn';
import { useState, useEffect } from 'react';

interface ThemeToggleProps {
  className?: string;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Handle click with animation
  const handleToggle = () => {
    setIsAnimating(true);
    toggleTheme();

    // Reset animation state after transition completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  // Handle initial animation on component mount
  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  }, []);

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        onMouseEnter={() => setTooltipVisible(true)}
        onMouseLeave={() => setTooltipVisible(false)}
        className={cn(
          "p-2 rounded-full transition-all duration-300 transform",
          isAnimating && "scale-110",
          theme === 'dark'
            ? "bg-gray-800 text-yellow-300 hover:bg-gray-700"
            : "bg-blue-100 text-blue-600 hover:bg-blue-200",
          className
        )}
        title={theme === 'dark' ? "Switch to light mode" : "Switch to dark mode"}
        aria-label="Toggle theme"
      >
        {theme === 'dark' ? (
          <Sun size={18} className={cn("transition-all", isAnimating && "animate-spin-slow")} />
        ) : (
          <Moon size={18} className={cn("transition-all", isAnimating && "animate-bounce-slow")} />
        )}
      </button>

      {/* Tooltip */}
      {tooltipVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
          {theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
