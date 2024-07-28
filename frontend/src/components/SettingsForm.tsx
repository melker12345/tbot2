import React, { useState } from 'react';

export interface Settings {
  initialEquity: string;
  riskPerTrade: string;
  riskCapitalPerTrade: string;
  lookBack: string;
  pair: string;
  interval: string;
  monteCarlo: boolean;
  commission: string;
  slippage: string;
  pyramiding: string;
  apiKey: string;
  apiSecret: string;
}

interface SettingsFormProps {
  onChange: (settings: Settings) => void;
  onSubmit: (settings: Settings) => void;
}

const SettingsForm: React.FC<SettingsFormProps> = ({ onChange, onSubmit }) => {
  const [settings, setSettings] = useState<Settings>({
    initialEquity: '',
    riskPerTrade: '',
    riskCapitalPerTrade: '',
    lookBack: '',
    pair: '',
    interval: '1',
    monteCarlo: false,
    commission: '',
    slippage: '',
    pyramiding: '',
    apiKey: '',
    apiSecret: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type, checked } = e.target as any;
    const newSettings = {
      ...settings,
      [id]: type === 'checkbox' ? checked : value,
    };
    setSettings(newSettings);
    onChange(newSettings);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/3 p-4 space-y-4 border rounded-md">
      {[
        { id: 'initialEquity', label: 'Initial Equity', placeholder: 'Initial Equity' },
        { id: 'riskPerTrade', label: 'Risk per Trade (%)', placeholder: 'Risk per Trade' },
        { id: 'riskCapitalPerTrade', label: 'Risk of Capital per Trade (%)', placeholder: 'Risk of Capital per Trade' },
        { id: 'lookBack', label: 'Look Back (candles)', placeholder: 'Look Back' },
        { id: 'pair', label: 'Pair', placeholder: 'Pair' },
        { id: 'commission', label: 'Commission (%)', placeholder: 'Commission' },
        { id: 'slippage', label: 'Slippage (%)', placeholder: 'Slippage' },
        { id: 'Pyramiding', label: 'Pyramiding:', placeholder: 'Pyramiding' },
        { id: 'apiKey', label: 'Binance API Key', placeholder: 'API Key' },
        { id: 'apiSecret', label: 'Binance API Secret', placeholder: 'API Secret' },
      ].map(({ id, label, placeholder }) => (
        <div key={id}>
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor={id}>
            {label}
          </label>
          <input
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            id={id}
            value={settings[id as keyof Settings] as any}
            onChange={handleChange}
            placeholder={placeholder}
            type={id === 'apiSecret' ? 'password' : 'text'}
          />
        </div>
      ))}
      <div>
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="interval">
          Interval
        </label>
        <select
          id="interval"
          value={settings.interval}
          onChange={handleChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="1">1min</option>
          <option value="5">5min</option>
          <option value="15">15min</option>
          <option value="60">1h</option>
          <option value="240">4h</option>
          <option value="1440">1d</option>
        </select>
      </div>
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="monteCarlo"
          checked={settings.monteCarlo}
          onChange={handleChange}
          className="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        />
        <label
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          htmlFor="monteCarlo"
        >
          Monte Carlo
        </label>
      </div>
      <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
        Submit
      </button>
    </form>
  );
};

export default SettingsForm;
