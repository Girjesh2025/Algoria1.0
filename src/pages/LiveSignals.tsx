import { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import PageFooter from '../components/PageFooter';
import { getLiveSignals } from '../services/DataService';
import { Signal } from '../models/types';
import {
  ArrowUp,
  ArrowDown,
  Check,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info
} from 'lucide-react';
import { cn } from '../utils/cn';

const LiveSignals = () => {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [filteredSignals, setFilteredSignals] = useState<Signal[]>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const signalsData = getLiveSignals();
        setSignals(signalsData);
        setFilteredSignals(signalsData);
      } catch (error) {
        console.error('Error fetching live signals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter signals when status filter changes
  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredSignals(signals);
    } else {
      setFilteredSignals(signals.filter(signal => signal.status === filterStatus));
    }
  }, [filterStatus, signals]);

  const handleStatusChange = (status: string) => {
    setFilterStatus(status);
  };

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
            <Check size={12} className="mr-1" />
            Active
          </span>
        );
      case 'PENDING':
        return (
          <span className="flex items-center px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
            <Clock size={12} className="mr-1" />
            Pending
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
            <CheckCircle2 size={12} className="mr-1" />
            Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="flex items-center px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
            <XCircle size={12} className="mr-1" />
            Cancelled
          </span>
        );
      default:
        return status;
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDateTime = (dateTimeStr: string) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Layout pageName="Live Signals" showRefresh={true}>
      <div className="p-6">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">Live Trading Signals</h1>
              <p className="text-indigo-50">Monitor real-time trading signals and market indicators</p>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-sm text-indigo-200">Last Updated</p>
              <p className="text-lg font-semibold">{new Date().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {/* Filter Tabs */}
            <div className="bg-white rounded-xl shadow-md mb-6 overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex flex-wrap">
                  <button
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      filterStatus === 'all'
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => handleStatusChange('all')}
                  >
                    All Signals
                  </button>
                  <button
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      filterStatus === 'ACTIVE'
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => handleStatusChange('ACTIVE')}
                  >
                    Active
                  </button>
                  <button
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      filterStatus === 'PENDING'
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => handleStatusChange('PENDING')}
                  >
                    Pending
                  </button>
                  <button
                    className={cn(
                      "px-4 py-3 text-sm font-medium border-b-2 transition-colors",
                      filterStatus === 'COMPLETED'
                        ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    )}
                    onClick={() => handleStatusChange('COMPLETED')}
                  >
                    Completed
                  </button>
                </nav>
              </div>

              {/* Signals Disclaimer */}
              <div className="bg-indigo-50 p-4 flex items-start">
                <Info size={18} className="text-indigo-500 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-indigo-900">
                    Live signals are generated by our algorithmic strategies based on market conditions.
                    Always confirm signals with your own analysis before trading. Set proper stop-losses
                    to manage risk effectively.
                  </p>
                </div>
              </div>
            </div>

            {/* Signals Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">
              {filteredSignals.length > 0 ? (
                filteredSignals.map(signal => (
                  <div
                    key={signal.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
                  >
                    <div className={cn(
                      "px-4 py-3 flex justify-between items-center",
                      signal.action === 'BUY' ? 'bg-green-50' : 'bg-red-50'
                    )}>
                      <div className="flex items-center">
                        <div className={cn(
                          "p-2 rounded-full mr-3",
                          signal.action === 'BUY' ? 'bg-green-100' : 'bg-red-100'
                        )}>
                          {signal.action === 'BUY' ? (
                            <ArrowUp size={16} className="text-green-600" />
                          ) : (
                            <ArrowDown size={16} className="text-red-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{signal.symbol}</h3>
                          <p className="text-xs text-gray-500">Strategy: {signal.strategyName}</p>
                        </div>
                      </div>
                      <div>
                        {renderStatusBadge(signal.status)}
                      </div>
                    </div>

                    <div className="p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Entry Price</p>
                          <p className="text-sm font-bold text-gray-900">₹{formatPrice(signal.entryPrice)}</p>
                        </div>
                        {signal.exitPrice ? (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Exit Price</p>
                            <p className="text-sm font-bold text-gray-900">₹{formatPrice(signal.exitPrice)}</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-xs text-gray-500 mb-1">Take Profit</p>
                            <p className="text-sm font-bold text-green-600">₹{formatPrice(signal.takeProfit)}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Stop Loss</p>
                          <p className="text-sm font-bold text-red-600">₹{formatPrice(signal.stopLoss)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Quantity</p>
                          <p className="text-sm font-bold text-gray-900">{signal.quantity}</p>
                        </div>
                      </div>

                      {signal.pnl !== undefined && (
                        <div className={cn(
                          "p-2 rounded mb-4 text-center",
                          signal.pnl >= 0 ? 'bg-green-50' : 'bg-red-50'
                        )}>
                          <p className="text-xs text-gray-600">Profit/Loss</p>
                          <p className={cn(
                            "text-lg font-bold",
                            signal.pnl >= 0 ? 'text-green-600' : 'text-red-600'
                          )}>
                            ₹{signal.pnl.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                          </p>
                        </div>
                      )}

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">
                          {signal.status === 'COMPLETED' ? 'Exit Time' : 'Signal Time'}
                        </p>
                        <p className="text-sm text-gray-700">
                          {formatDateTime(signal.exitTimestamp || signal.timestamp)}
                        </p>
                      </div>

                      {signal.notes && (
                        <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">
                          <p className="text-xs font-medium text-gray-500 mb-1">Notes</p>
                          {signal.notes}
                        </div>
                      )}
                    </div>

                    {signal.status === 'PENDING' || signal.status === 'ACTIVE' ? (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex space-x-2">
                        <button className="flex-1 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded hover:bg-indigo-700 transition-colors">
                          Execute
                        </button>
                        <button className="flex-1 px-3 py-1.5 border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-100 transition-colors">
                          Modify
                        </button>
                        <button className="flex-1 px-3 py-1.5 border border-red-300 text-red-700 text-sm font-medium rounded hover:bg-red-50 transition-colors">
                          Cancel
                        </button>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <div className="col-span-full bg-white rounded-xl shadow-sm p-8 text-center">
                  <AlertTriangle size={48} className="mx-auto text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No signals found</h3>
                  <p className="text-gray-500">
                    There are no signals matching your current filter criteria.
                  </p>
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

export default LiveSignals;
