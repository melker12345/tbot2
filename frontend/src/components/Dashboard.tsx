import React, { useState } from 'react';
import Header from './Header';
import SettingsForm, { Settings } from './SettingsForm';
import TradingViewChart from './TradingViewChart';
import UploadForm from './UploadForm';
import ResultsTable from './ResultsTable';
import axios from 'axios';

const Dashboard: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    initialEquity: '',
    riskPerTrade: '',
    riskCapitalPerTrade: '',
    lookBack: '',
    pair: 'BTCUSDT',
    interval: '1',
    monteCarlo: false,
    commission: '',
    slippage: '',
    pyramiding: '',
    apiKey: '',
    apiSecret: ''
  });
  const [results, setResults] = useState<Array<{ result: string; value: string }>>([]);
  const [script, setScript] = useState<string>('');

  const handleSettingsChange = (newSettings: Settings) => {
    setSettings(newSettings);
  };

  const handleSettingsSubmit = async (settings: Settings) => {
    try {
      console.log('Submitting settings:', settings, script);
      
      const response = await axios.post('http://localhost:3000/backtest', { settings, script });
      setResults(response.data.results);
    } catch (error) {
      console.error('Error submitting settings', error);
    }
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/backtest', formData);
      setResults(response.data.results);
      setScript(response.data.fileContent); // Update script from file upload
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleScriptChange = (script: string) => {
    setScript(script);
  };

  return (
    <div className="flex flex-col items-center w-full min-h-screen p-4 space-y-4">
      <Header />
      <div className="flex w-full space-x-4">
        <SettingsForm onChange={handleSettingsChange} onSubmit={handleSettingsSubmit} />
        <TradingViewChart pair={settings.pair} />
        <UploadForm onFileUpload={handleFileUpload} onScriptChange={handleScriptChange} />
      </div>
      <ResultsTable results={results} />
    </div>
  );
};

export default Dashboard;
