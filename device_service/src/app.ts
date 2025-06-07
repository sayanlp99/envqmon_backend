import express from 'express';
import deviceRoutes from './routes/device.routes';

const app = express();

app.use(express.json());
app.use('/api/devices', deviceRoutes);

export default app;
