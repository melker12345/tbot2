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
