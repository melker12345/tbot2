import { Spot } from '@binance/connector-typescript';
import * as dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.BINANCE_API_KEY!;
const API_SECRET = process.env.BINANCE_API_SECRET!;
const BASE_URL = 'https://api.binance.com';

const client = new Spot(API_KEY, API_SECRET, { baseURL: BASE_URL });

// Strategy Parameters
const fastLength = 9;
const slowLength = 50;
const rsiLength = 14;
const rsiOverbought = 70;
const rsiOversold = 30;
const atrLength = 14;
const atrMultiplier = 1.5;
const riskPercent = 1;

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
async function fetchHistoricalData(symbol: string, interval: any, startTime: number, endTime: number) {
  try {
    const candles = await client.uiklines(symbol, interval, { startTime, endTime });
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

// Function to execute the backtest
async function backtest(symbol: string, interval: string, startTime: number, endTime: number) {
  const data = await fetchHistoricalData(symbol, interval, startTime, endTime);
  if (!data.length) return;

  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const fastMA = sma(closes, fastLength);
  const slowMA = sma(closes, slowLength);
  const rsiValues = rsi(closes, rsiLength);
  const atrValues = atr(highs, lows, closes, atrLength);

  let initialCapital = 1000;
  let capital = initialCapital;
  let position = 0; // 1 for long, -1 for short, 0 for no position
  let entryPrice = 0;
  let performance = [];
  let trades = 0;
  let wins = 0;
  let losses = 0;
  let totalPercentGain = 0;
  let totalPercentLoss = 0;

  for (let i = Math.max(fastLength, slowLength, rsiLength, atrLength); i < closes.length; i++) {
    const currentPrice = closes[i];
    const fast = fastMA[i - fastLength];
    const slow = slowMA[i - slowLength];
    const rsi = rsiValues[i - rsiLength];
    const atr = atrValues[i - atrLength];

    const longCondition = fast > slow && rsi < rsiOverbought;
    const shortCondition = fast < slow && rsi > rsiOversold;

    if (position === 0) {
      if (longCondition) {
        position = 1;
        entryPrice = currentPrice;
        console.log(`Entering long position at ${currentPrice}`);
      } else if (shortCondition) {
        position = -1;
        entryPrice = currentPrice;
        console.log(`Entering short position at ${currentPrice}`);
      }
    }

    const stopLoss = position === 1 ? entryPrice - atr * atrMultiplier : entryPrice + atr * atrMultiplier;
    const takeProfit = position === 1 ? entryPrice + atr * atrMultiplier * 2 : entryPrice - atr * atrMultiplier * 2;

    if (position === 1 && (currentPrice <= stopLoss || currentPrice >= takeProfit)) {
      const percentChange = ((currentPrice - entryPrice) / entryPrice) * 100;
      capital += (currentPrice - entryPrice) * (capital / entryPrice);
      performance.push({ date: data[i].openTime, capital });
      console.log(`Exiting long position at ${currentPrice}, new capital: ${capital}`);
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
      capital += (entryPrice - currentPrice) * (capital / entryPrice);
      performance.push({ date: data[i].openTime, capital });
      console.log(`Exiting short position at ${currentPrice}, new capital: ${capital}`);
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

  const netProfit = capital - initialCapital;
  const netProfitPercent = (netProfit / initialCapital) * 100;
  const profitRatio = wins / losses;
  const averageTrade = netProfitPercent / trades;

  console.log('Backtest completed. Performance:');
  console.log(`Final Balance: $${capital.toFixed(2)}`);
  console.log(`Net Profit: $${netProfit.toFixed(2)} (${netProfitPercent.toFixed(2)}%)`);
  console.log(`Profit Ratio: ${profitRatio.toFixed(2)}`);
  console.log(`Total Closed Trades: ${trades}`);
  console.log(`Average Trade: ${averageTrade.toFixed(2)}%`);
}

// Define your backtest parameters
const symbol = 'BTCUSDT';
const interval = '1d';
const startTime = new Date('2020-01-01').getTime();
const endTime = new Date('2021-01-01').getTime();

backtest(symbol, interval, startTime, endTime);
