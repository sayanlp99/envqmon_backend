import express from 'express';
import homeRoutes from './routes/home.routes';
import roomRoutes from './routes/room.routes';

const app = express();

app.use(express.json());
app.use('/api/homes', homeRoutes);
app.use('/api/rooms', roomRoutes);

export default app;
