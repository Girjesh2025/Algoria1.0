import {
  Strategy,
  Signal,
  Trade,
  PortfolioItem,
  PortfolioSummary,
  DashboardStats,
  MarketOverview,
  IndexPrice,
  ChartDataPoint
} from '../models/types';

// Mock Strategies
let strategies: Strategy[] = [
  {
    id: 1,
    name: "Golden Crossover",
    tag: "GC-01",
    description: [
      "Identifies trend reversals using 50-day and 200-day moving averages",
      "Generates buy signals when 50-day MA crosses above 200-day MA",
      "Optimized for medium to long-term position trading"
    ],
    isActive: true,
    accuracy: 76,
    tradesCount: 42,
    testPeriod: "Jan 2024 - Apr 2025",
    createdAt: "2024-01-15",
    lastRun: "2025-04-05 09:15:22",
    details: {
      methodology: "Technical Analysis with Moving Average Crossovers",
      bestFor: ["Trending Markets", "Index Options", "Blue-chip Stocks"],
      timeFrames: ["Daily", "Weekly"],
      marketTypes: ["Bull Markets", "Recovering Markets"],
      riskLevel: "Medium" as "Low" | "Medium" | "High",
      profitPotential: "Medium" as "Low" | "Medium" | "High",
      requiredCapital: 50000,
      avgHoldingPeriod: "15-30 days",
      successRate: 0.76,
      performanceHistory: [
        { period: "Jan 2025", returnPercentage: 8.2, tradesCount: 4 },
        { period: "Feb 2025", returnPercentage: 6.7, tradesCount: 5 },
        { period: "Mar 2025", returnPercentage: 4.3, tradesCount: 3 }
      ]
    },
    recommendations: [
      "Best used for NIFTY and BANKNIFTY options",
      "Set stop-loss at 8% below entry price",
      "Consider taking partial profits at 15% gain"
    ]
  },
  {
    id: 2,
    name: "RSI Reversal",
    tag: "RSI-05",
    description: [
      "Identifies overbought and oversold conditions using RSI indicator",
      "Generates signals when RSI crosses key thresholds (30 and 70)",
      "Includes confirmation with price action patterns"
    ],
    isActive: true,
    accuracy: 82,
    tradesCount: 67,
    testPeriod: "Nov 2023 - Apr 2025",
    createdAt: "2023-11-05",
    lastRun: "2025-04-05 09:30:12",
    details: {
      methodology: "RSI Momentum Trading with Price Action Confirmation",
      bestFor: ["Volatile Markets", "Large-cap Stocks", "Commodities"],
      timeFrames: ["Hourly", "4-Hour", "Daily"],
      marketTypes: ["Range-bound Markets", "Volatile Markets"],
      riskLevel: "Medium" as "Low" | "Medium" | "High",
      profitPotential: "High" as "Low" | "Medium" | "High",
      requiredCapital: 75000,
      avgHoldingPeriod: "3-10 days",
      successRate: 0.82,
      performanceHistory: [
        { period: "Jan 2025", returnPercentage: 12.5, tradesCount: 7 },
        { period: "Feb 2025", returnPercentage: 9.8, tradesCount: 8 },
        { period: "Mar 2025", returnPercentage: 7.4, tradesCount: 6 }
      ]
    },
    recommendations: [
      "Best for trading in high volatility periods",
      "Avoid using during strong trend phases",
      "Increase position size when confirmation is strong"
    ]
  },
  {
    id: 3,
    name: "Volume Breakout",
    tag: "VB-03",
    description: [
      "Identifies price breakouts supported by high volume",
      "Filters false breakouts using volume confirmation",
      "Uses ATR for position sizing and stop-loss placement"
    ],
    isActive: false,
    accuracy: 68,
    tradesCount: 35,
    testPeriod: "Feb 2024 - Apr 2025",
    createdAt: "2024-02-20",
    lastRun: "2025-04-04 15:45:22",
    details: {
      methodology: "Price Breakouts with Volume Confirmation",
      bestFor: ["Mid and Small-cap Stocks", "Sector Rotations", "Post-news Trading"],
      timeFrames: ["Daily"],
      marketTypes: ["All Market Types"],
      riskLevel: "High" as "Low" | "Medium" | "High",
      profitPotential: "High" as "Low" | "Medium" | "High",
      requiredCapital: 100000,
      avgHoldingPeriod: "5-15 days",
      successRate: 0.68,
      performanceHistory: [
        { period: "Jan 2025", returnPercentage: 15.6, tradesCount: 3 },
        { period: "Feb 2025", returnPercentage: 8.9, tradesCount: 4 },
        { period: "Mar 2025", returnPercentage: 10.3, tradesCount: 5 }
      ]
    },
    recommendations: [
      "Use wider stops than usual to avoid premature exits",
      "Best results when trading with the overall market trend",
      "Risk no more than 2% of capital per trade"
    ]
  },
  {
    id: 4,
    name: "EMA Strategy",
    tag: "EMA-02",
    description: [
      "Uses 8-21-34 Exponential Moving Average system",
      "Generates signals on EMA alignment and price crossovers",
      "Includes trend strength filter to avoid sideways markets"
    ],
    isActive: true,
    accuracy: 72,
    tradesCount: 53,
    testPeriod: "Dec 2023 - Apr 2025",
    createdAt: "2023-12-10",
    lastRun: "2025-04-05 10:10:05",
    details: {
      methodology: "Multiple EMA Trading System",
      bestFor: ["Index Options", "Futures", "Trending Markets"],
      timeFrames: ["Hourly", "4-Hour", "Daily"],
      marketTypes: ["Trending Markets"],
      riskLevel: "Medium" as "Low" | "Medium" | "High",
      profitPotential: "Medium" as "Low" | "Medium" | "High",
      requiredCapital: 60000,
      avgHoldingPeriod: "8-20 days",
      successRate: 0.72,
      performanceHistory: [
        { period: "Jan 2025", returnPercentage: 9.2, tradesCount: 5 },
        { period: "Feb 2025", returnPercentage: 7.8, tradesCount: 6 },
        { period: "Mar 2025", returnPercentage: 8.1, tradesCount: 4 }
      ]
    },
    recommendations: [
      "Avoid trading during low volatility periods",
      "Consider pyramiding positions in strong trends",
      "Exit trades when 8-EMA crosses below 21-EMA"
    ]
  }
];

export const getStrategies = (): Strategy[] => {
  return strategies;
};

// Function to toggle strategy active status
export const toggleStrategyStatus = (strategyId: number): Strategy => {
  const strategy = strategies.find(s => s.id === strategyId);

  if (!strategy) {
    throw new Error(`Strategy with ID ${strategyId} not found`);
  }

  // Toggle isActive status
  strategy.isActive = !strategy.isActive;

  // Update last run timestamp if activating
  if (strategy.isActive) {
    strategy.lastRun = new Date().toISOString().replace('T', ' ').substring(0, 19);
  }

  // Return the updated strategy
  return { ...strategy };
};

// Mock Live Signals
export const getLiveSignals = (): Signal[] => {
  return [
    {
      id: 101,
      strategyId: 1,
      strategyName: "Golden Crossover",
      symbol: "NIFTY 24500 CE",
      action: "BUY",
      entryPrice: 245.70,
      stopLoss: 220.50,
      takeProfit: 295.00,
      quantity: 50,
      timestamp: "2025-04-05 09:35:22",
      status: "ACTIVE",
      notes: "Strong momentum signal with volume confirmation"
    },
    {
      id: 102,
      strategyId: 2,
      strategyName: "RSI Reversal",
      symbol: "BANKNIFTY 52000 PE",
      action: "BUY",
      entryPrice: 356.85,
      stopLoss: 320.20,
      takeProfit: 425.50,
      quantity: 25,
      timestamp: "2025-04-05 10:15:45",
      status: "PENDING",
      notes: "RSI showing oversold conditions on hourly timeframe"
    },
    {
      id: 103,
      strategyId: 4,
      strategyName: "EMA Strategy",
      symbol: "RELIANCE",
      action: "BUY",
      entryPrice: 2875.50,
      stopLoss: 2810.00,
      takeProfit: 2980.00,
      quantity: 35,
      timestamp: "2025-04-05 11:05:12",
      status: "ACTIVE",
      notes: "All EMAs aligned in bullish configuration"
    },
    {
      id: 104,
      strategyId: 1,
      strategyName: "Golden Crossover",
      symbol: "HDFC BANK",
      action: "SELL",
      entryPrice: 1755.30,
      stopLoss: 1795.00,
      takeProfit: 1680.00,
      quantity: 45,
      timestamp: "2025-04-05 09:45:18",
      status: "ACTIVE",
      notes: "Death cross forming on daily chart"
    },
    {
      id: 105,
      strategyId: 2,
      strategyName: "RSI Reversal",
      symbol: "INFY",
      action: "BUY",
      entryPrice: 1560.75,
      stopLoss: 1520.00,
      takeProfit: 1650.00,
      quantity: 30,
      timestamp: "2025-04-04 15:25:00",
      status: "COMPLETED",
      exitPrice: 1648.50,
      pnl: 2632.50,
      exitTimestamp: "2025-04-05 11:30:22",
      notes: "Target achieved after positive sector news"
    },
    {
      id: 106,
      strategyId: 4,
      strategyName: "EMA Strategy",
      symbol: "TATASTEEL",
      action: "SELL",
      entryPrice: 178.35,
      stopLoss: 185.00,
      takeProfit: 165.00,
      quantity: 200,
      timestamp: "2025-04-05 10:55:32",
      status: "PENDING",
      notes: "Bearish EMA crossover forming"
    }
  ];
};

// Mock Trades for Signal Report
export const getTradesForSignalReport = (): Trade[] => {
  return [
    {
      id: 1,
      date: "21-Jan-25 09:18",
      script: "BANKNIFTY-PE",
      strike: "49400",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "602.40",
      exitPrice: "656.55",
      quantity: "15",
      pnl: "812"
    },
    {
      id: 2,
      date: "21-Jan-25 09:29",
      script: "BANKNIFTY-PE",
      strike: "49300",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "585.90",
      exitPrice: "611.20",
      quantity: "15",
      pnl: "380"
    },
    {
      id: 3,
      date: "21-Jan-25 09:32",
      script: "BANKNIFTY-PE",
      strike: "49100",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "543.20",
      exitPrice: "551.20",
      quantity: "15",
      pnl: "120"
    },
    {
      id: 4,
      date: "21-Jan-25 09:36",
      script: "NIFTY-CE",
      strike: "21500",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "553.95",
      exitPrice: "564.70",
      quantity: "15",
      pnl: "161"
    },
    {
      id: 5,
      date: "21-Jan-25 10:18",
      script: "NIFTY-CE",
      strike: "21600",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "251.40",
      exitPrice: "271.05",
      quantity: "25",
      pnl: "490"
    },
    {
      id: 6,
      date: "22-Jan-25 10:29",
      script: "NIFTY-PE",
      strike: "21400",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "185.90",
      exitPrice: "201.20",
      quantity: "25",
      pnl: "382"
    },
    {
      id: 7,
      date: "22-Jan-25 11:18",
      script: "BANKNIFTY-CE",
      strike: "49500",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "452.40",
      exitPrice: "486.55",
      quantity: "10",
      pnl: "341"
    },
    {
      id: 8,
      date: "23-Jan-25 09:45",
      script: "NIFTY-CE",
      strike: "21800",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "175.60",
      exitPrice: "205.30",
      quantity: "20",
      pnl: "594"
    },
    {
      id: 9,
      date: "23-Jan-25 10:15",
      script: "BANKNIFTY-PE",
      strike: "49600",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "385.75",
      exitPrice: "362.40",
      quantity: "15",
      pnl: "-350"
    },
    {
      id: 10,
      date: "24-Jan-25 09:22",
      script: "NIFTY-PE",
      strike: "21300",
      expiry: "30-Jan-2025",
      signalType: "BUY Entry",
      entryPrice: "198.30",
      exitPrice: "218.55",
      quantity: "25",
      pnl: "506"
    }
  ];
};

// Mock Portfolio Data
export const getPortfolioItems = (): PortfolioItem[] => {
  return [
    {
      id: 1,
      symbol: "NIFTY 24500 CE",
      quantity: 50,
      avgBuyPrice: 245.70,
      currentPrice: 262.80,
      value: 13140,
      pnl: 855,
      pnlPercentage: 6.96
    },
    {
      id: 2,
      symbol: "RELIANCE",
      quantity: 35,
      avgBuyPrice: 2875.50,
      currentPrice: 2915.25,
      value: 102033.75,
      pnl: 1391.25,
      pnlPercentage: 1.38
    },
    {
      id: 3,
      symbol: "HDFC BANK",
      quantity: 45,
      avgBuyPrice: 1755.30,
      currentPrice: 1712.60,
      value: 77067,
      pnl: -1921.5,
      pnlPercentage: -2.43
    },
    {
      id: 4,
      symbol: "INFY",
      quantity: 30,
      avgBuyPrice: 1560.75,
      currentPrice: 1648.50,
      value: 49455,
      pnl: 2632.5,
      pnlPercentage: 5.62
    },
    {
      id: 5,
      symbol: "BANKNIFTY 52000 PE",
      quantity: 25,
      avgBuyPrice: 356.85,
      currentPrice: 376.20,
      value: 9405,
      pnl: 483.75,
      pnlPercentage: 5.42
    }
  ];
};

export const getPortfolioSummary = (): PortfolioSummary => {
  return {
    totalValue: 251100.75,
    totalInvestment: 248660,
    totalPnl: 2440.75,
    pnlPercentage: 0.98,
    dayChange: 1865.50,
    dayChangePercentage: 0.75
  };
};

// Dashboard Data
export const getDashboardStats = (): DashboardStats => {
  return {
    activeStrategies: 3,
    pendingSignals: 2,
    completedTrades: 126,
    totalPnl: 38450,
    winRate: 0.78
  };
};

export const getMarketOverview = (): MarketOverview => {
  return {
    indices: [
      {
        symbol: 'NIFTY',
        price: 24396.18,
        change: -69.49,
        percentChange: -0.28,
        lastUpdated: new Date()
      },
      {
        symbol: 'BANKNIFTY',
        price: 51282.29,
        change: -103.07,
        percentChange: -0.20,
        lastUpdated: new Date()
      },
      {
        symbol: 'SENSEX',
        price: 79965.36,
        change: -234.62,
        percentChange: -0.29,
        lastUpdated: new Date()
      }
    ],
    topGainers: [
      { symbol: "INFY", change: 2.85 },
      { symbol: "TATASTEEL", change: 2.12 },
      { symbol: "POWERGRID", change: 1.78 },
      { symbol: "RELIANCE", change: 1.56 },
      { symbol: "HCLTECH", change: 1.35 }
    ],
    topLosers: [
      { symbol: "BHARTIARTL", change: -2.45 },
      { symbol: "INDUSINDBK", change: -1.87 },
      { symbol: "HDFCBANK", change: -1.56 },
      { symbol: "AXISBANK", change: -1.38 },
      { symbol: "ICICIBANK", change: -1.22 }
    ],
    marketBreadth: {
      advancing: 1258,
      declining: 2132,
      unchanged: 124
    }
  };
};

// Chart Data
export const getPnlChartData = (): ChartDataPoint[] => {
  return [
    { x: "Jan", y: 5240 },
    { x: "Feb", y: 8720 },
    { x: "Mar", y: 7350 },
    { x: "Apr", y: 9180 },
    { x: "May", y: 11450 },
    { x: "Jun", y: 8920 },
    { x: "Jul", y: 12340 },
    { x: "Aug", y: 10850 },
    { x: "Sep", y: 13620 },
    { x: "Oct", y: 15780 },
    { x: "Nov", y: 14250 },
    { x: "Dec", y: 17235 }
  ];
};

export const getStrategyPerformanceData = (strategyId: number): ChartDataPoint[] => {
  const baseData: Record<number, ChartDataPoint[]> = {
    1: [
      { x: "Week 1", y: 3.2 },
      { x: "Week 2", y: 2.8 },
      { x: "Week 3", y: 4.5 },
      { x: "Week 4", y: 3.9 },
      { x: "Week 5", y: 5.1 },
      { x: "Week 6", y: 4.8 },
      { x: "Week 7", y: 3.5 },
      { x: "Week 8", y: 6.2 }
    ],
    2: [
      { x: "Week 1", y: 5.6 },
      { x: "Week 2", y: 4.8 },
      { x: "Week 3", y: 7.2 },
      { x: "Week 4", y: 6.5 },
      { x: "Week 5", y: 8.4 },
      { x: "Week 6", y: 7.9 },
      { x: "Week 7", y: 6.2 },
      { x: "Week 8", y: 9.5 }
    ],
    3: [
      { x: "Week 1", y: 7.8 },
      { x: "Week 2", y: 4.5 },
      { x: "Week 3", y: 9.2 },
      { x: "Week 4", y: 5.8 },
      { x: "Week 5", y: 10.4 },
      { x: "Week 6", y: 6.7 },
      { x: "Week 7", y: 8.3 },
      { x: "Week 8", y: 11.2 }
    ],
    4: [
      { x: "Week 1", y: 4.3 },
      { x: "Week 2", y: 3.7 },
      { x: "Week 3", y: 5.1 },
      { x: "Week 4", y: 4.8 },
      { x: "Week 5", y: 6.2 },
      { x: "Week 6", y: 5.5 },
      { x: "Week 7", y: 4.9 },
      { x: "Week 8", y: 7.3 }
    ]
  };

  return baseData[strategyId] || baseData[1];
};
