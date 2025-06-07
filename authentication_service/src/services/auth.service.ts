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
