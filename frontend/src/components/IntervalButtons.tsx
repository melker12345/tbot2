import React from 'react';

interface IntervalButtonsProps {
  onIntervalChange: (interval: string) => void;
}

const IntervalButtons: React.FC<IntervalButtonsProps> = ({ onIntervalChange }) => {
  const intervals = ['1min', '5min', '15min', '1h', '4h', '1d'];

  return (
    <div className="flex items-center justify-center p-2 space-x-2 border rounded-md">
      {intervals.map((interval) => (
        <button
          key={interval}
          onClick={() => onIntervalChange(interval)}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
        >
          {interval}
        </button>
      ))}
    </div>
  );
};

export default IntervalButtons;
