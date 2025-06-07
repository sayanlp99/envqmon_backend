import { Request, Response } from 'express';
import * as homeService from '../services/home.service';

export const createHome = async (req: Request, res: Response) => {
  const home = await homeService.createHome(req.body);
  res.status(201).json(home);
};

export const getAllHomes = async (_req: Request, res: Response) => {
  const homes = await homeService.getAllHomes();
  res.json(homes);
};

export const getHomeById = async (req: Request, res: Response) => {
  const home = await homeService.getHomeById(req.params.id);
  res.json(home);
};

export const updateHome = async (req: Request, res: Response) => {
  const updated = await homeService.updateHome(req.params.id, req.body);
  res.json(updated);
};

export const deleteHome = async (req: Request, res: Response) => {
  await homeService.deleteHome(req.params.id);
  res.sendStatus(204);
};
