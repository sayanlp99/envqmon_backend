import app from './app';
import { sequelize } from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3002;

const start = async () => {
  try {
    await sequelize.sync(); // Use sync({ force: true }) if you want to reset
    app.listen(PORT, () => {
      console.log(`Device service running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error starting server:', err);
  }
};

start();
