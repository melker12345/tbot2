import express from 'express';
import cors from 'cors';
import { backtest, StrategySettings } from './backtest';

const app = express();
const port = 3000;

// Enable CORS for only the frontend origin
app.use(cors({
    origin: 'http://localhost:5173'  // Ensures only requests from this origin are allowed
}));

app.use(express.json()); // This middleware is necessary to parse JSON bodies

app.post('/backtest', async (req, res) => {  // Changed from app.get to app.post
    const { settings, script } = req.body;  // Ensure these names match the client's JSON structure

    console.log('Received strategy code:', script);
    console.log('Received settings:', settings);
        
    try {
        const result = await backtest(script, settings);
        res.json(result);
    } catch (error) {
        console.error('Error in backtest endpoint:', error);
        res.status(500).json({ error: 'Failed to perform backtest' });
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
