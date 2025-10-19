import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import routes from './routes';
import { connectDB } from './config/database.config';
import './services/mqtt.service'; 

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use('/api', routes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const startApp = async () => {
  await connectDB();
  app.listen(process.env.PORT || 3005, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
};

export default startApp;