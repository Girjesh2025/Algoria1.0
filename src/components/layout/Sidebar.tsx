import { type FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home,
  LineChart,
  Activity,
  BarChart4,
  FileBarChart,
  ChevronsLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { useState, useEffect } from 'react';
import VersionDisplay from '../VersionDisplay';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  isOpen?: boolean;
}

const Sidebar: FC<SidebarProps> = ({ isOpen = true }) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const { isDark } = useTheme();

  // Reset collapsed state when isOpen changes
  useEffect(() => {
    if (!isOpen) {
      setCollapsed(true);
    }
  }, [isOpen]);

  const menuItems = [
    {
      name: 'Home',
      path: '/',
      icon: <Home size={collapsed ? 20 : 18} className="text-white" />
    },
    {
      name: 'Strategy',
      path: '/strategy',
      icon: <LineChart size={collapsed ? 20 : 18} className="text-white" />
    },
    {
      name: 'Live Strategy',
      path: '/live-strategy',
      icon: <Activity size={collapsed ? 20 : 18} className="text-white" />
    },
    {
      name: 'Live Signals',
      path: '/live-signals',
      icon: <TrendingUp size={collapsed ? 20 : 18} className="text-indigo-200" />,
      badge: { text: 'Live', color: isDark ? 'bg-indigo-600' : 'bg-indigo-500' },
      customStyle: 'from-indigo-600/20 to-transparent'
    },
    {
      name: 'Signal Report',
      path: '/signal-report',
      icon: <FileBarChart size={collapsed ? 20 : 18} className="text-amber-200" />,
      badge: { text: 'Report', color: isDark ? 'bg-amber-600' : 'bg-amber-500' },
      customStyle: 'from-amber-600/20 to-transparent'
    },
    {
      name: 'Trades',
      path: '/trades',
      icon: <BarChart4 size={collapsed ? 20 : 18} className="text-emerald-200" />,
      badge: { text: 'Portfolio', color: isDark ? 'bg-emerald-600' : 'bg-emerald-500' },
      customStyle: 'from-emerald-600/20 to-transparent'
    },
  ];

  const isActive = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/dashboard')) return true;
    if (path !== '/' && location.pathname === path) return true;
    return false;
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-b h-screen transition-all duration-300 shadow-lg relative",
        isDark ? "from-teal-800 to-teal-900" : "from-teal-600 to-teal-700",
        collapsed ? "w-[70px]" : "w-[200px]"
      )}
      style={{ zIndex: 50 }}
    >
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 bg-white rounded-full p-1 shadow-md text-teal-600 hover:text-teal-800 transition-colors z-10"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronsLeft size={16} />}
      </button>

      <div className="p-4 flex justify-center border-b border-teal-500/30 pt-16">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-white rounded-full overflow-hidden mb-2 ring-2 ring-white/30 shadow-md">
            <img src="https://i.pravatar.cc/120?img=68" alt="User avatar" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <>
              <span className="text-sm font-medium text-white">Girjesh</span>
              <div className="flex items-center mt-1">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-1.5" />
                <span className="text-xs text-teal-100">Online</span>
              </div>
            </>
          )}
          {collapsed && <span className="w-2 h-2 bg-green-400 rounded-full mt-1" />}
        </div>
      </div>

      <nav className="mt-6 px-2">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center py-3 px-3 rounded-lg mb-1 transition-all duration-200 group relative overflow-hidden",
                active
                  ? "bg-white/15 text-white"
                  : "text-teal-100 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className={cn(
                "relative z-10 transition-transform",
                active && !collapsed ? "transform scale-110" : ""
              )}>
                {item.icon}
              </div>
              {!collapsed && (
                <div className="flex items-center flex-grow">
                  <span className={cn(
                    "ml-3 text-sm transition-all duration-200 relative z-10",
                    active ? "font-medium" : ""
                  )}>
                    {item.name}
                  </span>

                  {item.badge && (
                    <span className={cn(
                      "ml-auto text-[10px] text-white px-1.5 py-0.5 rounded-full font-medium",
                      item.badge.color
                    )}>
                      {item.badge.text}
                    </span>
                  )}
                </div>
              )}
              {active && (
                <div className={cn(
                  "absolute inset-0 bg-gradient-to-r opacity-50",
                  item.customStyle || (isDark ? 'from-teal-600/20 to-transparent' : 'from-teal-500/20 to-transparent')
                )} />
              )}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <div className="absolute bottom-6 left-0 right-0 px-4">
          <VersionDisplay />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
