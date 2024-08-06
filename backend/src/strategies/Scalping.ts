import { calculateResults } from '../BtInit';

export const runScalpingStrategy = (data: any[], settings: any, state: any) => {
  const { commission, slippage } = settings;

  const closes = data.map(d => d.close);

  for (let i = 1; i < closes.length; i++) {
    const currentPrice = closes[i];
    const previousPrice = closes[i - 1];

    const longCondition = currentPrice > previousPrice;
    const shortCondition = currentPrice < previousPrice;

    const tradeSize = state.capital * (parseFloat(settings.riskPerTrade) / 100);

    if (state.position === 0) {
      if (longCondition) {
        state.position = 1;
        state.entryPrice = currentPrice;
      } else if (shortCondition) {
        state.position = -1;
        state.entryPrice = currentPrice;
      }
    }

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

  return calculateResults("Scalping Strategy", state, settings);
};
