import React, { useState } from 'react';
import TradingViewChart from './TradingViewChart';

export interface Settings {
  initialEquity: string;
  riskPerTrade: string;
  riskCapitalPerTrade: string;
  lookBack: string;
  pair: string;
  interval: string;
  commission: string;
  slippage: string;
  pyramiding: string;
  stopLoss: string;
  takeProfit: string;
  shortMALength: string;
  longMALength: string;
  rsiLength: string;
  rsiOverbought: string;
  rsiOversold: string;
  atrLength: string;
  atrMultiplier: string;
}

interface SettingsFormProps {
  onChange: (settings: Settings) => void;
  onSubmit: (settings: Settings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onChange, onSubmit }) => {
  const [settings, setSettings] = useState<Settings>({
    initialEquity: '10000',
    riskPerTrade: '2',
    riskCapitalPerTrade: '0',
    lookBack: '1000',
    pair: 'BTCUSDC',
    interval: '1m',
    commission: '0.001',
    slippage: '1',
    pyramiding: '3',
    stopLoss: '2',
    takeProfit: '4',
    shortMALength: '9',
    longMALength: '50',
    rsiLength: '14',
    rsiOverbought: '70',
    rsiOversold: '30',
    atrLength: '14',
    atrMultiplier: '1.5'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prevSettings => ({
      ...prevSettings,
      [name]: value
    }));
    onChange({ ...settings, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  const generalSettings = [
    'initialEquity', 'riskPerTrade', 'riskCapitalPerTrade', 'lookBack', 'pair', 
    'interval', 'commission', 'slippage', 'pyramiding', 
  ];

  const strategySettings = [
    'stopLoss', 'takeProfit', 'shortMALength', 'longMALength', 'rsiLength', 
    'rsiOverbought', 'rsiOversold', 'atrLength', 'atrMultiplier'
  ];

  return (
    <>
    <div className="flex h-fit w-full border-b-2">
      <form className="flex flex-col w-fit  space-y-4 p-4 border-r" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">General Settings</h2>
        {generalSettings.map(key => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={(settings as any)[key]}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        ))}
      </form>
      
      <div className="flex flex-col w-full items-center p-4">
        < TradingViewChart pair={settings.pair} />
      </div>
      
      <form className="flex flex-col w-fit space-y-4 p-4 border-l" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">Strategy Settings</h2>
        {strategySettings.map(key => (
          <div key={key} className="flex flex-col">
            <label htmlFor={key} className="text-sm font-medium">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </label>
            <input
              type="text"
              id={key}
              name={key}
              value={(settings as any)[key]}
              onChange={handleChange}
              className="p-2 border rounded"
            />
          </div>
        ))}
      <div className="flex justify-center h-fit w-fit p-4">
        <button type="button" onClick={handleSubmit} className="p-2 bg-blue-500 text-white rounded">
          Submit
        </button>
      </div>
      </form>
    </div>
    </>
  );
};

export default SettingsForm;
