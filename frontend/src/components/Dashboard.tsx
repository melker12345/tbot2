import { useState } from 'react';
import SettingsForm from './SettingsForm';
import ResultsTable from './ResultsTable';
import ChartDisplay from './TradingViewChart';

const Dashboard = () => {
  const [results, setResults] = useState<any[]>([]);

  const handleFormSubmit = async (strategy: string, settings: any) => {
    try {
      const response = await fetch('http://localhost:3000/run-backtest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ strategy, settings }),
      });

      if (response.ok) {
        const data = await response.json();
        setResults(data);
      } else {
        console.error('Failed to run backtest');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='max-w-full'>
      <h1 className='w-full text-center text-3xl py-4'>Backtest Dashboard</h1>
      <div className='w-full flex flex-row justify-center p-8'>
        <SettingsForm onSubmit={handleFormSubmit} />
        <ChartDisplay pair='BTCUSDC' />
      </div>
      <ResultsTable results={results} />
    </div>
  );
};

export default Dashboard;
