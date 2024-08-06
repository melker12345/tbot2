export const sma = (data: number[], length: number): number[] => {
  const result: number[] = [];
  for (let i = length - 1; i < data.length; i++) {
    const sum = data.slice(i - length + 1, i + 1).reduce((a, b) => a + b, 0);
    result.push(sum / length);
  }
  return result;
};

export const rsi = (data: number[], length: number): number[] => {
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
};

export const atr = (high: number[], low: number[], close: number[], length: number): number[] => {
  const result: number[] = [];
  for (let i = length; i < close.length; i++) {
    const tr: number[] = [];
    for (let j = i - length + 1; j <= i; j++) {
      tr.push(Math.max(high[j] - low[j], Math.abs(high[j] - close[j - 1]), Math.abs(low[j] - close[j - 1])));
    }
    result.push(tr.reduce((a, b) => a + b, 0) / length);
  }
  return result;
};
