import User, { RoleType } from '../models/user.model';

interface CreateUserDTO {
  name: string;
  email: string;
  password_hash: string;
  role?: RoleType;
}

export const createUser = async (data: CreateUserDTO) => {
  return await User.create(data);
};

export const getUserByEmail = async (email: string) => {
  return await User.findOne({ where: { email } });
};

export const getUserById = async (user_id: string) => {
  return await User.findByPk(user_id);
};

export const getAllUsers = async () => {
  return await User.findAll();
};

export const updateUser = async (user_id: string, data: Partial<CreateUserDTO>) => {
  const user = await User.findByPk(user_id);
  if (!user) return null;
  return await user.update(data);
};

export const deleteUser = async (user_id: string) => {
  const user = await User.findByPk(user_id);
  if (!user) return null;
  await user.destroy();
  return true;
};
