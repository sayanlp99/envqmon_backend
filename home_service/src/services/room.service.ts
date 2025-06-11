import { Room } from '../models/room.model';

export const createRoom = (data: any) => Room.create(data);
export const getAllRooms = () => Room.findAll();
export const getUserRooms = (userId: string) => Room.findAll({ where: { user_id: userId } });
export const getRoomById = (id: string) => Room.findByPk(id);
export const getRoomsByHomeId = (home_id: string) => Room.findAll({ where: { home_id } });
export const updateRoom = (id: string, data: any) => Room.update(data, { where: { room_id: id } });
export const deleteRoom = (id: string) => Room.destroy({ where: { room_id: id } });
