import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import { ApiProvider } from './context/ApiContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages
import Dashboard from './pages/Dashboard';
import Strategy from './pages/Strategy';
import LiveStrategy from './pages/LiveStrategy';
import LiveSignals from './pages/LiveSignals';
import SignalReport from './pages/SignalReport';
import Trades from './pages/Trades';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AppProvider>
          <ApiProvider>
            <NotificationProvider>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/strategy" element={<Strategy />} />
                <Route path="/live-strategy" element={<LiveStrategy />} />
                <Route path="/live-signals" element={<LiveSignals />} />
                <Route path="/signal-report" element={<SignalReport />} />
                <Route path="/trades" element={<Trades />} />
                <Route path="/auth-callback" element={<AuthCallback />} />
              </Routes>
            </NotificationProvider>
          </ApiProvider>
        </AppProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;
