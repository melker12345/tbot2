import { SMA, ATR } from 'technicalindicators';

// Strategy Configuration
interface StrategyConfig {
  smaLength: number;
  atrLength: number;
  ubOffset: number;
  lbOffset: number;
  initialCapital: number;
  commission: number;
  slippage: number;
}

const config: StrategyConfig = {
  smaLength: 350,
  atrLength: 20,
  ubOffset: 7,
  lbOffset: 3,
  initialCapital: 100000,
  commission: 0.001,
  slippage: 2
};

// Function to calculate the SMA
const calculateSMA = (prices: number[], length: number): number[] => {
  return SMA.calculate({ period: length, values: prices });
};

// Function to calculate the ATR
const calculateATR = (highs: number[], lows: number[], closes: number[], length: number): number[] => {
  return ATR.calculate({ period: length, high: highs, low: lows, close: closes });
};

// Function to calculate strategy signals
const atrChannelBreakout = (data: { close: number[], high: number[], low: number[] }) => {
  const { smaLength, atrLength, ubOffset, lbOffset } = config;

  const sma = calculateSMA(data.close, smaLength);
  const atr = calculateATR(data.high, data.low, data.close, atrLength);

  const upperBand = sma.map((value, index) => value + (ubOffset * atr[index]));
  const lowerBand = sma.map((value, index) => value - (lbOffset * atr[index]));

  const signals: { long: boolean[], short: boolean[], close: boolean[] } = {
    long: [],
    short: [],
    close: []
  };

  for (let i = Math.max(smaLength, atrLength); i < data.close.length; i++) {
    const closePrice = data.close[i];
    const upper = upperBand[i];
    const lower = lowerBand[i];
    const smaValue = sma[i];

    const longCondition = closePrice > upper;
    const shortCondition = closePrice < lower;
    const exitCondition = closePrice < smaValue;

    signals.long.push(longCondition);
    signals.short.push(shortCondition);
    signals.close.push(exitCondition);
  }

  return signals;
};

export default atrChannelBreakout;
