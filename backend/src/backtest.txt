import Binance from 'binance-api-node';
import { SMA, ATR } from 'technicalindicators';

// Define the interface for strategy settings
interface StrategySettings {
    initialEquity: number; // Initial equity for the backtest
    riskPerTrade: number; // Risk per trade as a percentage of equity
    riskCapitalPerTrade: number; // Risk capital per trade
    lookBack: string; // Number of historical data points to fetch
    pair: string; // Trading pair symbol
    interval: number; // Interval for the historical data
    monteCarlo: boolean; // Flag for Monte Carlo simulation
    commission: number; // Commission per trade
    slippage: number; // Slippage per trade
    pyramiding: string; // Pyramiding strategy
    apiKey: string; // Binance API key
    apiSecret: string; // Binance API secret
    Pyramiding: number; // Pyramiding factor
    [key: string]: any; // Allow additional settings
}

// Define the interface for trade results
interface TradeResult {
    profit: number; // Profit of the trade
    entryPrice: number; // Entry price of the trade
    exitPrice: number; // Exit price of the trade
    entryTime: Date; // Entry time of the trade
    exitTime: Date; // Exit time of the trade
    duration: number; // Duration of the trade
    maxDrawdown: number; // Maximum drawdown of the trade
    tradeType: string; // Type of the trade
    tradeSize: number; // Size of the trade
}

// Define the interface for performance metrics
interface PerformanceMetrics {
    netProfit: number; // Net profit of the backtest
    grossProfit: number; // Gross profit of the backtest
    grossLoss: number; // Gross loss of the backtest
    maxRunUp: number; // Maximum run-up of the backtest
    maxDrawdown: number; // Maximum drawdown of the backtest
    buyHoldReturn: number; // Buy and hold return of the backtest
    sharpeRatio: number; // Sharpe ratio of the backtest
    sortinoRatio: number; // Sortino ratio of the backtest
    profitFactor: number; // Profit factor of the backtest
    maxContractsHeld: number; // Maximum number of contracts held
    openPL: number; // Open profit/loss of the backtest
    commissionPaid: number; // Commission paid during the backtest
    totalClosedTrades: number; // Total number of closed trades
    totalOpenTrades: number; // Total number of open trades
    numberWinningTrades: number; // Number of winning trades
    numberLosingTrades: number; // Number of losing trades
    percentProfitable: number; // Percentage of profitable trades
    avgTrade: number; // Average trade profit/loss
    avgWinningTrade: number; // Average profit of winning trades
    avgLosingTrade: number; // Average loss of losing trades
    ratioAvgWinAvgLoss: number; // Ratio of average win to average loss
    largestWinningTrade: number; // Largest profit of a winning trade
    largestLosingTrade: number; // Largest loss of a losing trade
    avgBarsInTrades: number; // Average duration of trades
    avgBarsInWinningTrades: number; // Average duration of winning trades
    avgBarsInLosingTrades: number; // Average duration of losing trades
}

// Calculate performance metrics based on trade results
const calculatePerformanceMetrics = (results: TradeResult[]): PerformanceMetrics => {
    const totalTrades = results.length;
    const winningTrades = results.filter(result => result.profit > 0).length;
    const losingTrades = totalTrades - winningTrades;
    const winRate = (winningTrades / totalTrades) * 100;
    const netProfit = results.reduce((acc, result) => acc + result.profit, 0);
    const grossProfit = results.filter(result => result.profit > 0).reduce((acc, result) => acc + result.profit, 0);
    const grossLoss = results.filter(result => result.profit < 0).reduce((acc, result) => acc + result.profit, 0);
    const averageProfit = winningTrades > 0 ? grossProfit / winningTrades : 0;
    const averageLoss = losingTrades > 0 ? grossLoss / losingTrades : 0;
    const profitFactor = grossLoss !== 0 ? -grossProfit / grossLoss : 0;
    const maxDrawdown = results.reduce((max, result) => result.maxDrawdown > max ? result.maxDrawdown : max, 0);
    const averageTradeDuration = totalTrades > 0 ? results.reduce((acc, result) => acc + result.duration, 0) / totalTrades : 0;
    const largestWinningTrade = results.reduce((max, result) => result.profit > max ? result.profit : max, 0);
    const largestLosingTrade = results.reduce((min, result) => result.profit < min ? result.profit : min, 0);
    const avgBarsInTrades = totalTrades > 0 ? results.reduce((acc, result) => acc + result.duration, 0) / totalTrades : 0;
    const avgBarsInWinningTrades = winningTrades > 0 ? results.filter(result => result.profit > 0).reduce((acc, result) => acc + result.duration, 0) / winningTrades : 0;
    const avgBarsInLosingTrades = losingTrades > 0 ? results.filter(result => result.profit < 0).reduce((acc, result) => acc + result.duration, 0) / losingTrades : 0;

    // Placeholder for sharpeRatio and sortinoRatio calculation, needs return data and risk-free rate
    const sharpeRatio = 0;
    const sortinoRatio = 0;

    return {
        netProfit,
        grossProfit,
        grossLoss,
        maxRunUp: 0, // Placeholder, need actual logic
        maxDrawdown,
        buyHoldReturn: 0, // Placeholder, need actual logic
        sharpeRatio,
        sortinoRatio,
        profitFactor,
        maxContractsHeld: 0, // Placeholder, need actual logic
        openPL: 0, // Placeholder, need actual logic
        commissionPaid: 0, // Placeholder, need actual logic
        totalClosedTrades: totalTrades,
        totalOpenTrades: 0, // Placeholder, need actual logic
        numberWinningTrades: winningTrades,
        numberLosingTrades: losingTrades,
        percentProfitable: winRate,
        avgTrade: totalTrades > 0 ? netProfit / totalTrades : 0,
        avgWinningTrade: averageProfit,
        avgLosingTrade: averageLoss,
        ratioAvgWinAvgLoss: averageLoss !== 0 ? averageProfit / averageLoss : 0,
        largestWinningTrade,
        largestLosingTrade,
        avgBarsInTrades,
        avgBarsInWinningTrades,
        avgBarsInLosingTrades
    };
};

// Fetch historical data from Binance API
const fetchHistoricalData = async (symbol: string, interval: any, lookback: string, apiKey: string, apiSecret: string): Promise<{ close: number[], high: number[], low: number[], time: number[] }> => {
    const client = Binance({
        apiKey: apiKey,
        apiSecret: apiSecret,
    });

    try {
        const candles = await client.candles({
            symbol: symbol.toUpperCase(),
            interval: interval,
            limit: parseInt(lookback)
        });

        const data = candles.map((candle: any) => ({
            close: parseFloat(candle.close),
            high: parseFloat(candle.high),
            low: parseFloat(candle.low),
            time: candle.openTime
        }));

        return {
            close: data.map(d => d.close),
            high: data.map(d => d.high),
            low: data.map(d => d.low),
            time: data.map(d => d.time)
        };
    } catch (error) {
        console.error('Error fetching historical data:', error);
        throw error;
    }
};

// Execute the strategy code with the given data and settings
const executeStrategy = (strategyCode: string, data: { close: number[], high: number[], low: number[], time: number[] }, settings: StrategySettings): TradeResult[] => {
    const strategyFunction = new Function('data', 'settings', strategyCode);
    return strategyFunction(data, settings);
};

// Perform backtesting with the given strategy code and settings
const backtest = async (strategyCode: string, settings: StrategySettings): Promise<PerformanceMetrics> => {
    const { pair, interval, lookBack, apiKey, apiSecret } = settings;
    const data = await fetchHistoricalData(pair, interval, lookBack, apiKey, apiSecret);
    const trades = executeStrategy(strategyCode, data, settings);
    return calculatePerformanceMetrics(trades);
};

// Export the necessary functions and interfaces
export { backtest, StrategySettings, PerformanceMetrics };
