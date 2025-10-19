import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database.config';

interface IUserAttributes {
  userId: string;
  fcmToken: string;
  updatedAt?: Date;
}

export interface IUser extends IUserAttributes {}

interface IUserCreationAttributes extends Optional<IUserAttributes, 'updatedAt'> {}

class User extends Model<IUser, IUserCreationAttributes> {}

User.init(
  {
    userId: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    fcmToken: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
  }
);

export default User;