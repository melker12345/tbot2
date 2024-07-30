import express from 'express';
import { Spot } from '@binance/connector-typescript';
import * as dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const API_KEY = process.env.BINANCE_API_KEY!;
const API_SECRET = process.env.BINANCE_API_SECRET!;
const BASE_URL = 'https://api.binance.com';

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Enable CORS
app.use(express.json());

app.post('/backtest', async (req, res) => {
  const settings = req.body;
  const results = await runBacktest(settings);
  res.json({ results: results || [] });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Strategy Parameters
const defaultFastLength = 9;
const defaultSlowLength = 50;
const defaultRsiLength = 14;
const defaultRsiOverbought = 70;
const defaultRsiOversold = 30;
const defaultAtrLength = 14;
const defaultAtrMultiplier = 1.5;

// Helper Functions to calculate indicators
function sma(data: number[], length: number): number[] {
  const result: number[] = [];
  for (let i = length - 1; i < data.length; i++) {
    const sum = data.slice(i - length + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / length);
  }
  return result;
}

function rsi(data: number[], length: number): number[] {
  const result: number[] = [];
  for (let i = length; i < data.length; i++) {
    const gains: number[] = [];
    const losses: number[] = [];
    for (let j = i - length + 1; j <= i; j++) {
      const change = data[j] - data[j - 1];
      if (change > 0) gains.push(change);
      else losses.push(Math.abs(change));
    }
    const avgGain = gains.reduce((a, b) => a + b, 0) / length;
    const avgLoss = losses.reduce((a, b) => a + b, 0) / length;
    const rs = avgGain / avgLoss;
    result.push(100 - (100 / (1 + rs)));
  }
  return result;
}

function atr(high: number[], low: number[], close: number[], length: number): number[] {
  const result: number[] = [];
  for (let i = length; i < close.length; i++) {
    const tr: number[] = [];
    for (let j = i - length + 1; j <= i; j++) {
      tr.push(Math.max(high[j] - low[j], Math.abs(high[j] - close[j - 1]), Math.abs(low[j] - close[j - 1])));
    }
    result.push(tr.reduce((a, b) => a + b, 0) / length);
  }
  return result;
}

// Function to fetch historical data
async function fetchAllHistoricalData(symbol: string, interval: string, lookBack: number) {
  const maxDataPoints = 1000;
  let allData: any[] = [];
  let remainingCandles = lookBack;
  let endTime = Date.now();

  while (remainingCandles > 0) {
    const limit = Math.min(maxDataPoints, remainingCandles);
    const batchData = await fetchBatchHistoricalData(symbol, interval, limit, endTime);
    
    if (batchData.length === 0) {
      break; // Exit if no data is returned, this prevents infinite loops in case of errors
    }

    allData = batchData.concat(allData); // Add to the start of the array
    remainingCandles -= batchData.length;
    endTime = batchData[0].openTime - 1; // Set endTime to the openTime of the earliest candle minus 1 ms
  }

  return allData;
}

async function fetchBatchHistoricalData(symbol: string, interval: any, limit: number, endTime: number) {
  try {
    const candles = await client.uiklines(symbol, interval, { endTime, limit });
    return candles.map((candle: any) => ({
      openTime: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
      closeTime: candle[6],
      quoteAssetVolume: parseFloat(candle[7]),
      numberOfTrades: candle[8],
      takerBuyBaseAssetVolume: parseFloat(candle[9]),
      takerBuyQuoteAssetVolume: parseFloat(candle[10])
    }));
  } catch (error) {
    console.error('Error fetching historical data:', error);
    return [];
  }
}

// Function to convert interval to milliseconds
function intervalToMillis(interval: string): number {
  const units: { [key: string]: number } = {
    'm': 60 * 1000,
    'h': 60 * 60 * 1000,
    'd': 24 * 60 * 60 * 1000
  };
  const unit = interval.slice(-1);
  const value = parseInt(interval.slice(0, -1), 10);
  return value * units[unit];
}

// Function to run the backtest and return results
async function runBacktest(settings: any) {
  const {
    initialEquity,
    riskPerTrade,
    riskCapitalPerTrade,
    lookBack,
    pair,
    interval,
    commission,
    slippage,
    pyramiding
  } = settings;

  const data = await fetchAllHistoricalData(pair, interval, parseInt(lookBack, 10));
  if (!data.length) return [];

  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const fastMA = sma(closes, defaultFastLength);
  const slowMA = sma(closes, defaultSlowLength);
  const rsiValues = rsi(closes, defaultRsiLength);
  const atrValues = atr(highs, lows, closes, defaultAtrLength);

  let capital = parseFloat(initialEquity);
  let position = 0; // 1 for long, -1 for short, 0 for no position
  let entryPrice = 0;
  let performance = [];
  let trades = 0;
  let wins = 0;
  let losses = 0;
  let totalPercentGain = 0;
  let totalPercentLoss = 0;

  for (let i = Math.max(defaultFastLength, defaultSlowLength, defaultRsiLength, defaultAtrLength); i < closes.length; i++) {
    const currentPrice = closes[i];
    const fast = fastMA[i - defaultFastLength];
    const slow = slowMA[i - defaultSlowLength];
    const rsi = rsiValues[i - defaultRsiLength];
    const atr = atrValues[i - defaultAtrLength];

    const longCondition = fast > slow && rsi < defaultRsiOverbought;
    const shortCondition = fast < slow && rsi > defaultRsiOversold;

    if (position === 0) {
      if (longCondition) {
        position = 1;
        entryPrice = currentPrice;
      } else if (shortCondition) {
        position = -1;
        entryPrice = currentPrice;
      }
    }

    const stopLoss = position === 1 ? entryPrice - atr * defaultAtrMultiplier : entryPrice + atr * defaultAtrMultiplier;
    const takeProfit = position === 1 ? entryPrice + atr * defaultAtrMultiplier * 2 : entryPrice - atr * defaultAtrMultiplier * 2;

    const tradeSize = capital * (parseFloat(riskPerTrade) / 100);

    if (position === 1 && (currentPrice <= stopLoss || currentPrice >= takeProfit)) {
      const percentChange = ((currentPrice - entryPrice) / entryPrice) * 100;
      capital += (currentPrice - entryPrice) * (tradeSize / entryPrice) * (1 - parseFloat(commission) / 100) - (tradeSize * parseFloat(slippage) / 100);
      performance.push({ date: data[i].openTime, capital });
      trades++;
      if (percentChange > 0) {
        wins++;
        totalPercentGain += percentChange;
      } else {
        losses++;
        totalPercentLoss += percentChange;
      }
      position = 0;
    } else if (position === -1 && (currentPrice >= stopLoss || currentPrice <= takeProfit)) {
      const percentChange = ((entryPrice - currentPrice) / entryPrice) * 100;
      capital += (entryPrice - currentPrice) * (tradeSize / entryPrice) * (1 - parseFloat(commission) / 100) - (tradeSize * parseFloat(slippage) / 100);
      performance.push({ date: data[i].openTime, capital });
      trades++;
      if (percentChange > 0) {
        wins++;
        totalPercentGain += percentChange;
      } else {
        losses++;
        totalPercentLoss += percentChange;
      }
      position = 0;
    }
  }

  const netProfit = capital - parseFloat(initialEquity);
  const netProfitPercent = (netProfit / parseFloat(initialEquity)) * 100;
  const profitRatio = wins / losses;
  const averageTrade = netProfitPercent / trades;

  const results = [
    { result: "Strategy", value: "Trend Following Strategy" },
    { result: "Final Balance", value: capital.toFixed(2) },
    { result: "Net Profit", value: netProfit.toFixed(2) },
    { result: "Net Profit Percent (%)", value: netProfitPercent.toFixed(2) },
    { result: "Profit Ratio", value: profitRatio.toFixed(2) },
    { result: "Total Closed Trades", value: trades.toString() },
    { result: "Average Trade", value: averageTrade.toFixed(2) },
  ];

  return results;
}
