import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { addNewUserToDatabaseOnRegister } from './controllers/newuser';

const bodyParser = require('body-parser');
const cors = require('cors');
dotenv.config();

const port = process.env.PORT || 80;

const app = express();
app.use(
  cors({
    origin: '*',
  }),
);
app.use(bodyParser.json());

app.get('/health', (req: Request, res: Response) => {
  const healthcheck: any = {
    resource: 'Techno Auth0 Actions Server',
    uptime: process.uptime(),
    responseTime: process.hrtime(),
    message: 'OK',
    timestamp: Date.now(),
  };
  try {
    res.send(healthcheck);
  } catch (error) {
    healthcheck.message = error;
    res.status(503).send();
  }
});

app.post('/api/auth/newuser', addNewUserToDatabaseOnRegister);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
