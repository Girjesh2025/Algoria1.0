import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import {
  LayoutDashboard,
  LineChart,
  Radio,
  BarChart,
  FileSpreadsheet,
  BarChart2
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const location = useLocation();
  const { theme } = useTheme();
  
  const links = [
    {
      name: 'Dashboard',
      path: '/',
      icon: <LayoutDashboard size={18} />
    },
    {
      name: 'Strategy',
      path: '/strategy',
      icon: <LineChart size={18} />
    },
    {
      name: 'Live Strategy',
      path: '/live-strategy',
      icon: <Radio size={18} />
    },
    {
      name: 'Live Signals',
      path: '/live-signals',
      icon: <BarChart size={18} />
    },
    {
      name: 'Signal Report',
      path: '/signal-report',
      icon: <FileSpreadsheet size={18} />
    },
    {
      name: 'Trades',
      path: '/trades',
      icon: <BarChart2 size={18} />
    }
  ];

  return (
    <div
      className={cn(
        "h-full w-[200px] transition-all duration-300 overflow-hidden",
        theme === 'dark' ? "bg-gray-800 text-white" : "bg-white border-r border-gray-200",
        !isOpen && "w-0"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4">
          <h2 className={cn(
            "text-lg font-semibold mb-6",
            theme === 'dark' ? "text-white" : "text-gray-800"
          )}>
            ALGORIA
          </h2>
          
          <nav className="flex flex-col space-y-1">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={cn(
                  "flex items-center px-3 py-2 rounded-md transition-colors",
                  location.pathname === link.path
                    ? (theme === 'dark' ? "bg-gray-700 text-white" : "bg-gray-100 text-blue-600")
                    : (theme === 'dark' ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100")
                )}
              >
                <span className="mr-3">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-4 border-t border-gray-700">
          <div className={cn(
            "text-xs",
            theme === 'dark' ? "text-gray-400" : "text-gray-500"
          )}>
            Version 8.7.0
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
