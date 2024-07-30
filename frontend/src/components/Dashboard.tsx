import React, { useState } from 'react';
import Header from './Header';
import SettingsForm, { Settings } from './SettingsForm';
import TradingViewChart from './TradingViewChart';
import ResultsTable from './ResultsTable';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    initialEquity: '10000',
    riskPerTrade: '2',
    riskCapitalPerTrade: '0',
    lookBack: '1000',
    pair: 'BTCUSDC',
    interval: '1m',
    commission: '0.001',
    slippage: '1',
    pyramiding: '3'
  });
  const [results, setResults] = useState<Array<{ result: string; value: string }>>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleSettingsSubmit = async (settings: Settings) => {
    setLoading(true);
    try {
      console.log('Submitting settings:', settings);
      const response = await axios.post('http://localhost:3000/backtest', settings);
      const resultsArray = response.data.results.map((item: { result: string; value: string }) => ({
        result: item.result,
        value: item.value
      }));
      setResults(resultsArray);
    } catch (error) {
      console.error('Error submitting settings', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 space-y-4">
      <Header />
      <div className="flex w-full space-x-4">
        <SettingsForm onChange={handleSettingsChange} onSubmit={handleSettingsSubmit} />
        <TradingViewChart pair={settings.pair} />
      </div>
      {loading ? (
        <div className="w-full p-4 border rounded-md">Loading...</div>
      ) : (
        <ResultsTable results={results} />
      )}
    </div>
  );
};

export default Dashboard;
