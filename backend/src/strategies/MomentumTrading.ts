import { sma } from './Indicators';
import { calculateResults } from '../BtInit';

export const runMomentumStrategy = (data: any[], settings: any, state: any) => {
  const { commission, slippage } = settings;

  const closes = data.map(d => d.close);
  const fastMA = sma(closes, 10);
  const slowMA = sma(closes, 50);

  for (let i = Math.max(10, 50); i < closes.length; i++) {
    const currentPrice = closes[i];
    const fast = fastMA[i - 10];
    const slow = slowMA[i - 50];

    const longCondition = fast > slow;
    const shortCondition = fast < slow;

    if (state.position === 0) {
      if (longCondition) {
        state.position = 1;
        state.entryPrice = currentPrice;
      } else if (shortCondition) {
        state.position = -1;
        state.entryPrice = currentPrice;
      }
    }

    const tradeSize = state.capital * (parseFloat(settings.riskPerTrade) / 100);

    if (state.position === 1 && !longCondition) {
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
    } else if (state.position === -1 && !shortCondition) {
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

  return calculateResults("Momentum Trading Strategy", state, settings);
};
