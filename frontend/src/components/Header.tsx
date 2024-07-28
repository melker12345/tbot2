import React, { useState } from 'react';
import '../index.css';

const Header: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('trading-bot');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <header className="flex items-center justify-between w-full mx-auto bg-gray-100 px-4 py-3 shadow-sm sm:px-6">
        <nav className="flex items-center gap-4 justify-center py-2 px-6 mx-auto w-fit bg-gray-200 rounded-xl">
          <div
            dir="ltr"
            data-orientation="horizontal"
            className="flex justify-center align-center mx-auto"
          >
            <div
              role="tablist"
              aria-orientation="horizontal"
              className="inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground"
              tabIndex={-1}
              data-orientation="horizontal"
              style={{ outline: 'none' }}
            >
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'trading-bot'}
                aria-controls="radix-trading-bot-content"
                data-state={activeTab === 'trading-bot' ? 'active' : 'inactive'}
                id="radix-trading-bot-trigger"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-base font-medium transition-all  ${
                  activeTab === 'trading-bot' ? 'bg-gray-300' : ''
                }`}
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabChange('trading-bot')}
              >
                Trading Bot
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'back-test'}
                aria-controls="radix-back-test-content"
                data-state={activeTab === 'back-test' ? 'active' : 'inactive'}
                id="radix-back-test-trigger"
                className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-base font-medium transition-all ${
                  activeTab === 'back-test' ? 'bg-gray-300' : ''
                }`}
                tabIndex={-1}
                data-orientation="horizontal"
                data-radix-collection-item=""
                onClick={() => handleTabChange('back-test')}
              >
                Back Test
              </button>
            </div>
            <div
              data-state={activeTab === 'trading-bot' ? 'active' : 'inactive'}
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-trading-bot-trigger"
              id="radix-trading-bot-content"
              tabIndex={0}
              className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'trading-bot' ? '' : 'hidden'
              }`}
              style={{ animationDuration: '0s' }}
            >
              <div className="sr-only">Trading Bot</div>
            </div>
            <div
              data-state={activeTab === 'back-test' ? 'active' : 'inactive'}
              data-orientation="horizontal"
              role="tabpanel"
              aria-labelledby="radix-back-test-trigger"
              id="radix-back-test-content"
              tabIndex={0}
              className={`mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                activeTab === 'back-test' ? '' : 'hidden'
              }`}
            ></div>
          </div>
        </nav>
      </header>

      {activeTab === 'trading-bot' ? <h1 className='w-full my-4 text-3xl font-semibold text-center'>Trading Bot</h1> : <h1 className='w-full my-4 text-3xl font-semibold text-center'>Back Test</h1>}
    </>
  );
};

export default Header;
