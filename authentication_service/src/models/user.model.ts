import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export enum RoleType {
  USER = "user",
  ADMIN = "admin",
}

export class User extends Model {}

User.init(
  {
    user_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      defaultValue: RoleType.USER,
      allowNull: false,
    },
    is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("now()"),
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal("now()"),
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: false,
  }
);
