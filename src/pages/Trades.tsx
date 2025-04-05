import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageFooter from '../components/PageFooter';
import BarChart from '../components/charts/BarChart';
import PieChart from '../components/charts/PieChart';
import { getPortfolioItems, getPortfolioSummary } from '../services/DataService';
import { PortfolioItem, PortfolioSummary } from '../models/types';
import {
  TrendingUp,
  TrendingDown,
  CandlestickChart,
  Briefcase,
  DollarSign,
  BarChart3,
  Search,
  SlidersHorizontal,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '../utils/cn';

const Trades = () => {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [summary, setSummary] = useState<PortfolioSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const portfolioData = getPortfolioItems();
        const summaryData = getPortfolioSummary();

        setPortfolio(portfolioData);
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching portfolio data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter and sort portfolio items
  const filteredPortfolio = portfolio
    .filter(item => item.symbol.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortField === 'symbol') {
        return sortDirection === 'asc'
          ? a.symbol.localeCompare(b.symbol)
          : b.symbol.localeCompare(a.symbol);
      } else if (sortField === 'value') {
        return sortDirection === 'asc'
          ? a.value - b.value
          : b.value - a.value;
      } else if (sortField === 'pnl') {
        return sortDirection === 'asc'
          ? a.pnl - b.pnl
          : b.pnl - a.pnl;
      } else if (sortField === 'pnlPercentage') {
        return sortDirection === 'asc'
          ? a.pnlPercentage - b.pnlPercentage
          : b.pnlPercentage - a.pnlPercentage;
      }
      return 0;
    });

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (percent: number) => {
    return `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;
  };

  // Color based on positive/negative values
  const getPnlColor = (value: number) => {
    return value >= 0 ? 'text-green-600' : 'text-red-600';
  };

  // Prepare data for allocation chart
  const getAllocationChartData = () => {
    const groupedData: Record<string, number> = {};

    portfolio.forEach(item => {
      // Group by instrument type (stocks, options, etc.)
      const type = item.symbol.includes(' ') ? 'Options' : 'Stocks';
      if (groupedData[type]) {
        groupedData[type] += item.value;
      } else {
        groupedData[type] = item.value;
      }
    });

    return Object.entries(groupedData).map(([name, value]) => ({ name, value }));
  };

  // Prepare data for P&L distribution chart
  const getPnlDistributionData = () => {
    // Count number of positions in profit vs loss
    const profitable = portfolio.filter(item => item.pnl > 0).length;
    const unprofitable = portfolio.filter(item => item.pnl < 0).length;
    const breakeven = portfolio.filter(item => item.pnl === 0).length;

    return [
      { name: 'Profitable', value: profitable },
      { name: 'Unprofitable', value: unprofitable },
      { name: 'Break-even', value: breakeven }
    ];
  };

  return (
    <Layout pageName="Trades" showRefresh={true}>
      <div className="p-6">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Portfolio & Trades</h1>
              <p className="text-emerald-50">View and manage your trading portfolio</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-emerald-200">Last Updated</p>
              <p className="text-lg font-semibold">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <>
            {/* Portfolio Summary */}
            {summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Portfolio Value</h3>
                    <span className="bg-emerald-100 p-2 rounded-lg">
                      <Briefcase className="text-emerald-600" size={20} />
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalValue)}</p>
                  <div className="flex items-center text-sm mt-2">
                    <div className={cn(
                      "flex items-center",
                      summary.dayChange >= 0 ? "text-green-600" : "text-red-600"
                    )}>
                      {summary.dayChange >= 0 ? (
                        <ArrowUp size={14} className="mr-1" />
                      ) : (
                        <ArrowDown size={14} className="mr-1" />
                      )}
                      <span>
                        {formatCurrency(Math.abs(summary.dayChange))} ({formatPercentage(summary.dayChangePercentage)})
                      </span>
                    </div>
                    <span className="text-gray-500 ml-1">today</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total Investment</h3>
                    <span className="bg-blue-100 p-2 rounded-lg">
                      <DollarSign className="text-blue-600" size={20} />
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{formatCurrency(summary.totalInvestment)}</p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Total P&L</h3>
                    <span className="bg-purple-100 p-2 rounded-lg">
                      <BarChart3 className="text-purple-600" size={20} />
                    </span>
                  </div>
                  <p className={`text-2xl font-bold ${getPnlColor(summary.totalPnl)}`}>
                    {formatCurrency(summary.totalPnl)}
                  </p>
                  <p className={`text-sm ${getPnlColor(summary.pnlPercentage)} mt-2`}>
                    {formatPercentage(summary.pnlPercentage)}
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-gray-500 text-sm font-medium">Positions</h3>
                    <span className="bg-amber-100 p-2 rounded-lg">
                      <CandlestickChart className="text-amber-600" size={20} />
                    </span>
                  </div>
                  <p className="text-2xl font-bold">{portfolio.length}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {portfolio.filter(p => p.pnl > 0).length} profitable
                  </p>
                </div>
              </div>
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">Portfolio Allocation</h3>
                <PieChart
                  data={getAllocationChartData()}
                  colors={['#10b981', '#3b82f6']}
                  height={250}
                />
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                <h3 className="text-lg font-semibold mb-4 text-gray-700">P&L Distribution</h3>
                <PieChart
                  data={getPnlDistributionData()}
                  colors={['#10b981', '#ef4444', '#f59e0b']}
                  height={250}
                />
              </div>
            </div>

            {/* Portfolio Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-lg font-semibold text-gray-800">Portfolio Holdings</h3>
                <div className="flex space-x-2 w-full sm:w-auto">
                  <div className="relative flex-grow sm:flex-grow-0 sm:w-64">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search size={16} className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search symbols..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                    />
                  </div>
                  <button className="p-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-gray-600">
                    <SlidersHorizontal size={16} />
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('symbol')}
                      >
                        <div className="flex items-center">
                          Symbol
                          {sortField === 'symbol' && (
                            sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Avg. Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Price
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('value')}
                      >
                        <div className="flex items-center">
                          Value
                          {sortField === 'value' && (
                            sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('pnl')}
                      >
                        <div className="flex items-center">
                          P&L
                          {sortField === 'pnl' && (
                            sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                        onClick={() => handleSort('pnlPercentage')}
                      >
                        <div className="flex items-center">
                          P&L %
                          {sortField === 'pnlPercentage' && (
                            sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                          )}
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPortfolio.length > 0 ? (
                      filteredPortfolio.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-emerald-600">
                            {item.symbol}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.avgBuyPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{item.currentPrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                            ₹{item.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={getPnlColor(item.pnl)}>
                              {item.pnl >= 0 ? '+' : ''}₹{item.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={getPnlColor(item.pnlPercentage)}>
                              {formatPercentage(item.pnlPercentage)}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                          No portfolio items found matching your search criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <PageFooter />
          </>
        )}
      </div>
    </Layout>
  );
};

export default Trades;
