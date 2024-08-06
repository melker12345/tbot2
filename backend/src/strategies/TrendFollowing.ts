import { sma, rsi, atr } from './Indicators';
import { calculateResults } from '../BtInit';

export const runTrendFollowingStrategy = (data: any[], settings: any, state: any) => {
  const { commission, slippage } = settings;

  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const fastMA = sma(closes, 9);
  const slowMA = sma(closes, 50);
  const rsiValues = rsi(closes, 14);
  const atrValues = atr(highs, lows, closes, 14);

  for (let i = Math.max(9, 50, 14, 14); i < closes.length; i++) {
    const currentPrice = closes[i];
    const fast = fastMA[i - 9];
    const slow = slowMA[i - 50];
    const rsi = rsiValues[i - 14];
    const atr = atrValues[i - 14];

    const longCondition = fast > slow && rsi < 70;
    const shortCondition = fast < slow && rsi > 30;

    if (state.position === 0) {
      if (longCondition) {
        state.position = 1;
        state.entryPrice = currentPrice;
      } else if (shortCondition) {
        state.position = -1;
        state.entryPrice = currentPrice;
      }
    }

    const longStopLoss = state.entryPrice - atr * 3;
    const longTakeProfit = state.entryPrice + atr * 6;
    const shortStopLoss = state.entryPrice + atr * 3;
    const shortTakeProfit = state.entryPrice - atr * 6;

    const tradeSize = state.capital * (parseFloat(settings.riskPerTrade) / 100);

    if (state.position === 1 && (currentPrice <= longStopLoss || currentPrice >= longTakeProfit)) {
      const percentChange = ((currentPrice - state.entryPrice) / state.entryPrice) * 100;
      state.capital += (currentPrice - state.entryPrice) * (tradeSize / state.entryPrice) * (1 - parseFloat(commission) / 100) - (tradeSize * parseFloat(slippage) / 100);
      state.performance.push({ date: data[i].openTime, capital: state.capital });
      state.trades++;
      if (percentChange > 0) {
        state.wins++;
        state.totalPercentGain += percentChange;
      } else {
        state.losses++;
        state.totalPercentLoss += percentChange;
      }
      state.position = 0;
    } else if (state.position === -1 && (currentPrice >= shortStopLoss || currentPrice <= shortTakeProfit)) {
      const percentChange = ((state.entryPrice - currentPrice) / state.entryPrice) * 100;
      state.capital += (state.entryPrice - currentPrice) * (tradeSize / state.entryPrice) * (1 - parseFloat(commission) / 100) - (tradeSize * parseFloat(slippage) / 100);
      state.performance.push({ date: data[i].openTime, capital: state.capital });
      state.trades++;
      if (percentChange > 0) {
        state.wins++;
        state.totalPercentGain += percentChange;
      } else {
        state.losses++;
        state.totalPercentLoss += percentChange;
      }
      state.position = 0;
    }
  }

  return calculateResults("Trend Following Strategy", state, settings);
};
