import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { setupRoutes } from './BtInit';

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

setupRoutes(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
