import React, { useEffect, useRef } from 'react';

interface TradingViewChartProps {
  pair: string;
}

const ChartDisplay: React.FC<TradingViewChartProps> = ({ pair }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);

  useEffect(() => {
    if (containerRef.current) {
      if (widgetRef.current) {
        widgetRef.current.remove();
      }

      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        widgetRef.current = new (window as any).TradingView.widget({
          container_id: containerRef.current!.id,
          autosize: true,
          symbol: pair,
          timezone: 'Etc/UTC',
          theme: 'light',
          style: '1',
          locale: 'en',
          toolbar_bg: '#f1f3f6',
          enable_publishing: false,
          allow_symbol_change: true,
          details: false,
          hotlist: false,
          calendar: true,
          news: ['headlines'],
          withdateranges: true,
          hide_side_toolbar: false,
          save_image: false,
        });
      };

      containerRef.current.appendChild(script);
    }
  }, [pair]);

  return (
    <div id="tradingview-widget" ref={containerRef} className="tradingview-widget-container w-3/4 h-[700px]" ></div>
  );
};

export default ChartDisplay;
