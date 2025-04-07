import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Strategy from './pages/Strategy';
import LiveStrategy from './pages/LiveStrategy';
import LiveSignals from './pages/LiveSignals';
import SignalReport from './pages/SignalReport';
import Trades from './pages/Trades';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { useEffect } from 'react';

const App = () => {
  // Initialize theme on app load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
      document.documentElement.classList.add('dark');
      document.body.style.backgroundColor = '#121212';
      document.body.style.color = '#f3f4f6';
    } else {
      document.documentElement.classList.remove('dark');
      document.body.style.backgroundColor = '#f3f4f6';
      document.body.style.color = '#1f2937';
    }
  }, []);

  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen transition-theme">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/strategy" element={<Strategy />} />
                <Route path="/live-strategy" element={<LiveStrategy />} />
                <Route path="/live-signals" element={<LiveSignals />} />
                <Route path="/signal-report" element={<SignalReport />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
