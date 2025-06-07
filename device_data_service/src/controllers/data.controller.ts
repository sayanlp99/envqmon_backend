import { Request, Response } from 'express';
import * as dataService from '../services/data.service';

export const getDataInRange = async (req: Request, res: Response): Promise<void> => {
  const { device_id, from, to } = req.query;
  if (!device_id || !from || !to) {
    res.status(400).json({ message: "device_id, from, to required" });
    return;
  }

  const data = await dataService.getDeviceDataInRange(device_id as string, from as string, to as string);
  res.json(data);
};

export const getLatestData = async (req: Request, res: Response): Promise<void> => {
  const { device_id } = req.params;
  const data = await dataService.getLatestDeviceData(device_id);
  if (!data) {
    res.status(404).json({ message: "No data found" });
    return;
  }
  res.json(data);
};
