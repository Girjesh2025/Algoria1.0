import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import PageFooter from '../components/PageFooter';
import LineChart from '../components/charts/LineChart';
import { getStrategies, getStrategyPerformanceData, toggleStrategyStatus } from '../services/DataService';
import { Strategy as StrategyType, ChartDataPoint } from '../models/types';
import {
  Activity,
  Clock,
  AlarmCheck,
  BarChart2,
  Briefcase,
  Zap,
  CheckCircle,
  Play,
  Pause,
  ChevronRight,
  AlarmClock,
  Calendar,
  Search,
  Filter,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';
import { useTheme } from '../context/ThemeContext';

const Strategy = () => {
  const [strategies, setStrategies] = useState<StrategyType[]>([]);
  const [filteredStrategies, setFilteredStrategies] = useState<StrategyType[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<number | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all', // 'all', 'active', 'inactive'
    accuracy: 'all', // 'all', 'high', 'medium', 'low'
    riskLevel: 'all', // 'all', 'Low', 'Medium', 'High'
  });

  const navigate = useNavigate();
  const { showToast } = useNotifications();
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const strategiesData = getStrategies();
        setStrategies(strategiesData);
        setFilteredStrategies(strategiesData);

        // Set the first strategy as selected by default
        if (strategiesData.length > 0) {
          setSelectedStrategy(strategiesData[0].id);
          setChartData(getStrategyPerformanceData(strategiesData[0].id));
        }
      } catch (error) {
        console.error('Error fetching strategies:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Apply filters and search whenever they change
  useEffect(() => {
    let result = [...strategies];

    // Apply text search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(strategy =>
        strategy.name.toLowerCase().includes(query) ||
        strategy.tag.toLowerCase().includes(query) ||
        strategy.description.some(desc => desc.toLowerCase().includes(query))
      );
    }

    // Apply status filter
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      result = result.filter(strategy => strategy.isActive === isActive);
    }

    // Apply accuracy filter
    if (filters.accuracy !== 'all') {
      switch (filters.accuracy) {
        case 'high':
          result = result.filter(strategy => strategy.accuracy >= 80);
          break;
        case 'medium':
          result = result.filter(strategy => strategy.accuracy >= 60 && strategy.accuracy < 80);
          break;
        case 'low':
          result = result.filter(strategy => strategy.accuracy < 60);
          break;
      }
    }

    // Apply risk level filter
    if (filters.riskLevel !== 'all') {
      result = result.filter(strategy =>
        strategy.details?.riskLevel === filters.riskLevel
      );
    }

    setFilteredStrategies(result);

    // If the currently selected strategy is filtered out, select the first visible one
    if (result.length > 0 && selectedStrategy !== null && !result.some(s => s.id === selectedStrategy)) {
      setSelectedStrategy(result[0].id);
      setChartData(getStrategyPerformanceData(result[0].id));
    }
  }, [searchQuery, filters, strategies]);

  // Update chart data when selected strategy changes
  useEffect(() => {
    if (selectedStrategy !== null) {
      setChartData(getStrategyPerformanceData(selectedStrategy));
    }
  }, [selectedStrategy]);

  const handleStrategySelect = (strategyId: number) => {
    setSelectedStrategy(strategyId);
  };

  const handleViewDetails = (strategyId: number) => {
    // In a real app, this would navigate to a detailed view of the strategy
    console.log(`View details for strategy ${strategyId}`);
    // navigate(`/strategy/${strategyId}`);
  };

  const handleToggleActive = async (strategyId: number) => {
    try {
      setToggleLoading(strategyId);

      // Get the current strategy status before toggling
      const strategy = strategies.find(s => s.id === strategyId);
      const wasActive = strategy?.isActive;

      // Toggle the strategy status
      const updatedStrategy = toggleStrategyStatus(strategyId);

      // Update the strategy in the local state
      setStrategies(prevStrategies =>
        prevStrategies.map(strategy =>
          strategy.id === strategyId ? updatedStrategy : strategy
        )
      );

      // Show appropriate toast message
      if (wasActive) {
        showToast(`Strategy "${updatedStrategy.name}" has been deactivated`, 'warning');
      } else {
        showToast(`Strategy "${updatedStrategy.name}" has been activated`, 'success');
      }
    } catch (error) {
      console.error('Error toggling strategy status:', error);
      showToast('Failed to update strategy status', 'error');
    } finally {
      // Add a small delay to make the loading state visible for better UX
      setTimeout(() => {
        setToggleLoading(null);
      }, 500);
    }
  };

  const resetFilters = () => {
    setFilters({
      status: 'all',
      accuracy: 'all',
      riskLevel: 'all',
    });
    setSearchQuery('');
    showToast('Filters have been reset', 'info');
  };

  const getRiskLevelClass = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-amber-100 text-amber-800';
      case 'High': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProfitLevelClass = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-blue-100 text-blue-800';
      case 'Medium': return 'bg-indigo-100 text-indigo-800';
      case 'High': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string): string => {
    const now = new Date();
    const date = new Date(dateString.replace(' ', 'T'));
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else if (diffMins > 0) {
      return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    } else {
      return 'Just now';
    }
  };

  return (
    <Layout pageName="Trading Strategies">
      <div className="p-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Trading Strategies</h1>
              <p className="text-teal-50">Explore and configure your trading strategies</p>
            </div>
            {/* Add strategy button */}
            <button className="px-4 py-2 bg-white text-teal-700 rounded-lg font-medium flex items-center shadow hover:bg-teal-50 transition-colors">
              <Zap size={18} className="mr-2" />
              New Strategy
            </button>
          </div>
        </div>

        {/* Search and filter bar */}
        <div className={`bg-white rounded-xl shadow-sm mb-6 p-4 ${isDark ? 'dark:bg-gray-800 dark:border dark:border-gray-700' : ''}`}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className={isDark ? 'text-gray-400' : 'text-gray-500'} />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search strategies..."
                className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm ${
                  isDark ? 'dark:bg-gray-700 dark:border-gray-600 dark:text-white' : ''
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X size={16} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-white" />
                </button>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => setShowFilterPanel(!showFilterPanel)}
                className={`px-3 py-2 ${
                  (filters.status !== 'all' || filters.accuracy !== 'all' || filters.riskLevel !== 'all')
                    ? 'bg-teal-100 text-teal-700 dark:bg-teal-800 dark:text-teal-200'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
                } rounded-md flex items-center transition-colors hover:bg-teal-50 dark:hover:bg-gray-600`}
              >
                <Filter size={16} className="mr-2" />
                Filters
                {(filters.status !== 'all' || filters.accuracy !== 'all' || filters.riskLevel !== 'all') && (
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-teal-500 text-white rounded-full">
                    {[
                      filters.status !== 'all' ? 1 : 0,
                      filters.accuracy !== 'all' ? 1 : 0,
                      filters.riskLevel !== 'all' ? 1 : 0
                    ].reduce((a, b) => a + b, 0)}
                  </span>
                )}
              </button>

              {(filters.status !== 'all' || filters.accuracy !== 'all' || filters.riskLevel !== 'all' || searchQuery) && (
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md flex items-center hover:bg-red-200 transition-colors dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
                >
                  <X size={16} className="mr-1" />
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Filter panel */}
          {showFilterPanel && (
            <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Status filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Status
                  </label>
                  <div className="flex space-x-2">
                    {['all', 'active', 'inactive'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilters({ ...filters, status })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.status === status
                            ? 'bg-teal-500 text-white dark:bg-teal-600'
                            : `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 dark:hover:bg-gray-600`
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Accuracy filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Accuracy
                  </label>
                  <div className="flex space-x-2">
                    {['all', 'high', 'medium', 'low'].map((accuracy) => (
                      <button
                        key={accuracy}
                        onClick={() => setFilters({ ...filters, accuracy })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.accuracy === accuracy
                            ? 'bg-teal-500 text-white dark:bg-teal-600'
                            : `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 dark:hover:bg-gray-600`
                        }`}
                      >
                        {accuracy.charAt(0).toUpperCase() + accuracy.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Risk Level filter */}
                <div>
                  <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                    Risk Level
                  </label>
                  <div className="flex space-x-2">
                    {['all', 'Low', 'Medium', 'High'].map((risk) => (
                      <button
                        key={risk}
                        onClick={() => setFilters({ ...filters, riskLevel: risk })}
                        className={`px-3 py-1 rounded-md text-sm ${
                          filters.riskLevel === risk
                            ? 'bg-teal-500 text-white dark:bg-teal-600'
                            : `${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'} hover:bg-gray-200 dark:hover:bg-gray-600`
                        }`}
                      >
                        {risk === 'all' ? 'All' : risk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Strategy Cards */}
            {filteredStrategies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {filteredStrategies.map((strategy) => (
                  <div
                    key={strategy.id}
                    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${selectedStrategy === strategy.id ? 'ring-2 ring-teal-500' : 'hover:shadow-md'} ${isDark ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}
                    onClick={() => handleStrategySelect(strategy.id)}
                  >
                    <div className={`px-6 py-5 border-b border-gray-100 flex justify-between items-center ${isDark ? 'dark:border-gray-700' : ''}`}>
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg ${strategy.isActive ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-700'} mr-4`}>
                          <Activity size={20} className={strategy.isActive ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'} />
                        </div>
                        <div>
                          <h3 className={`font-semibold text-lg ${isDark ? 'dark:text-white' : ''}`}>{strategy.name}</h3>
                          <div className="flex items-center text-xs text-gray-500 mt-1 space-x-2">
                            <span className="bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200 px-2 py-0.5 rounded">{strategy.tag}</span>
                            {strategy.isActive ? (
                              <span className="flex items-center bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300 px-2 py-0.5 rounded">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                Active
                              </span>
                            ) : (
                              <span className="flex items-center bg-gray-50 text-gray-700 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1"></span>
                                Inactive
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className={`p-2 rounded-full mr-2 ${
                            strategy.isActive
                              ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800'
                              : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                          } transition-colors relative`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleActive(strategy.id);
                          }}
                          disabled={toggleLoading === strategy.id}
                          aria-label={strategy.isActive ? "Deactivate strategy" : "Activate strategy"}
                        >
                          {toggleLoading === strategy.id ? (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                            </div>
                          ) : (
                            strategy.isActive ? <Pause size={16} /> : <Play size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      {/* Last run timestamp */}
                      {strategy.lastRun && (
                        <div className={`flex items-center mb-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-500'}`}>
                          <AlarmClock size={14} className="mr-1" />
                          <span>Last run: <span className="font-medium">{getRelativeTime(strategy.lastRun)}</span></span>
                          <span className="mx-1">•</span>
                          <Calendar size={14} className="mr-1" />
                          <span>{strategy.lastRun}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Accuracy</div>
                          <div className="text-lg font-bold text-teal-600 dark:text-teal-400">{strategy.accuracy}%</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Trades</div>
                          <div className={`text-lg font-bold ${isDark ? 'text-white' : ''}`}>{strategy.tradesCount}</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Test Period</div>
                          <div className={`text-lg font-bold ${isDark ? 'text-white' : ''}`}>{strategy.testPeriod}</div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {strategy.description.map((desc, index) => (
                          <div key={index} className="flex items-start">
                            <CheckCircle size={16} className="text-teal-500 dark:text-teal-400 mr-2 mt-0.5 flex-shrink-0" />
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{desc}</p>
                          </div>
                        ))}
                      </div>

                      {strategy.details && (
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="flex items-center">
                            <AlarmCheck size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Avg. Holding: </span>
                            <span className={`text-sm font-medium ml-1 ${isDark ? 'text-white' : ''}`}>{strategy.details.avgHoldingPeriod}</span>
                          </div>
                          <div className="flex items-center">
                            <Briefcase size={16} className={`${isDark ? 'text-gray-400' : 'text-gray-500'} mr-2`} />
                            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Min. Capital: </span>
                            <span className={`text-sm font-medium ml-1 ${isDark ? 'text-white' : ''}`}>
                              ₹{strategy.details.requiredCapital.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskLevelClass(strategy.details.riskLevel)}`}>
                              {strategy.details.riskLevel} Risk
                            </span>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getProfitLevelClass(strategy.details.profitPotential)}`}>
                              {strategy.details.profitPotential} Profit
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        className={`w-full py-2 mt-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors flex items-center justify-center ${isDark ? 'dark:bg-teal-900 dark:text-teal-100 dark:hover:bg-teal-800' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(strategy.id);
                        }}
                      >
                        View Details
                        <ChevronRight size={16} className="ml-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8 text-center ${isDark ? 'dark:bg-gray-800 dark:border-gray-700' : ''}`}>
                <div className={`text-lg font-medium mb-2 ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                  No strategies found
                </div>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No strategies match your current filters or search criteria.
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-teal-100 text-teal-700 rounded-md inline-flex items-center hover:bg-teal-200 transition-colors dark:bg-teal-900 dark:text-teal-200 dark:hover:bg-teal-800"
                >
                  <SlidersHorizontal size={16} className="mr-2" />
                  Reset Filters
                </button>
              </div>
            )}

            {/* Selected Strategy Performance Chart */}
            {selectedStrategy !== null && (
              <div className={`bg-white rounded-xl shadow-md p-6 mb-6 ${isDark ? 'dark:bg-gray-800 dark:border dark:border-gray-700' : ''}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'dark:text-white' : ''}`}>
                  Strategy Performance - {strategies.find(s => s.id === selectedStrategy)?.name}
                </h3>
                <LineChart
                  data={chartData}
                  title="Weekly Returns (%)"
                  stroke="#0ea5e9"
                  legendName="Return %"
                  showLegend
                />
              </div>
            )}

            <PageFooter />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Strategy;
