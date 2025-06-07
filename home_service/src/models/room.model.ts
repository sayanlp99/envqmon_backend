import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';
import { Home } from './home.model';

export class Room extends Model {}

Room.init({
  room_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  room_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  home_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: DataTypes.STRING,
}, {
  sequelize,
  modelName: 'Room',
  tableName: 'rooms',
  timestamps: true,
});

Home.hasMany(Room, { foreignKey: 'home_id' });
Room.belongsTo(Home, { foreignKey: 'home_id' });
