import { Sequelize } from "sequelize";
import { config } from "./env";

export const sequelize = new Sequelize({
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.database,
  dialect: "postgres",
  logging: false,
});
