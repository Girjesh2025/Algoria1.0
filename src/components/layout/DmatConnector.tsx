import { useAppContext } from '../../context/AppContext';
import { cn } from '../../utils/cn';
import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';

interface DmatConnectorProps {
  className?: string;
}

const DmatConnector: React.FC<DmatConnectorProps> = ({ className }) => {
  const { isDmatConnected, toggleDmatConnection } = useAppContext();
  const location = useLocation();
  const { showToast } = useNotifications();
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Determine styling based on current page
  const getPageAccent = () => {
    const path = location.pathname;

    if (path.includes('/live-signals')) {
      return 'indigo';
    }
    if (path.includes('/signal-report')) {
      return 'amber';
    }
    if (path.includes('/trades')) {
      return 'emerald';
    }
    return 'teal';
  };

  const accent = getPageAccent();

  // Handle DMAT connection toggle with animation and feedback
  const handleToggle = () => {
    setIsAnimating(true);
    toggleDmatConnection();

    // Show toast notification based on connection state
    if (!isDmatConnected) {
      showToast('DMAT connection established', 'success');
    } else {
      showToast('DMAT connection disconnected', 'warning');
    }

    // Reset animation state after 500ms
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="relative">
      <button
        onClick={handleToggle}
        onMouseEnter={() => setIsTooltipVisible(true)}
        onMouseLeave={() => setIsTooltipVisible(false)}
        className={cn(
          "flex items-center space-x-1 px-3 py-1 bg-gray-800/20 rounded-full text-sm transition-colors",
          {
            'hover:bg-indigo-800/30': accent === 'indigo',
            'hover:bg-amber-800/30': accent === 'amber',
            'hover:bg-emerald-800/30': accent === 'emerald',
            'hover:bg-teal-800/30': accent === 'teal',
          },
          isAnimating && "animate-pulse",
          className
        )}
      >
        <span className="font-medium">DMAT</span>
        <div className={cn(
          "w-8 h-4 rounded-full p-0.5 flex items-center transition-colors duration-300",
          isDmatConnected
            ? {
                'bg-indigo-600': accent === 'indigo',
                'bg-amber-600': accent === 'amber',
                'bg-emerald-600': accent === 'emerald',
                'bg-teal-600': accent === 'teal',
              }
            : 'bg-gray-700/30'
        )}>
          <div
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              isDmatConnected
                ? cn("translate-x-full bg-white", {
                    'bg-indigo-100': accent === 'indigo',
                    'bg-amber-100': accent === 'amber',
                    'bg-emerald-100': accent === 'emerald',
                    'bg-teal-100': accent === 'teal',
                  })
                : "translate-x-0 bg-gray-400"
            )}
          />
        </div>
      </button>

      {/* Tooltip */}
      {isTooltipVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50">
          {isDmatConnected ? 'Disconnect DMAT Account' : 'Connect DMAT Account'}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}

      {/* Connection status indicator */}
      <div className={cn(
        "absolute -top-1 -right-1 w-2 h-2 rounded-full transition-colors duration-300",
        isDmatConnected ? "bg-green-500" : "bg-gray-400"
      )}>
        {isDmatConnected && (
          <div className="absolute inset-0 rounded-full animate-ping bg-green-400 opacity-75"></div>
        )}
      </div>
    </div>
  );
};

export default DmatConnector;
