import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { fyersService } from '../services/FyersService';

// Market data interface
interface MarketData {
  nifty?: {
    price: number;
    change: number;
    percentChange: number;
  };
  bankNifty?: {
    price: number;
    change: number;
    percentChange: number;
  };
  topGainers?: Array<{
    symbol: string;
    change: number;
  }>;
  topLosers?: Array<{
    symbol: string;
    change: number;
  }>;
}

// API context interface
interface ApiContextType {
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  marketData: MarketData | null;
  fetchMarketData: () => Promise<void>;
  connectToFyers: () => void;
  isAuthenticated: boolean;
  disconnect: () => void;
}

// Create the context
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Provider component
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = fyersService.isAuthenticated();
      setIsAuthenticated(authenticated);
      setIsConnected(authenticated);
    };
    
    checkAuth();
  }, []);

  // Connect to Fyers API
  const connectToFyers = useCallback(() => {
    // Redirect to Fyers auth page
    const authUrl = fyersService.getAuthUrl();
    window.location.href = authUrl;
  }, []);

  // Disconnect from Fyers API
  const disconnect = useCallback(() => {
    fyersService.logout();
    setIsAuthenticated(false);
    setIsConnected(false);
    setMarketData(null);
  }, []);

  // Fetch market data from API
  const fetchMarketData = useCallback(async () => {
    if (!isAuthenticated) {
      setError('Not authenticated with Fyers');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Fetch market data for indices
      const symbols = ['NSE:NIFTY50-INDEX', 'NSE:BANKNIFTY-INDEX'];
      const quotes = await fyersService.getQuotes(symbols);
      
      if (quotes && quotes.length > 0) {
        const niftyData = quotes.find(q => q.symbol === 'NSE:NIFTY50-INDEX');
        const bankNiftyData = quotes.find(q => q.symbol === 'NSE:BANKNIFTY-INDEX');
        
        // Mock top gainers and losers for now
        const mockGainers = [
          { symbol: 'RELIANCE', change: 2.45 },
          { symbol: 'HDFCBANK', change: 1.78 },
          { symbol: 'TCS', change: 1.56 },
          { symbol: 'INFY', change: 1.23 },
          { symbol: 'ICICIBANK', change: 0.95 }
        ];
        
        const mockLosers = [
          { symbol: 'TATASTEEL', change: -2.12 },
          { symbol: 'INDUSINDBK', change: -1.89 },
          { symbol: 'AXISBANK', change: -1.67 },
          { symbol: 'SUNPHARMA', change: -1.45 },
          { symbol: 'NESTLEIND', change: -1.23 }
        ];
        
        setMarketData({
          nifty: niftyData ? {
            price: niftyData.ltp,
            change: niftyData.change,
            percentChange: niftyData.change_percentage
          } : undefined,
          bankNifty: bankNiftyData ? {
            price: bankNiftyData.ltp,
            change: bankNiftyData.change,
            percentChange: bankNiftyData.change_percentage
          } : undefined,
          topGainers: mockGainers,
          topLosers: mockLosers
        });
        
        setIsConnected(true);
      } else {
        throw new Error('No market data available');
      }
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Failed to fetch market data');
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Handle auth callback route
  useEffect(() => {
    const handleAuthCallback = async () => {
      if (window.location.pathname === '/auth-callback') {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state');
        const savedState = localStorage.getItem('fyers_auth_state');
        
        if (code && state && state === savedState) {
          try {
            setIsLoading(true);
            const success = await fyersService.getAccessToken(code);
            if (success) {
              setIsAuthenticated(true);
              setIsConnected(true);
              // Redirect to home page
              window.location.href = '/';
            } else {
              setError('Authentication failed');
            }
          } catch (err) {
            console.error('Auth error:', err);
            setError('Authentication error occurred');
          } finally {
            setIsLoading(false);
          }
        }
      }
    };
    
    handleAuthCallback();
  }, []);

  // Provide the context
  return (
    <ApiContext.Provider
      value={{
        isConnected,
        isLoading,
        error,
        marketData,
        fetchMarketData,
        connectToFyers,
        isAuthenticated,
        disconnect
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

// Custom hook for using the API context
export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};

export default ApiContext; 