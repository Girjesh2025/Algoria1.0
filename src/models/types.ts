// Market Data Types
export interface IndexPrice {
  symbol: string;
  price: number;
  change: number;
  percentChange: number;
  lastUpdated: Date;
}

// Strategy Types
export interface Strategy {
  id: number;
  name: string;
  tag: string;
  description: string[];
  isActive: boolean;
  accuracy: number;
  tradesCount: number;
  testPeriod: string;
  createdAt: string;
  lastRun?: string;
  details?: {
    methodology: string;
    bestFor: string[];
    timeFrames: string[];
    marketTypes: string[];
    riskLevel: 'Low' | 'Medium' | 'High';
    profitPotential: 'Low' | 'Medium' | 'High';
    requiredCapital: number;
    avgHoldingPeriod: string;
    successRate: number;
    performanceHistory: {
      period: string;
      returnPercentage: number;
      tradesCount: number;
    }[];
  };
  recommendations?: string[];
}

// Signal Types
export interface Signal {
  id: number;
  strategyId: number;
  strategyName: string;
  symbol: string;
  action: 'BUY' | 'SELL';
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  quantity: number;
  timestamp: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  exitPrice?: number;
  pnl?: number;
  exitTimestamp?: string;
}

// Trade Types
export interface Trade {
  id: number;
  date: string;
  script: string;
  strike: string;
  expiry: string;
  signalType: string;
  entryPrice: string;
  exitPrice: string;
  quantity: string;
  pnl: string;
}

// Portfolio Types
export interface PortfolioItem {
  id: number;
  symbol: string;
  quantity: number;
  avgBuyPrice: number;
  currentPrice: number;
  value: number;
  pnl: number;
  pnlPercentage: number;
}

export interface PortfolioSummary {
  totalValue: number;
  totalInvestment: number;
  totalPnl: number;
  pnlPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
}

// Dashboard Types
export interface DashboardStats {
  activeStrategies: number;
  pendingSignals: number;
  completedTrades: number;
  totalPnl: number;
  winRate: number;
}

export interface MarketOverview {
  indices: IndexPrice[];
  topGainers: { symbol: string; change: number }[];
  topLosers: { symbol: string; change: number }[];
  marketBreadth: { advancing: number; declining: number; unchanged: number };
}

// Chart Data Type
export interface ChartDataPoint {
  x: string | number;
  y: number;
}
