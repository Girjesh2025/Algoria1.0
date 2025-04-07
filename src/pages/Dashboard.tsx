import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageFooter from '../components/PageFooter';
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

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [marketData, setMarketData] = useState<MarketOverview | null>(null);
  const [pnlData, setPnlData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // In a real app, these would be API calls
        const dashboardStats = getDashboardStats();
        const marketOverview = getMarketOverview();
        const chartData = getPnlChartData();

        setStats(dashboardStats);
        setMarketData(marketOverview);
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
            <div className="hidden md:block text-right">
              <p className="text-sm text-teal-100">Last Updated</p>
              <p className="text-lg font-semibold">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {stats && (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Strategies</h3>
                      <span className="bg-teal-100 p-2 rounded-lg">
                        <Activity className="text-teal-600" size={20} />
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{stats.activeStrategies}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Out of 4 total strategies</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Pending Signals</h3>
                      <span className="bg-amber-100 p-2 rounded-lg">
                        <AlertCircle className="text-amber-600" size={20} />
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{stats.pendingSignals}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Waiting for execution</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Completed Trades</h3>
                      <span className="bg-indigo-100 p-2 rounded-lg">
                        <CheckCircle2 className="text-indigo-600" size={20} />
                      </span>
                    </div>
                    <p className="text-2xl font-bold">{formatNumber(stats.completedTrades)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">All time</p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Total P&L</h3>
                      <span className="bg-green-100 p-2 rounded-lg">
                        <BarChart3 className="text-green-600" size={20} />
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalPnl)}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Win rate: {(stats.winRate * 100).toFixed(0)}%</p>
                  </div>
                </>
              )}
            </div>

            {/* Charts and Market Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              {/* P&L Performance Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 lg:col-span-2">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">P&L Performance (2025)</h3>
                <LineChart
                  data={pnlData}
                  stroke="#10b981"
                  legendName="P&L (₹)"
                  showLegend
                  height={250}
                />
              </div>

              {/* Win Rate Chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-300">Win/Loss Ratio</h3>
                <PieChart
                  data={winLossData}
                  colors={['#10b981', '#ef4444']}
                  innerRadius={50}
                  outerRadius={80}
                  height={250}
                />
              </div>
            </div>

            {/* Market Overview */}
            {marketData && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 mb-6">
                <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">Market Overview</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  {marketData.indices.map((index) => (
                    <div
                      key={index.symbol}
                      className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="font-semibold dark:text-white">{index.symbol}</h4>
                        <div className={`flex items-center text-sm ${index.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                          {index.change >= 0 ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                          <span>{index.change >= 0 ? '+' : ''}{index.percentChange.toFixed(2)}%</span>
                        </div>
                      </div>
                      <p className="text-xl font-bold dark:text-white">{index.price.toLocaleString('en-IN', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                      })}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                      <TrendingUp size={18} className="mr-2 text-green-600 dark:text-green-400" /> Top Gainers
                    </h4>
                    <div className="space-y-2">
                      {marketData.topGainers.map((stock, index) => (
                        <div key={index} className="flex justify-between bg-green-50 dark:bg-green-900 p-3 rounded-md">
                          <span className="font-medium dark:text-white">{stock.symbol}</span>
                          <span className="text-green-600 dark:text-green-400 font-semibold">+{stock.change.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300 flex items-center">
                      <TrendingDown size={18} className="mr-2 text-red-600 dark:text-red-400" /> Top Losers
                    </h4>
                    <div className="space-y-2">
                      {marketData.topLosers.map((stock, index) => (
                        <div key={index} className="flex justify-between bg-red-50 dark:bg-red-900 p-3 rounded-md">
                          <span className="font-medium dark:text-white">{stock.symbol}</span>
                          <span className="text-red-600 dark:text-red-400 font-semibold">{stock.change.toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Market Breadth</h4>
                  <div className="flex space-x-4">
                    <div className="flex-1 p-4 bg-green-50 dark:bg-green-900 rounded-lg text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Advancing</p>
                      <p className="text-xl font-bold text-green-600 dark:text-green-400">{marketData.marketBreadth.advancing}</p>
                    </div>
                    <div className="flex-1 p-4 bg-red-50 dark:bg-red-900 rounded-lg text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Declining</p>
                      <p className="text-xl font-bold text-red-600 dark:text-red-400">{marketData.marketBreadth.declining}</p>
                    </div>
                    <div className="flex-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">Unchanged</p>
                      <p className="text-xl font-bold text-gray-600 dark:text-gray-400">{marketData.marketBreadth.unchanged}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <PageFooter />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
