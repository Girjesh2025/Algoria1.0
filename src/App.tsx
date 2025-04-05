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

const App = () => {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppProvider>
          <Router>
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
          </Router>
        </AppProvider>
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
