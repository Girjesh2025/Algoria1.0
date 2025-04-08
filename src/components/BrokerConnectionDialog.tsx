import React, { useState } from 'react';
import { useApi } from '../context/ApiContext';

interface BrokerConnectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BrokerConnectionDialog: React.FC<BrokerConnectionDialogProps> = ({ isOpen, onClose }) => {
  const { connectToFyers, isAuthenticated, isLoading } = useApi();
  const [selectedBroker, setSelectedBroker] = useState<string>('fyers');

  if (!isOpen) return null;

  const handleConnect = () => {
    if (selectedBroker === 'fyers') {
      connectToFyers();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold dark:text-white">Connect to Broker</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Connect your trading account to start using Algoria Trading Platform
          </p>
          
          <div className="space-y-3 mb-6">
            <div 
              className={`p-4 border rounded-lg cursor-pointer transition-colors flex items-center ${
                selectedBroker === 'fyers' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`}
              onClick={() => setSelectedBroker('fyers')}
            >
              <div className="flex-1">
                <h3 className="font-medium dark:text-white">Fyers</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect to Fyers trading account</p>
              </div>
              <div className="h-5 w-5 rounded-full border border-blue-500 flex items-center justify-center">
                {selectedBroker === 'fyers' && (
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                )}
              </div>
            </div>
            
            <div 
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 flex items-center opacity-50"
            >
              <div className="flex-1">
                <h3 className="font-medium dark:text-white">Zerodha (Coming Soon)</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Connect to Zerodha trading account</p>
              </div>
              <div className="h-5 w-5 rounded-full border border-gray-300 flex items-center justify-center">
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleConnect}
            disabled={isLoading || isAuthenticated}
            className={`px-4 py-2 rounded-md text-white ${
              isLoading || isAuthenticated
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLoading ? 'Connecting...' : isAuthenticated ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BrokerConnectionDialog; 