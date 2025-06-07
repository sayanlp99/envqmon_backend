import express from 'express';
import sequelize from './config/database';
import userRoutes from './routes/user.routes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use('/api/users', userRoutes);

async function start() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    await sequelize.sync(); 
    app.listen(PORT, () => {
      console.log(`User service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to DB:', err);
  }
}

start();
