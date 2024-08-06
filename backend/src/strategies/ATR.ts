import { atr } from './Indicators';
import { calculateResults } from '../BtInit';

export const runATRStrategy = (data: any[], settings: any, state: any) => {
  console.log('Running ATR Strategy with settings:', settings);
  const { atrLength, atrMultiplier, commission, slippage } = settings;

  const closes = data.map(d => d.close);
  const highs = data.map(d => d.high);
  const lows = data.map(d => d.low);

  const atrValues = atr(highs, lows, closes, atrLength);

  for (let i = atrLength; i < closes.length; i++) {
    const currentPrice = closes[i];
    const currentATR = atrValues[i - atrLength];

    const longStopLoss = state.entryPrice - currentATR * atrMultiplier;
    const longTakeProfit = state.entryPrice + currentATR * atrMultiplier * 2;
    const shortStopLoss = state.entryPrice + currentATR * atrMultiplier;
    const shortTakeProfit = state.entryPrice - currentATR * atrMultiplier * 2;

    const tradeSize = state.capital * (parseFloat(settings.riskPerTrade) / 100);

    if (state.position === 0) {
      if (currentATR > atrMultiplier) {
        state.position = 1;
        state.entryPrice = currentPrice;
        console.log('Entering long position at price:', currentPrice);
      } else if (currentATR < atrMultiplier) {
        state.position = -1;
        state.entryPrice = currentPrice;
        console.log('Entering short position at price:', currentPrice);
      }
    }

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
      console.log('Exiting long position at price:', currentPrice);
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
      console.log('Exiting short position at price:', currentPrice);
      state.position = 0;
    }
  }

  return calculateResults("ATR Strategy", state, settings);
};
