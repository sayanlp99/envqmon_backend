import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class Device extends Model {}

Device.init({
  device_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4
  },
  device_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  device_imei: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'Device',
  tableName: 'devices',
  timestamps: true
});

export default Device;
