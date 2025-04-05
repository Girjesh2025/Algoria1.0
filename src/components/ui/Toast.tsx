import { useState, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  visible: boolean;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  visible
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  const { isDark } = useTheme();

  useEffect(() => {
    setIsVisible(visible);

    if (visible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'warning':
        return <AlertTriangle size={20} className="text-amber-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getBgColor = () => {
    if (isDark) {
      switch (type) {
        case 'success': return 'bg-green-900';
        case 'error': return 'bg-red-900';
        case 'warning': return 'bg-amber-900';
        case 'info':
        default: return 'bg-blue-900';
      }
    } else {
      switch (type) {
        case 'success': return 'bg-green-50';
        case 'error': return 'bg-red-50';
        case 'warning': return 'bg-amber-50';
        case 'info':
        default: return 'bg-blue-50';
      }
    }
  };

  const getBorderColor = () => {
    if (isDark) {
      switch (type) {
        case 'success': return 'border-green-800';
        case 'error': return 'border-red-800';
        case 'warning': return 'border-amber-800';
        case 'info':
        default: return 'border-blue-800';
      }
    } else {
      switch (type) {
        case 'success': return 'border-green-200';
        case 'error': return 'border-red-200';
        case 'warning': return 'border-amber-200';
        case 'info':
        default: return 'border-blue-200';
      }
    }
  };

  const getTextColor = () => {
    if (isDark) {
      switch (type) {
        case 'success': return 'text-green-100';
        case 'error': return 'text-red-100';
        case 'warning': return 'text-amber-100';
        case 'info':
        default: return 'text-blue-100';
      }
    } else {
      switch (type) {
        case 'success': return 'text-green-800';
        case 'error': return 'text-red-800';
        case 'warning': return 'text-amber-800';
        case 'info':
        default: return 'text-blue-800';
      }
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-md animate-in fade-in slide-in-from-top-5 duration-300">
      <div className={cn(
        "flex items-start p-4 rounded-md shadow-md border",
        getBgColor(),
        getBorderColor()
      )}>
        <div className="flex-shrink-0 mr-3 mt-0.5">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className={cn("text-sm font-medium", getTextColor())}>
            {message}
          </p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            onClose();
          }}
          className={cn(
            "ml-4 flex-shrink-0 rounded-full p-1 transition-colors",
            isDark ? "hover:bg-gray-700" : "hover:bg-gray-200",
            getTextColor()
          )}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
