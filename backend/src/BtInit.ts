import { Express } from 'express';
import { Spot } from '@binance/connector-typescript';
import { runATRStrategy } from './strategies/ATR';
import { runMomentumStrategy } from './strategies/MomentumTrading';
import { runScalpingStrategy } from './strategies/Scalping';
import { runTrendFollowingStrategy } from './strategies/TrendFollowing';

const client = new Spot('pGiByzo9s21pycbqpErz5sFm5UlaqYHm8U80cj5X32cZNZck8vsTJFOdyjsvOeGi', '0Suu16JX7apOE372QYfLeliNpu6Ly5QMU9ThdXSDoGf0pwXIrpNft4eB08fnMvfJ');

const fetchAllHistoricalData = async (symbol: string, interval: any, lookBack: number) => {
  const limit = 1000;
  let allData: any[] = [];
  let endTime = Date.now();

  while (allData.length < lookBack) {
    const response = await client.uiklines(symbol, interval, { limit, endTime });
    const batchData = response;

    if (batchData.length === 0) break;

    const mappedData = batchData.map((candle: any) => ({
      openTime: candle[0],
      open: parseFloat(candle[1]),
      high: parseFloat(candle[2]),
      low: parseFloat(candle[3]),
      close: parseFloat(candle[4]),
      volume: parseFloat(candle[5]),
      closeTime: candle[6],
    }));

    allData = mappedData.concat(allData);
    endTime = mappedData[0].openTime - 1;
  }

  return allData.slice(0, lookBack);
};

const initializeBacktest = (initialEquity: number) => ({
  capital: initialEquity,
  position: 0,
  entryPrice: 0,
  performance: [],
  trades: 0,
  wins: 0,
  losses: 0,
  totalPercentGain: 0,
  totalPercentLoss: 0,
});

export const calculateResults = (strategyName: string, state: any, settings: any) => {
  const netProfit = state.capital - parseFloat(settings.initialEquity);
  const netProfitPercent = (netProfit / parseFloat(settings.initialEquity)) * 100;
  const profitRatio = state.losses > 0 ? state.wins / state.losses : 0;
  const averageTrade = state.trades > 0 ? netProfitPercent / state.trades : 0;

  return [
    { result: "Strategy", value: strategyName },
    { result: "Final Balance", value: state.capital.toFixed(2) },
    { result: "Net Profit", value: netProfit.toFixed(2) },
    { result: "Net Profit Percent (%)", value: netProfitPercent.toFixed(2) },
    { result: "Profit Ratio", value: profitRatio.toFixed(2) },
    { result: "Total Closed Trades", value: state.trades.toString() },
    { result: "Average Trade", value: averageTrade.toFixed(2) },
    { result: "Wins", value: state.wins.toString() },
    { result: "Losses", value: state.losses.toString() },
    { result: "Total Percent Gain (%)", value: state.totalPercentGain.toFixed(2) },
    { result: "Total Percent Loss (%)", value: state.totalPercentLoss.toFixed(2) },
    { result: "Commission (%)", value: (settings.commission * state.trades).toFixed(2) },
    { result: "Slippage (%)", value: settings.slippage.toString() },
    { result: "Initial Equity", value: settings.initialEquity },
    { result: "Risk Per Trade (%)", value: settings.riskPerTrade },
    { result: "Look Back", value: settings.lookBack },
    { result: "Pair", value: settings.pair },
    { result: "Interval", value: settings.interval },
  ];
};

const runBacktest = async (strategy: string, settings: any) => {
  const data = await fetchAllHistoricalData(settings.pair, settings.interval, parseInt(settings.lookBack, 10));
  if (!data.length) return [];

  const state = initializeBacktest(parseFloat(settings.initialEquity));

  switch (strategy) {
    case 'ATR':
      return runATRStrategy(data, settings, state);
    case 'Momentum Trading':
      return runMomentumStrategy(data, settings, state);
    case 'Scalping':
      return runScalpingStrategy(data, settings, state);
    case 'Trend Following':
      return runTrendFollowingStrategy(data, settings, state);
    default:
      throw new Error('Invalid strategy');
  }
};

export const setupRoutes = (app: Express) => {
  app.post('/run-backtest', async (req, res) => {
    const { strategy, settings } = req.body;

    try {
      const result = await runBacktest(strategy, settings);
      res.json(result);
    } catch (error) {
      res.status(400).send(error);
    }
  });
};
