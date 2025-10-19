import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.DB_URI!, {
  dialect: 'postgres',
  logging: false, // Set to console.log for query logging
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected successfully');
    await sequelize.sync({ alter: true }); // For development; use migrations in production
  } catch (error) {
    console.error('PostgreSQL connection error:', error);
    process.exit(1);
  }
};

export { sequelize, connectDB };