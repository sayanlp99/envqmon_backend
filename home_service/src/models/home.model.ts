import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

export class Home extends Model {}

Home.init({
  home_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  home_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  address: DataTypes.TEXT,
}, {
  sequelize,
  modelName: 'Home',
  tableName: 'homes',
  timestamps: true,
});
