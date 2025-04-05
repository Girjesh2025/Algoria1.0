import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageFooter from '../components/PageFooter';
import LineChart from '../components/charts/LineChart';
import {
  getStrategies,
  getStrategyPerformanceData,
  getLiveSignals
} from '../services/DataService';
import {
  Strategy as StrategyType,
  Signal,
  ChartDataPoint
} from '../models/types';
import {
  Activity,
  Play,
  Pause,
  AlertCircle,
  BarChart3,
  TrendingUp,
  Clock,
  Check,
  ArrowUp,
  ArrowDown,
  Zap
} from 'lucide-react';
import { cn } from '../utils/cn';

const LiveStrategy = () => {
  const [strategies, setStrategies] = useState<StrategyType[]>([]);
  const [activeStrategies, setActiveStrategies] = useState<StrategyType[]>([]);
  const [activeSignals, setActiveSignals] = useState<Signal[]>([]);
  const [chartData, setChartData] = useState<Record<number, ChartDataPoint[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const strategiesData = getStrategies();
        const signalsData = getLiveSignals();

        // Filter active strategies
        const active = strategiesData.filter(s => s.isActive);
        setStrategies(strategiesData);
        setActiveStrategies(active);

        // Get chart data for each active strategy
        const chartDataObj: Record<number, ChartDataPoint[]> = {};
        active.forEach(strategy => {
          chartDataObj[strategy.id] = getStrategyPerformanceData(strategy.id);
        });
        setChartData(chartDataObj);

        // Filter active signals
        setActiveSignals(signalsData.filter(s => s.status === 'ACTIVE'));
      } catch (error) {
        console.error('Error fetching live strategy data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleStrategy = (strategyId: number) => {
    // In a real app, this would make an API call to toggle the strategy status
    console.log(`Toggle strategy ${strategyId}`);
  };

  const formatTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <Layout pageName="Live Strategy" showRefresh={true}>
      <div className="p-6">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Live Trading Strategies</h1>
              <p className="text-teal-50">Monitor and control your active trading strategies</p>
            </div>
            <div className="hidden md:flex items-center">
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center mr-4">
                <p className="text-xs text-teal-100 mb-1">Active Strategies</p>
                <p className="text-xl font-bold">{activeStrategies.length} / {strategies.length}</p>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                <p className="text-xs text-teal-100 mb-1">Active Signals</p>
                <p className="text-xl font-bold">{activeSignals.length}</p>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
          </div>
        ) : (
          <>
            {/* Active Strategies Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                <Activity size={20} className="mr-2 text-teal-600" />
                Active Strategies
              </h2>

              {activeStrategies.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activeStrategies.map(strategy => (
                    <div key={strategy.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="p-2 bg-green-100 rounded-lg mr-4">
                            <Activity size={20} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{strategy.name}</h3>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                              <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded mr-2">{strategy.tag}</span>
                              <Clock size={12} className="mr-1" />
                              <span>Last run: {strategy.lastRun ? formatTime(strategy.lastRun) : 'Never'}</span>
                            </div>
                          </div>
                        </div>
                        <button
                          className="p-2 bg-red-100 text-red-600 rounded-full"
                          onClick={() => toggleStrategy(strategy.id)}
                        >
                          <Pause size={18} />
                        </button>
                      </div>

                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4 mb-4">
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Accuracy</div>
                            <div className="text-lg font-bold text-teal-600">{strategy.accuracy}%</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Trades</div>
                            <div className="text-lg font-bold">{strategy.tradesCount}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm text-gray-500 mb-1">Success Rate</div>
                            <div className="text-lg font-bold">{strategy.details?.successRate ? `${(strategy.details.successRate * 100).toFixed(0)}%` : 'N/A'}</div>
                          </div>
                        </div>

                        {chartData[strategy.id] && (
                          <div className="mb-3">
                            <LineChart
                              data={chartData[strategy.id]}
                              height={180}
                              stroke="#0ea5e9"
                              legendName="Return %"
                              showGrid={false}
                            />
                          </div>
                        )}

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                          <button className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg transition-colors flex items-center justify-center">
                            <BarChart3 size={16} className="mr-2" />
                            Strategy Details
                          </button>
                          <button className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors flex items-center justify-center">
                            <TrendingUp size={16} className="mr-2" />
                            View Signals
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <AlertCircle size={48} className="mx-auto text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No active strategies</h3>
                  <p className="text-gray-500 mb-6">
                    You currently have no active trading strategies.
                    Activate a strategy to start generating trading signals.
                  </p>
                  <button className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium flex items-center justify-center mx-auto hover:bg-teal-700 transition-colors">
                    <Zap size={18} className="mr-2" />
                    Activate a Strategy
                  </button>
                </div>
              )}
            </div>

            {/* Inactive Strategies Section */}
            {strategies.filter(s => !s.isActive).length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Inactive Strategies</h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tag</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accuracy</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Level</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {strategies.filter(s => !s.isActive).map(strategy => (
                        <tr key={strategy.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="p-1.5 bg-gray-100 rounded-lg mr-3">
                                <Activity size={16} className="text-gray-400" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{strategy.name}</div>
                                <div className="text-xs text-gray-500">Created: {strategy.createdAt}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
                              {strategy.tag}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {strategy.accuracy}%
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={cn(
                              "px-2 py-1 text-xs font-medium rounded-full",
                              strategy.details?.riskLevel === 'Low' ? "bg-green-100 text-green-800" :
                              strategy.details?.riskLevel === 'Medium' ? "bg-amber-100 text-amber-800" :
                              "bg-red-100 text-red-800"
                            )}>
                              {strategy.details?.riskLevel || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                              onClick={() => toggleStrategy(strategy.id)}
                            >
                              <Play size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Active Signals */}
            {activeSignals.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                  <TrendingUp size={20} className="mr-2 text-indigo-600" />
                  Current Active Signals
                </h2>
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Signal</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Strategy</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entry Price</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stop Loss</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Take Profit</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {activeSignals.map(signal => (
                        <tr key={signal.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={cn(
                                "p-1.5 rounded-lg mr-3",
                                signal.action === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                              )}>
                                {signal.action === 'BUY' ? (
                                  <ArrowUp size={16} className="text-green-600" />
                                ) : (
                                  <ArrowDown size={16} className="text-red-600" />
                                )}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{signal.symbol}</div>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                  <span className="flex items-center bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">
                                    <Check size={10} className="mr-0.5" />
                                    Active
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {signal.strategyName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            ₹{signal.entryPrice.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                            ₹{signal.stopLoss.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            ₹{signal.takeProfit.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatTime(signal.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default LiveStrategy;
