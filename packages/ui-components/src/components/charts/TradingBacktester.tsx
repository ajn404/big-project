import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineStyle, ColorType, CandlestickData, Time } from 'lightweight-charts';
import axios from 'axios';
import { format, subYears, startOfDay } from 'date-fns';

// Types for market data and trading strategies
interface MarketData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface TradingSignal {
  time: string;
  type: 'buy' | 'sell';
  price: number;
  reason: string;
}

interface BacktestResult {
  totalReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  signals: TradingSignal[];
}

interface TradingBacktesterProps {
  symbol?: string;
  strategy?: 'grid' | 'momentum' | 'macd' | 'volumePrice';
}

const TradingBacktester: React.FC<TradingBacktesterProps> = ({ 
  symbol = 'SPY', 
  strategy = 'grid' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<any>(null);
  const [currentSymbol, setCurrentSymbol] = useState(symbol);
  const [currentStrategy, setCurrentStrategy] = useState(strategy);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch market data from Alpha Vantage (free API)
  const fetchMarketData = async (symbol: string): Promise<MarketData[]> => {
    try {
      // Using Alpha Vantage free tier - replace with your API key
      const API_KEY = '3KICG63RRV8FOO8M'; // Use 'demo' for demo data
      const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=full&apikey=${API_KEY}`;
      
      const response = await axios.get(url);
      const timeSeries = response.data['Time Series (Daily)'];
      
      if (!timeSeries) {
        throw new Error('Failed to fetch market data');
      }
      
      const data: MarketData[] = Object.entries(timeSeries)
        .map(([date, values]: [string, any]) => ({
          time: date,
          open: parseFloat(values['1. open']),
          high: parseFloat(values['2. high']),
          low: parseFloat(values['3. low']),
          close: parseFloat(values['4. close']),
          volume: parseInt(values['5. volume'])
        }))
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .filter(item => {
          const itemDate = new Date(item.time);
          const oneYearAgo = subYears(new Date(), 1);
          return itemDate >= oneYearAgo;
        });
        
      return data;
    } catch (error) {
      // Fallback to mock data if API fails
      return generateMockData(symbol);
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (symbol: string): MarketData[] => {
    const data: MarketData[] = [];
    const startDate = subYears(new Date(), 1);
    const basePrice = symbol === 'QQQ' ? 380 : symbol === 'SPY' ? 450 : 200;
    
    for (let i = 0; i < 252; i++) { // ~1 year of trading days
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const prevClose = i === 0 ? basePrice : data[i - 1].close;
      const volatility = 0.02;
      const drift = 0.0003;
      
      const change = (Math.random() - 0.5) * volatility + drift;
      const open = prevClose * (1 + change * 0.5);
      const close = prevClose * (1 + change);
      const high = Math.max(open, close) * (1 + Math.random() * 0.01);
      const low = Math.min(open, close) * (1 - Math.random() * 0.01);
      const volume = Math.floor(1000000 + Math.random() * 5000000);
      
      data.push({
        time: format(date, 'yyyy-MM-dd'),
        open: Number(open.toFixed(2)),
        high: Number(high.toFixed(2)),
        low: Number(low.toFixed(2)),
        close: Number(close.toFixed(2)),
        volume
      });
    }
    
    return data;
  };

  // Trading Strategies Implementation
  const gridTradingStrategy = (data: MarketData[]): TradingSignal[] => {
    const signals: TradingSignal[] = [];
    const gridSize = 0.02; // 2% grid
    let position = 0;
    let lastBuyPrice = 0;
    
    for (let i = 1; i < data.length; i++) {
      const current = data[i];
      const prev = data[i - 1];
      
      // Buy signal: price drops by grid size
      if (position <= 0 && current.close < prev.close * (1 - gridSize)) {
        signals.push({
          time: current.time,
          type: 'buy',
          price: current.close,
          reason: `网格买入 (下跌${(gridSize * 100).toFixed(1)}%)`
        });
        position = 1;
        lastBuyPrice = current.close;
      }
      
      // Sell signal: price rises by grid size
      if (position > 0 && current.close > lastBuyPrice * (1 + gridSize)) {
        signals.push({
          time: current.time,
          type: 'sell',
          price: current.close,
          reason: `网格卖出 (上涨${(gridSize * 100).toFixed(1)}%)`
        });
        position = 0;
      }
    }
    
    return signals;
  };

  const momentumStrategy = (data: MarketData[]): TradingSignal[] => {
    const signals: TradingSignal[] = [];
    let position = 0;
    
    for (let i = 20; i < data.length; i++) {
      const current = data[i];
      const ma20 = data.slice(i - 19, i + 1).reduce((sum, item) => sum + item.close, 0) / 20;
      
      // 打板策略：突破20日均线且成交量放大
      const volumeRatio = current.volume / (data.slice(i - 4, i).reduce((sum, item) => sum + item.volume, 0) / 5);
      
      if (position <= 0 && current.close > ma20 * 1.02 && volumeRatio > 1.5) {
        signals.push({
          time: current.time,
          type: 'buy',
          price: current.close,
          reason: `突破买入 (价格突破MA20，成交量放大${volumeRatio.toFixed(1)}倍)`
        });
        position = 1;
      }
      
      if (position > 0 && current.close < ma20 * 0.95) {
        signals.push({
          time: current.time,
          type: 'sell',
          price: current.close,
          reason: '止损卖出 (跌破MA20 5%)'
        });
        position = 0;
      }
    }
    
    return signals;
  };

  const macdStrategy = (data: MarketData[]): TradingSignal[] => {
    const signals: TradingSignal[] = [];
    let position = 0;
    
    // Calculate MACD
    const calculateEMA = (prices: number[], period: number) => {
      const multiplier = 2 / (period + 1);
      let ema = prices[0];
      const result = [ema];
      
      for (let i = 1; i < prices.length; i++) {
        ema = (prices[i] * multiplier) + (ema * (1 - multiplier));
        result.push(ema);
      }
      return result;
    };
    
    const prices = data.map(d => d.close);
    const ema12 = calculateEMA(prices, 12);
    const ema26 = calculateEMA(prices, 26);
    const macdLine = ema12.map((val, i) => val - ema26[i]);
    const signalLine = calculateEMA(macdLine, 9);
    
    for (let i = 30; i < data.length; i++) {
      const current = data[i];
      const macd = macdLine[i];
      const signal = signalLine[i];
      const prevMacd = macdLine[i - 1];
      const prevSignal = signalLine[i - 1];
      
      // MACD金叉买入
      if (position <= 0 && macd > signal && prevMacd <= prevSignal) {
        signals.push({
          time: current.time,
          type: 'buy',
          price: current.close,
          reason: 'MACD金叉买入信号'
        });
        position = 1;
      }
      
      // MACD死叉卖出
      if (position > 0 && macd < signal && prevMacd >= prevSignal) {
        signals.push({
          time: current.time,
          type: 'sell',
          price: current.close,
          reason: 'MACD死叉卖出信号'
        });
        position = 0;
      }
    }
    
    return signals;
  };

  const volumePriceStrategy = (data: MarketData[]): TradingSignal[] => {
    const signals: TradingSignal[] = [];
    let position = 0;
    
    for (let i = 10; i < data.length; i++) {
      const current = data[i];
      const avgVolume = data.slice(i - 9, i).reduce((sum, item) => sum + item.volume, 0) / 10;
      const priceChange = (current.close - data[i - 1].close) / data[i - 1].close;
      
      // 量价齐升买入
      if (position <= 0 && priceChange > 0.01 && current.volume > avgVolume * 1.5) {
        signals.push({
          time: current.time,
          type: 'buy',
          price: current.close,
          reason: `量价齐升买入 (涨幅${(priceChange * 100).toFixed(1)}%, 量比${(current.volume / avgVolume).toFixed(1)})`
        });
        position = 1;
      }
      
      // 量价背离卖出
      if (position > 0 && priceChange < -0.02 && current.volume > avgVolume * 1.2) {
        signals.push({
          time: current.time,
          type: 'sell',
          price: current.close,
          reason: `量价背离卖出 (跌幅${Math.abs(priceChange * 100).toFixed(1)}%)`
        });
        position = 0;
      }
    }
    
    return signals;
  };

  // Calculate backtest results
  const calculateBacktestResults = (data: MarketData[], signals: TradingSignal[]): BacktestResult => {
    let capital = 100000; // Starting capital
    let shares = 0;
    let maxCapital = capital;
    let maxDrawdown = 0;
    let wins = 0;
    let losses = 0;
    const returns: number[] = [];
    
    for (const signal of signals) {
      const price = signal.price;
      
      if (signal.type === 'buy' && shares === 0) {
        shares = Math.floor(capital / price);
        capital -= shares * price;
      } else if (signal.type === 'sell' && shares > 0) {
        const sellValue = shares * price;
        const profit = sellValue - (shares * (capital / shares));
        capital = sellValue;
        shares = 0;
        
        if (profit > 0) wins++;
        else losses++;
        
        returns.push(profit / 100000);
      }
      
      const currentValue = capital + (shares * price);
      maxCapital = Math.max(maxCapital, currentValue);
      const drawdown = (maxCapital - currentValue) / maxCapital;
      maxDrawdown = Math.max(maxDrawdown, drawdown);
    }
    
    // Final position value
    if (shares > 0) {
      const finalPrice = data[data.length - 1].close;
      capital += shares * finalPrice;
    }
    
    const totalReturn = (capital - 100000) / 100000;
    const winRate = wins / (wins + losses) || 0;
    
    // Simple Sharpe ratio calculation
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length || 0;
    const returnStd = Math.sqrt(returns.reduce((sum, ret) => sum + Math.pow(ret - avgReturn, 2), 0) / returns.length) || 1;
    const sharpeRatio = avgReturn / returnStd * Math.sqrt(252); // Annualized
    
    return {
      totalReturn,
      maxDrawdown,
      sharpeRatio,
      winRate,
      totalTrades: signals.length,
      signals
    };
  };

  // Execute backtest
  const runBacktest = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchMarketData(currentSymbol);
      setMarketData(data);
      
      let signals: TradingSignal[] = [];
      
      switch (currentStrategy) {
        case 'grid':
          signals = gridTradingStrategy(data);
          break;
        case 'momentum':
          signals = momentumStrategy(data);
          break;
        case 'macd':
          signals = macdStrategy(data);
          break;
        case 'volumePrice':
          signals = volumePriceStrategy(data);
          break;
      }
      
      const result = calculateBacktestResults(data, signals);
      setBacktestResult(result);
      
      // Update chart
      if (chartRef.current && candlestickSeriesRef.current) {
        const chartData = data.map(d => ({
          time: d.time as any,
          open: d.open,
          high: d.high,
          low: d.low,
          close: d.close
        }));
        
        candlestickSeriesRef.current.setData(chartData);
        
        // Add buy/sell markers
        const markers = signals.map(signal => ({
          time: signal.time as any,
          position: signal.type === 'buy' ? 'belowBar' as const : 'aboveBar' as const,
          color: signal.type === 'buy' ? '#2196F3' : '#f44336',
          shape: signal.type === 'buy' ? 'arrowUp' as const : 'arrowDown' as const,
          text: signal.type === 'buy' ? '买' : '卖'
        }));
        
        // Use chart's setMarkers instead of series setMarkers
        if (chartRef.current) {
          (chartRef.current as any).setMarkers?.(markers);
        }
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;
    
    const chart = createChart(chartContainerRef.current, {
      layout: {
        textColor: '#333',
        background: { type: ColorType.Solid, color: 'white' }
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#f0f0f0' },
        horzLines: { color: '#f0f0f0' }
      },
      crosshair: {
        mode: 0
      },
      timeScale: {
        borderColor: '#485c7b'
      }
    });

    const candlestickSeries = (chart as any).addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#838ca1',
      wickUpColor: '#838ca1'
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, []);

  // Load initial data
  useEffect(() => {
    runBacktest();
  }, []);

  return (
    <div className="w-full h-full bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          量化交易策略回测系统
        </h2>
        
        {/* Strategy and Symbol Selection */}
        <div className="flex flex-wrap gap-4 mb-4">
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={currentSymbol}
            onChange={(e) => setCurrentSymbol(e.target.value)}
          >
            <option value="SPY">SPDR S&P 500 ETF (SPY)</option>
            <option value="QQQ">Invesco QQQ Trust (QQQ)</option>
            <option value="VTI">Vanguard Total Stock Market ETF (VTI)</option>
          </select>
          
          <select 
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            value={currentStrategy}
            onChange={(e) => setCurrentStrategy(e.target.value as any)}
          >
            <option value="grid">网格交易策略</option>
            <option value="momentum">打板交易策略</option>
            <option value="macd">MACD指标策略</option>
            <option value="volumePrice">量价交易策略</option>
          </select>
          
          <button 
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={loading}
            onClick={runBacktest}
          >
            {loading ? '回测中...' : '开始回测'}
          </button>
        </div>
      </div>

      {/* Chart Container */}
      <div className="mb-6">
        <div 
          ref={chartContainerRef} 
          className="w-full h-96 border border-gray-200 dark:border-gray-700 rounded-lg"
        />
      </div>

      {/* Backtest Results */}
      {backtestResult && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">总收益率</h3>
            <p className={`text-2xl font-bold ${backtestResult.totalReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {(backtestResult.totalReturn * 100).toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">最大回撤</h3>
            <p className="text-2xl font-bold text-red-600">
              {(backtestResult.maxDrawdown * 100).toFixed(2)}%
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">夏普比率</h3>
            <p className="text-2xl font-bold text-blue-600">
              {backtestResult.sharpeRatio.toFixed(2)}
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">胜率</h3>
            <p className="text-2xl font-bold text-green-600">
              {(backtestResult.winRate * 100).toFixed(1)}%
            </p>
          </div>
          
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">交易次数</h3>
            <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
              {backtestResult.totalTrades}
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          错误: {error}
        </div>
      )}
    </div>
  );
};

export default TradingBacktester;