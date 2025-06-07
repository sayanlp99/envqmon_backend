import app from './app';
import sequelize from './config/database';
import './models';

const PORT = process.env.PORT || 3004;

sequelize.sync({ alter: true }).then(() => {
  console.log('DB synced');
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
