import bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { generateToken } from "../utils/jwt";

export const register = async (name: string, email: string, password: string) => {
  const existing = await User.findOne({ where: { email } });
  if (existing) throw new Error("User already exists");

  const password_hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password_hash });
  return user;
};

export const login = async (email: string, password: string) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const valid = await bcrypt.compare(password, user.getDataValue("password_hash"));
  if (!valid) throw new Error("Invalid credentials");

  const token = generateToken({ user_id: user.getDataValue("user_id"), role: user.getDataValue("role") });
  return { token };
};

export const getAllUsers = async () => {
  const users = await User.findAll();
  return users.map(user => ({
    user_id: user.getDataValue("user_id"),
    name: user.getDataValue("name"),
    email: user.getDataValue("email"),
    role: user.getDataValue("role"),
    is_active: user.getDataValue("is_active"),
    created_at: user.getDataValue("created_at"),
    updated_at: user.getDataValue("updated_at"),
  }));
};

export const updateUser = async (id: string, name?: string, email?: string, password?: string, is_active?: boolean) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");

  if (email) {
    const existing = await User.findOne({ where: { email } });
    if (existing && existing.getDataValue("user_id") !== user.getDataValue("user_id")) {
      throw new Error("Email already in use");
    }
    user.setDataValue("email", email);
  }
  if (name) user.setDataValue("name", name);
  if (password) {
    const password_hash = await bcrypt.hash(password, 10);
    user.setDataValue("password_hash", password_hash);
  }
  if (is_active !== undefined) user.setDataValue("is_active", is_active);
  await user.save();
  return {
    user_id: user.getDataValue("user_id"),
    name: user.getDataValue("name"),
    email: user.getDataValue("email"),
    is_active: user.getDataValue("is_active"),
    created_at: user.getDataValue("created_at"),
    updated_at: user.getDataValue("updated_at"),
  };
};