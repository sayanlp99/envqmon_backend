import { Request, Response } from 'express';
import * as roomService from '../services/room.service';

export const createRoom = async (req: Request, res: Response) => {
  const room = await roomService.createRoom(req.body);
  res.status(201).json(room);
};

export const getAllRooms = async (_req: Request, res: Response) => {
  const rooms = await roomService.getAllRooms();
  res.json(rooms);
};

export const getUserRooms = async (req: Request, res: Response) => {
  const userId = req.params.user_id;
  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const rooms = await roomService.getUserRooms(userId);
  if (rooms.length === 0) {
    res.status(404).json({ message: 'No rooms found for this user' });
  } else {
    res.json(rooms);
  }
};

export const getRoomById = async (req: Request, res: Response) => {
  const room = await roomService.getRoomById(req.params.id);
  res.json(room);
};

export const getRoomsByHomeId = async (req: Request, res: Response) => {
  const rooms = await roomService.getRoomsByHomeId(req.params.home_id);
  res.json(rooms);
};

export const updateRoom = async (req: Request, res: Response) => {
  const updated = await roomService.updateRoom(req.params.id, req.body);
  res.json(updated);
};

export const deleteRoom = async (req: Request, res: Response) => {
  await roomService.deleteRoom(req.params.id);
  res.sendStatus(204);
};
