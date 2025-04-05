import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import {
  BarChart3,
  PieChart,
  Calendar,
  FileBarChart,
  Filter,
  ArrowUpDown,
  HelpCircle,
  Download
} from 'lucide-react';
import PageFooter from '../components/PageFooter';
import { getTradesForSignalReport } from '../services/DataService';
import { Trade } from '../models/types';

interface Strategy {
  name: string;
  tag: string;
  trades: Trade[];
  totalPnL: string;
}

const SignalReport = () => {
  const [selectedStrategy, setSelectedStrategy] = useState("Strategy1");
  const [selectedScript, setSelectedScript] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState("all");
  const [scriptOptions, setScriptOptions] = useState<{value: string; label: string}[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [totalPnL, setTotalPnL] = useState("0");
  const [totalTrades, setTotalTrades] = useState(0);
  const [profitableTrades, setProfitableTrades] = useState(0);
  const [successRate, setSuccessRate] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  // Get all trades
  const allTrades = getTradesForSignalReport();

  // Mock strategies based on the trades
  const strategies: Strategy[] = [
    {
      name: "Strategy1",
      tag: "ST1",
      trades: allTrades.slice(0, 4),
      totalPnL: allTrades.slice(0, 4).reduce((sum, trade) => sum + Number(trade.pnl), 0).toString()
    },
    {
      name: "Strategy2",
      tag: "ST2",
      trades: allTrades.slice(4, 6),
      totalPnL: allTrades.slice(4, 6).reduce((sum, trade) => sum + Number(trade.pnl), 0).toString()
    },
    {
      name: "Strategy3",
      tag: "ST3",
      trades: allTrades.slice(6),
      totalPnL: allTrades.slice(6).reduce((sum, trade) => sum + Number(trade.pnl), 0).toString()
    }
  ];

  // Find selected strategy
  const currentStrategy = strategies.find(strat => strat.name === selectedStrategy) || strategies[0];

  // Update script options when selected strategy changes
  useEffect(() => {
    setIsLoading(true);

    // Find the current strategy
    const strategy = strategies.find(s => s.name === selectedStrategy);
    if (!strategy) return;

    // Extract unique script values from the strategy's trades
    const uniqueScripts = Array.from(
      new Set(strategy.trades.map(trade => trade.script))
    );

    // Create options array with "All Scripts" as the first option
    const options = [
      { value: "", label: "All Scripts" },
      ...uniqueScripts.map(script => ({
        value: script,
        label: script
      }))
    ];

    setScriptOptions(options);

    // Reset selected script when strategy changes
    setSelectedScript("");

    setIsLoading(false);
  }, [selectedStrategy]);

  // Filter trades when strategy or script selection changes
  useEffect(() => {
    const strategy = strategies.find(s => s.name === selectedStrategy);
    if (!strategy) {
      setFilteredTrades([]);
      setTotalPnL("0");
      return;
    }

    let filtered = [...strategy.trades];

    // Filter by script if one is selected
    if (selectedScript) {
      filtered = filtered.filter(trade => trade.script === selectedScript);
    }

    // Filter by date range
    if (selectedDateRange === "today") {
      const today = new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: '2-digit'
      });
      filtered = filtered.filter(trade => trade.date.startsWith(today));
    } else if (selectedDateRange === "week") {
      // Mock filtering for this week (would be implemented with proper date logic)
      filtered = filtered;
    }

    // Calculate total PnL for filtered trades
    const total = filtered.reduce((sum, trade) => sum + Number(trade.pnl), 0);

    // Calculate success metrics
    const totalTradesCount = filtered.length;
    const profitableTradesCount = filtered.filter(trade => Number(trade.pnl) > 0).length;
    const successRateValue = totalTradesCount > 0
      ? ((profitableTradesCount / totalTradesCount) * 100).toFixed(1)
      : "0";

    setFilteredTrades(filtered);
    setTotalPnL(total.toString());
    setTotalTrades(totalTradesCount);
    setProfitableTrades(profitableTradesCount);
    setSuccessRate(successRateValue);
  }, [selectedStrategy, selectedScript, selectedDateRange]);

  return (
    <Layout pageName="SIGNAL REPORT">
      <div className="p-6">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Signal Performance Report</h1>
              <p className="text-amber-50">Analyze historical signal performance and trading outcomes</p>
            </div>
            <button className="p-3 bg-white text-orange-700 rounded-lg hover:bg-orange-50 shadow-md transition-all duration-300 flex items-center">
              <Download size={18} className="mr-2" />
              Export Report
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
          </div>
        ) : (
          <>
            {/* Filter Section */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Filter size={18} className="mr-2 text-orange-600" />
                Report Filters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Strategy</label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={selectedStrategy}
                      onChange={(e) => setSelectedStrategy(e.target.value)}
                    >
                      {strategies.map(strat => (
                        <option key={strat.name} value={strat.name}>{strat.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Script</label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={selectedScript}
                      onChange={(e) => setSelectedScript(e.target.value)}
                    >
                      {scriptOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                  <div className="relative">
                    <select
                      className="w-full p-2.5 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                      value={selectedDateRange}
                      onChange={(e) => setSelectedDateRange(e.target.value)}
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Total Signals</h3>
                  <span className="p-2 bg-orange-100 rounded-full">
                    <BarChart3 size={16} className="text-orange-600" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{totalTrades}</p>
                <p className="text-xs mt-1 text-gray-500">Strategy: {currentStrategy.tag}</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Profitable Signals</h3>
                  <span className="p-2 bg-green-100 rounded-full">
                    <ArrowUpDown size={16} className="text-green-600" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{profitableTrades}</p>
                <p className="text-xs mt-1 text-gray-500">of {totalTrades} total signals</p>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Success Rate</h3>
                  <span className="p-2 bg-blue-100 rounded-full">
                    <PieChart size={16} className="text-blue-600" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-800">{successRate}%</p>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{ width: `${Math.min(100, Number(successRate))}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-500">Total P&L</h3>
                  <span className="p-2 bg-purple-100 rounded-full">
                    <FileBarChart size={16} className="text-purple-600" />
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-600">₹{totalPnL}</p>
                <p className="text-xs mt-1 text-gray-500">
                  {Number(totalPnL) > 0 ? 'Profit Generated' : 'Loss Incurred'}
                </p>
              </div>
            </div>

            {/* Report Warning */}
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-4 mb-6 flex items-start">
              <HelpCircle size={18} className="text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-orange-800">Report Disclaimer</p>
                <p className="text-sm text-orange-700 mt-1">
                  This result is valid for today only. Past performance is not indicative of future results.
                  We do not directly or indirectly make any guarantees about future signal accuracy.
                </p>
              </div>
            </div>

            {/* Signals Table */}
            <div className="bg-white p-6 rounded-xl shadow-md mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 flex items-center">
                  <Calendar size={18} className="mr-2 text-orange-600" />
                  {currentStrategy.name} Signals
                </h2>
                <div className="text-sm text-gray-500">
                  Tag: <span className="font-medium text-orange-600">{currentStrategy.tag}</span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full rounded-lg overflow-hidden">
                  <thead>
                    <tr>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Date</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Script</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Strike</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Expiry</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Signals</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Entry</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Exit</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">Quantity</th>
                      <th className="text-left px-6 py-3 bg-orange-800 text-white text-sm font-semibold">P&L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTrades.length > 0 ? (
                      filteredTrades.map((trade) => (
                        <tr key={trade.id} className="hover:bg-orange-50 transition-colors">
                          <td className="px-6 py-4 text-sm">
                            <div className="flex flex-col">
                              <span className="text-gray-800">{trade.date.split(' ')[0]}</span>
                              <span className="text-xs text-gray-500">{trade.date.split(' ')[1]}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-blue-600 cursor-pointer hover:underline font-medium">{trade.script}</span>
                          </td>
                          <td className="px-6 py-4 font-medium">{trade.strike}</td>
                          <td className="px-6 py-4 text-gray-500">{trade.expiry}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded-full">
                              {trade.signalType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-green-600 font-medium">{trade.entryPrice}</td>
                          <td className="px-6 py-4 text-red-600 font-medium">{trade.exitPrice}</td>
                          <td className="px-6 py-4 font-medium">{trade.quantity}</td>
                          <td className="px-6 py-4">
                            <span className={`font-bold ${Number(trade.pnl) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              ₹{trade.pnl}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-500 bg-gray-50">
                          No signals found matching your filters
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {filteredTrades.length > 0 && (
                <div className="mt-6 flex justify-end items-center gap-2 border-t pt-4">
                  <div className="text-right pr-6">
                    <p className="text-lg font-semibold">Total Profit/Loss</p>
                    <p className="text-xs text-orange-500">RESULTS VALID FOR TODAY ONLY</p>
                  </div>
                  <div className="text-right w-32">
                    <p className={`text-lg font-semibold ${Number(totalPnL) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ₹ {totalPnL}/-
                    </p>
                  </div>
                </div>
              )}
            </div>

            <PageFooter />
          </>
        )}
      </div>
    </Layout>
  );
};

export default SignalReport;
