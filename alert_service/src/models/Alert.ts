import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface IAlertAttributes {
  id?: number;
  alertType: string;
  value: number;
  unit?: string;
  timestamp: number;
  deviceTopic?: string;
  userId?: string;
  createdAt?: Date;
}

export interface IAlert extends IAlertAttributes {}

interface IAlertCreationAttributes extends Optional<IAlertAttributes, 'id' | 'createdAt'> {}

class Alert extends Model<IAlert, IAlertCreationAttributes> {}

Alert.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    alertType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    unit: {
      type: DataTypes.STRING,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    deviceTopic: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Alert',
    tableName: 'alerts',
  }
);

export default Alert;