import sequelize from '../config/database';
import { Home } from './home.model';
import { Room } from './room.model';

Home.hasMany(Room, { foreignKey: 'home_id' });
Room.belongsTo(Home, { foreignKey: 'home_id' });

export { sequelize, Home, Room };
