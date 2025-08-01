import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: 5432,
  database: process.env.DB_NAME || 'home_db',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'postgres',
  logging: false,
});

export default sequelize;
