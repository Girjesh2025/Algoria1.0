import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { useApi } from '../context/ApiContext';
import BrokerConnectionDialog from '../components/BrokerConnectionDialog';
import LineChart from '../components/charts/LineChart';
import PieChart from '../components/charts/PieChart';
import { getDashboardStats, getMarketOverview, getPnlChartData } from '../services/DataService';
import { DashboardStats, MarketOverview, ChartDataPoint } from '../models/types';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle2,
  ArrowUp,
  ArrowDown
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { marketData, isConnected, isLoading, error, fetchMarketData } = useApi();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pnlData, setPnlData] = useState<ChartDataPoint[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchMarketData();
    // Refresh every 60 seconds if connected
    let interval: NodeJS.Timeout | null = null;
    if (isConnected) {
      interval = setInterval(() => {
        fetchMarketData();
      }, 60000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [fetchMarketData, isConnected]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be API calls
        const dashboardStats = getDashboardStats();
        const chartData = getPnlChartData();

        setStats(dashboardStats);
        setPnlData(chartData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare data for the win/loss pie chart
  const winLossData = stats ? [
    { name: 'Win', value: stats.winRate * 100 },
    { name: 'Loss', value: 100 - (stats.winRate * 100) }
  ] : [];

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format number with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  return (
    <Layout pageName="Dashboard" showRefresh={true}>
      <div className="p-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Trading Dashboard</h1>
              <p className="text-teal-50">Welcome to Algoria Trading Platform</p>
            </div>
            
            {/* Connection Status */}
            <div className="flex items-center">
              <div className={`mr-4 px-3 py-1 rounded-full flex items-center ${isConnected ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
                <span className={`text-sm ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
                  {isLoading ? 'Connecting...' : (isConnected ? 'Connected' : 'Not Connected')}
                </span>
              </div>
              
              <button 
                onClick={() => setShowConnectionDialog(true)}
                className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
              >
                Connect to Fyers
              </button>
            </div>
          </div>
        </div>

        {/* Error message if any */}
        {error && (
          <div className="bg-red-900 text-white p-3 rounded-md mb-4 flex justify-between items-center">
            <div className="flex items-center">
              <span className="text-red-300 mr-2">⚠</span>
              <span>{error}</span>
            </div>
            <button 
              onClick={() => fetchMarketData()}
              className="text-red-300 hover:text-white"
            >
              Retry
            </button>
          </div>
        )}
        
        {/* Market Data Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* NIFTY Card */}
          <div className="bg-purple-900 text-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">NIFTY</h2>
            {marketData && marketData.nifty ? (
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {marketData.nifty.price.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                    </div>
                <div className={`text-lg ${marketData.nifty.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketData.nifty.change >= 0 ? '+' : ''}{marketData.nifty.percentChange.toFixed(2)}%
                  </div>
                    </div>
            ) : (
              <div className="text-center">
                {isLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  'Connect to view'
                )}
                  </div>
              )}
            </div>

          {/* BANKNIFTY Card */}
          <div className="bg-blue-900 text-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">BANKNIFTY</h2>
            {marketData && marketData.bankNifty ? (
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">
                  {marketData.bankNifty.price.toLocaleString('en-IN', {
                    maximumFractionDigits: 2,
                    minimumFractionDigits: 2
                  })}
                </div>
                <div className={`text-lg ${marketData.bankNifty.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {marketData.bankNifty.change >= 0 ? '+' : ''}{marketData.bankNifty.percentChange.toFixed(2)}%
                </div>
              </div>
            ) : (
              <div className="text-center">
                {isLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  'Connect to view'
                )}
              </div>
            )}
            </div>

          {/* Market Leaders */}
          <div className="bg-gray-900 text-white p-5 rounded-lg shadow">
            <h2 className="text-lg font-medium mb-4">Market Movers</h2>
            {marketData && (marketData.topGainers || marketData.topLosers) ? (
              <div className="text-sm">
                <div className="mb-3">
                  <h3 className="text-green-400 font-medium mb-1">Top Gainers</h3>
                  <div className="space-y-1">
                    {marketData.topGainers?.slice(0, 3).map((stock, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{stock.symbol}</span>
                        <span className="text-green-400">+{stock.change.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                  <h3 className="text-red-400 font-medium mb-1">Top Losers</h3>
                  <div className="space-y-1">
                    {marketData.topLosers?.slice(0, 3).map((stock, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{stock.symbol}</span>
                        <span className="text-red-400">{stock.change.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
              </div>
            ) : (
              <div className="text-center">
                {isLoading ? (
                  <div className="animate-pulse">Loading...</div>
                ) : (
                  'Connect to view'
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Strategies</h3>
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Out of 4 total strategies</p>
                </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Signals</h3>
            </div>
            <p className="text-2xl font-bold">5</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Waiting for execution</p>
                    </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Trades</h3>
                    </div>
            <p className="text-2xl font-bold">42</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">All time</p>
                    </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total P&L</h3>
                  </div>
            <p className="text-2xl font-bold text-green-600">₹142,500</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Win rate: 76%</p>
                </div>
              </div>
        
        {/* Footer */}
        <div className="text-center text-gray-500 mt-6 dark:text-gray-400">
          © ALGORIA v8.7.0. All rights reserved.
          {marketData && marketData.lastUpdated && (
            <div className="text-xs mt-1">Last updated: {marketData.lastUpdated}</div>
          )}
        </div>
        
        {/* Connection Dialog */}
        {showConnectionDialog && (
          <BrokerConnectionDialog onClose={() => setShowConnectionDialog(false)} />
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
