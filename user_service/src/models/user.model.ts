import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export enum RoleType {
  user = 'user',
  admin = 'admin',
}

interface UserAttributes {
  user_id: string;
  name: string;
  email: string;
  password_hash: string;
  role: RoleType;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

type UserCreationAttributes = Optional<UserAttributes, 'user_id' | 'role' | 'is_active' | 'created_at' | 'updated_at'>;

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public user_id!: string;
  public name!: string;
  public email!: string;
  public password_hash!: string;
  public role!: RoleType;
  public is_active!: boolean;
  public created_at!: Date;
  public updated_at!: Date;
}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  }
);

export default User;
