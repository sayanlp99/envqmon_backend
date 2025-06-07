import { sequelize } from "./config/database";
import app from "./app";
import { config } from "./config/env";

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // or .sync({ force: true }) for dev
    console.log("DB connected");

    app.listen(config.port, () => {
      console.log(`Auth service running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Unable to connect to DB:", error);
  }
};

start();
