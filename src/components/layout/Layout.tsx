import type { FC, ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useState, useEffect } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: ReactNode;
  pageName: string;
  showRefresh?: boolean;
}

const Layout: FC<LayoutProps> = ({ children, pageName, showRefresh }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setMenuOpen(false);
      } else {
        setMenuOpen(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Make sure we clean up event listeners when component unmounts
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen w-full overflow-hidden transition-theme",
      isDark ? "bg-gray-900" : "bg-gray-50"
    )}>
      {/* Header positioned above everything */}
      <div className="z-50 relative">
        <Header
          pageName={pageName}
          showRefresh={showRefresh}
          onMenuToggle={toggleMenu}
        />
      </div>

      <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden relative">
        {/* Fixed sidebar position with proper z-index */}
        <div
          className={cn(
            "transition-transform duration-300 ease-in-out fixed top-[64px] left-0 z-40 h-[calc(100vh-64px)]",
            menuOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <Sidebar isOpen={menuOpen} />
        </div>

        {/* Overlay for mobile */}
        {menuOpen && isMobile && (
          <div
            className="fixed inset-0 top-[64px] bg-black bg-opacity-50 z-30"
            onClick={() => setMenuOpen(false)}
          />
        )}

        {/* Main content with appropriate margin to account for sidebar */}
        <main
          className={cn(
            "flex-1 overflow-auto transition-all duration-300 pt-0",
            menuOpen ? "ml-[200px]" : "ml-0",
            isDark ? "bg-gray-900" : "bg-gray-50"
          )}
          style={{ height: 'calc(100vh - 64px)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
