import React, { useState } from 'react';

const strategies = [
  { name: 'ATR', value: 'ATR' },
  { name: 'Momentum Trading', value: 'Momentum Trading' },
  { name: 'Scalping', value: 'Scalping' },
  { name: 'Trend Following', value: 'Trend Following' },
];

const SettingsForm = ({ onSubmit }: { onSubmit: (strategy: string, settings: any) => void }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('ATR');
  const [settings, setSettings] = useState({});

  const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStrategy(e.target.value);
    setSettings({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedStrategy, settings);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto p-4 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Select Strategy:</label>
        <select
          value={selectedStrategy}
          onChange={handleStrategyChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {strategies.map((strategy) => (
            <option key={strategy.value} value={strategy.value}>
              {strategy.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add input fields for common and specific strategy settings */}
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Initial Equity:</label>
        <input
          name="initialEquity"
          type="number"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Risk Per Trade (%):</label>
        <input
          name="riskPerTrade"
          type="number"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Look Back:</label>
        <input
          name="lookBack"
          type="number"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Pair:</label>
        <input
          name="pair"
          type="text"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Interval:</label>
        <input
          name="interval"
          type="text"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Slippage (%):</label>
        <input
          name="slippage"
          type="number"
          onChange={handleInputChange}
          className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        />
      </div>

      {/* Add additional fields based on the selected strategy */}
      {selectedStrategy === 'ATR' && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ATR Length:</label>
            <input
              name="atrLength"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">ATR Multiplier:</label>
            <input
              name="atrMultiplier"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </>
      )}
      {selectedStrategy === 'Momentum Trading' && (
        <>
          {/* Add specific fields for Momentum Trading */}
        </>
      )}
      {selectedStrategy === 'Scalping' && (
        <>
          {/* Add specific fields for Scalping */}
        </>
      )}
      {selectedStrategy === 'Trend Following' && (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Fast Length:</label>
            <input
              name="fastLength"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Slow Length:</label>
            <input
              name="slowLength"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">RSI Length:</label>
            <input
              name="rsiLength"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">RSI Overbought:</label>
            <input
              name="rsiOverbought"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">RSI Oversold:</label>
            <input
              name="rsiOversold"
              type="number"
              onChange={handleInputChange}
              className="block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-2 px-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            />
          </div>
        </>
      )}

      <button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Run Strategy
      </button>
    </form>
  );
};

export default SettingsForm;
