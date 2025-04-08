import React from 'react';
import {
  Menu,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  BarChart4,
  FileBarChart,
  Clock,
  Bell,
  MoreVertical,
  X,
  Check,
  Info,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { useAppContext } from "../../context/AppContext";
import { useTheme } from "../../context/ThemeContext";
import DmatConnector from "./DmatConnector";
import ThemeToggle from "../ThemeToggle";
import { useNotifications } from "../../context/NotificationContext";

interface HeaderProps {
  pageName: string;
  showRefresh?: boolean;
  onMenuToggle: () => void;
}

interface IndexPrice {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  lastUpdated: Date;
}

// Notification item type
interface NotificationItem {
  id: string;
  message: string;
  time: Date;
  read: boolean;
  type: 'info' | 'success' | 'warning' | 'error';
}

// User profile menu dropdown
const UserMenuDropdown = ({ user, onClose }: { user: any, onClose: () => void }) => {
  return (
    <div className="absolute right-0 top-full mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
      </div>
      <div className="py-1">
        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          Your Profile
        </button>
        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
          Settings
        </button>
        <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-100 dark:border-gray-700">
          Sign out
        </button>
      </div>
    </div>
  );
};

// Notifications dropdown component
const NotificationsDropdown = ({ notifications, onClose, onClearAll, onMarkAsRead }: {
  notifications: NotificationItem[],
  onClose: () => void,
  onClearAll: () => void,
  onMarkAsRead: (id: string) => void
}) => {
  if (notifications.length === 0) {
    return (
      <div className="absolute right-0 top-full mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50">
        <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
        <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
          No notifications
        </div>
      </div>
    )
  }

  return (
    <div className="absolute right-0 top-full mt-2 w-80 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50 max-h-96 overflow-hidden flex flex-col">
      <div className="flex justify-between items-center p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">Notifications</h3>
        <div className="flex space-x-2">
          <button
            onClick={onClearAll}
            className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            Clear all
          </button>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1">
        {notifications.map((notification) => {
          // Get the appropriate icon based on notification type
          const getIcon = () => {
            switch (notification.type) {
              case 'success': return <Check size={16} className="text-green-500" />;
              case 'warning': return <AlertTriangle size={16} className="text-amber-500" />;
              case 'error': return <X size={16} className="text-red-500" />;
              case 'info':
              default: return <Info size={16} className="text-blue-500" />;
            }
          };

          return (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 dark:border-gray-700 ${notification.read ? 'opacity-70' : ''}`}
            >
              <div className="flex">
                <div className="flex-shrink-0 mr-3">
                  {getIcon()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900 dark:text-gray-100">{notification.message}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {notification.time.toLocaleTimeString()} - {notification.time.toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => onMarkAsRead(notification.id)}
                    className="ml-2 text-xs text-blue-600 dark:text-blue-400 whitespace-nowrap"
                  >
                    Mark read
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Header: React.FC<HeaderProps> = ({ pageName, showRefresh = false, onMenuToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useNotifications();

  // Dropdown states
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Refs for dropdown click-outside handling
  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Current time for clock
  const [currentTime, setCurrentTime] = useState("");

  // Example notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: '1',
      message: 'Your NIFTY strategy generated a new signal',
      time: new Date(Date.now() - 10 * 60000),
      read: false,
      type: 'info'
    },
    {
      id: '2',
      message: 'Portfolio value has increased by 2.5%',
      time: new Date(Date.now() - 35 * 60000),
      read: false,
      type: 'success'
    },
    {
      id: '3',
      message: 'Market closing in 30 minutes',
      time: new Date(Date.now() - 120 * 60000),
      read: true,
      type: 'warning'
    }
  ]);

  // Unread notifications count
  const notificationCount = notifications.filter(n => !n.read).length;

  // Mark notification as read
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationsOpen(false);
    showToast('All notifications cleared', 'success');
  };

  // Index prices with mock data
  const [niftyPrice, setNiftyPrice] = useState<IndexPrice>({
    symbol: 'NIFTY',
    price: 24396.18,
    change: -69.49,
    percentChange: -0.28,
    lastUpdated: new Date()
  });

  const [bankniftyPrice, setBankniftyPrice] = useState<IndexPrice>({
    symbol: 'BANKNIFTY',
    price: 51282.29,
    change: -103.07,
    percentChange: -0.20,
    lastUpdated: new Date()
  });

  // Handle click outside dropdown menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Determine current page and style
  const getCurrentPageStyle = () => {
    const path = location.pathname;

    if (path.includes('/live-signals')) {
      return {
        gradient: 'from-indigo-700 to-indigo-600',
        icon: <TrendingUp size={18} className="mr-2" />,
        accent: 'indigo',
        buttonBg: 'bg-indigo-800/30',
        buttonHoverBg: 'hover:bg-indigo-800/50'
      };
    }
    if (path.includes('/signal-report')) {
      return {
        gradient: 'from-amber-700 to-amber-600',
        icon: <FileBarChart size={18} className="mr-2" />,
        accent: 'amber',
        buttonBg: 'bg-amber-800/30',
        buttonHoverBg: 'hover:bg-amber-800/50'
      };
    }
    if (path.includes('/trades')) {
      return {
        gradient: 'from-emerald-700 to-emerald-600',
        icon: <BarChart4 size={18} className="mr-2" />,
        accent: 'emerald',
        buttonBg: 'bg-emerald-800/30',
        buttonHoverBg: 'hover:bg-emerald-800/50'
      };
    }
    return {
      gradient: 'from-teal-700 to-teal-600',
      icon: null,
      accent: 'teal',
      buttonBg: 'bg-teal-800/30',
      buttonHoverBg: 'hover:bg-teal-800/50'
    };
  };

  const pageStyle = getCurrentPageStyle();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");

      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Format price display
  const formatPrice = (price: number) => price.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  // Format change display
  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)}`;
  };

  // Format percent change display
  const formatPercentChange = (percentChange: number) => {
    const sign = percentChange >= 0 ? '+' : '';
    return `${sign}${percentChange.toFixed(2)}%`;
  };

  return (
    <header className={cn(
      "h-16 border-b border-gray-200 transition-colors duration-200",
      theme === 'dark' ? "bg-gray-800 border-gray-700" : "bg-white"
    )}>
      <div className="px-4 h-full flex items-center justify-between">
      <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className={cn(
              "p-2 rounded-md mr-4",
              theme === 'dark' ? "hover:bg-gray-700" : "hover:bg-gray-100"
            )}
          >
            <Menu size={20} className={theme === 'dark' ? "text-gray-200" : "text-gray-600"} />
          </button>
          
          <h1 className={cn(
            "text-lg font-semibold",
            theme === 'dark' ? "text-white" : "text-gray-800"
          )}>
          {pageName}
        </h1>
      </div>

            <div className="flex items-center">
          {showRefresh && (
            <button
              className={cn(
                "p-2 rounded-md mr-3",
                theme === 'dark' ? "hover:bg-gray-700 text-gray-300" : "hover:bg-gray-100 text-gray-600"
              )}
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={18} />
            </button>
          )}
          
            <button
            onClick={toggleTheme}
              className={cn(
              "p-2 rounded-md",
              theme === 'dark' 
                ? "bg-gray-700 text-yellow-300 hover:bg-gray-600" 
                : "bg-gray-100 text-blue-600 hover:bg-gray-200"
            )}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
