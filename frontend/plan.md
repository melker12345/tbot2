1. Purpose and Functionality:
        - What is the primary purpose of the application? (e.g., e-commerce, analytics dashboard)
            TO craete a web application that allows users to input backtesting settings and strategy for trading bot. 
        - What are the core functionalities that the frontend should support?
            - Input and save backtesting settings
            - Display backtesting results
            
2. User Interaction and Experience:
    -Who are the target users of the application?
        anyone who wants to backtest a trading strategy.
    -What key actions should users be able to perform on the frontend?
        - Input backtesting settings and strategy strategy is writen in ts
        - Save settings
        - View backtesting results
    -How do you envision the user journey from start to finish on the site?
        - User lands on the site
        - User inputs backtesting settings
        - User saves settings
        - User views backtesting results

3. Design and Responsiveness:
    - Do you have specific design preferences or themes for the application (e.g., color schemes, layout styles)?
        Not any ralsy it should be modern and clean and using tailwind css
    - How should the application behave on different devices (mobile, tablet, desktop)?
        - Mobile: responsive design that adjusts to smaller screens
        - Tablet: responsive design that adjusts to medium-sized screens
        - Desktop: responsive design that adjusts to larger screens

4. Components and Structure:
    - Based on the filenames you've shared, it seems you have components like Dashboard, Header, SettingsForm, etc. Could you describe the role of each of these components in the application?
        - Dashboard: main view that displays that binds all the components together
        - SettingsForm: form component that allows users to input backtesting settings
        - ResultsTable: table component that displays backtesting results
        - UploadForam: form component that allows users to upload a strategy file or paste code

    - How do these components interact with each other? (e.g., data flow, state management)
        - all of them are children of the dashboard component and the dashboard component manages the state of the application
        
5. Technical Requirements:
    - Are there specific technologies or libraries (beyond React and Express) that you plan to use or want to explore?
        - Tailwind CSS for styling
        - axios for making HTTP requests
    - How should the frontend communicate with the backend? Are there specific API requirements?
        - The frontend should sent the settings and strategy to the backend to be processed and then the backend should send the results back to the frontend
        - we need a claver way to handle the strategy and settings to the backend. The goal is that the user writes the parameters for a trading bot and the best way/simpliest way to do this is to write the strategy in typescript and then send the file to the backend. but maybe we should have pre coded strategies that the user can select from and change settings. essentially i want the user to be able to configure the strategy on the front end then send it to the backend to be processed. 

6. External Integrations:
    - Are you planning to integrate any third-party services or APIs? If so, which ones and for what purposes?
        - No

7. Performance and Optimization:
    -What are your expectations regarding the application's performance?
        - The application should be fast and responsive
    -Are there specific performance metrics or benchmarks you aim to meet?
        - None


---


Lets start by getting the user coded ts strategy to work with the backend to later integrate precoded strategies and have some of the more basic configurations of a trading 
strategy as a select option.

NOW:
The user should be able to write a strategy in typescript and then send it to the backend to be processed.

LATER:
The user should be able to select a pre coded strategy and then configure the settings for that strategy.
The user should have the option to select some of the more basic indecators and settings for a trading strategy.




# Plan
- Allow user to select strategy and cosomize settings
- Allow user to write their own strategy in typescript
- Send strategy to backend to be processed
- Display results
- Store results in local storage
- Allow user to download results
- Expand the strategy options to include more pre coded strategies and basic settings
- Expand the profit metrics to include more metrics like sharpe ratio, max drawdown, sortino ratio, max drawdown duration, etc.
- 




---


User Settings for Trading Bot

    Initial Settings
        Initial Equity: The starting amount of money for the trading bot.
        Risk per Trade (%): The percentage of equity to risk on each trade.
        Risk Capital per Trade: The maximum amount of capital to risk on each trade.
        Look Back Period: The amount of historical data (in candles) to use for backtesting.
        Trading Pair: The currency pair to trade (e.g., BTC/USD, ETH/USD).
        Time Interval: The time frame for each candle (e.g., 1m, 5m, 1h, 1d).
        Commission (%): The commission rate charged by the exchange.
        Slippage: The amount of slippage to account for in trading.
        Pyramiding: The number of additional positions allowed in the direction of the current position.
        Stop Loss (%): The percentage at which to stop a loss.
        Take Profit (%): The percentage at which to take a profit.

    Technical Indicators
        Moving Average Lengths: The periods for short and long moving averages.
        RSI Length: The period for calculating the Relative Strength Index.
        RSI Overbought Level: The RSI level indicating overbought conditions.
        RSI Oversold Level: The RSI level indicating oversold conditions.
        ATR Length: The period for calculating the Average True Range.
        ATR Multiplier: The multiplier used with ATR for setting stop loss and take profit levels.

    Trade Execution Settings
        Order Types: Types of orders to use (market, limit).
        Max Open Trades: The maximum number of open trades at any given time.
        Trading Hours: Specific hours during which the bot is allowed to trade.

Performance Metrics

    Balance and Profitability
        Final Balance: The ending balance after the backtesting period.
        Net Profit: The total profit or loss in monetary terms.
        Net Profit (%): The total profit or loss as a percentage of the initial equity.
        Gross Profit: The total profit before deducting losses.
        Gross Loss: The total losses before deducting profits.
        Profit Factor: The ratio of gross profit to gross loss.

    Risk Metrics
        Max Drawdown: The maximum observed loss from a peak to a trough of a portfolio, before a new peak is attained.
        Max Drawdown (%): The maximum drawdown as a percentage of the portfolio.
        Sharpe Ratio: The average return earned in excess of the risk-free rate per unit of volatility.
        Sortino Ratio: The risk-adjusted return of the investment, penalizing only downside volatility.
        Risk-Reward Ratio: The ratio between the average profit per trade and the average loss per trade.

    Trade Statistics
        Total Trades: The total number of trades executed.
        Winning Trades: The number of trades that ended in profit.
        Losing Trades: The number of trades that ended in loss.
        Win Rate (%): The percentage of trades that were profitable.
        Loss Rate (%): The percentage of trades that were not profitable.
        Average Trade (%): The average percentage gain or loss per trade.
        Largest Win: The largest single trade profit.
        Largest Loss: The largest single trade loss.

    Performance over Time
        Monthly Returns: The returns of the bot on a monthly basis.
        Daily Returns: The returns of the bot on a daily basis.
        Equity Curve: The graphical representation of the portfolio balance over time.

    Execution Metrics
        Order Execution Speed: The average time taken to execute orders.
        Slippage Experienced: The average slippage experienced per trade.
        Commission Paid: The total commission paid over the period.

    
