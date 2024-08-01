import React, { useState } from 'react';
import SettingsForm, { Settings } from './SettingsForm';
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
      <div className="flex w-full space-x-4">
        <SettingsForm onChange={handleSettingsChange} onSubmit={handleSettingsSubmit} />
      </div>
        <div className="flex flex-col w-full items-center justify-center">
          <ResultsTable results={results} />
        </div>
      {loading && (
        <div className="w-full p-4 border items-center justify-center rounded-md">Loading...</div>
      )}
    </div>
  );
};

export default Dashboard;
