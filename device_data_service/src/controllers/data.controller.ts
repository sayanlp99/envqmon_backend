import { Request, Response } from 'express';
import * as dataService from '../services/data.service';

export const getDataInRange = async (req: Request, res: Response): Promise<void> => {
  const { device_id, from_ts, to_ts } = req.query;
  if (!device_id || !from_ts || !to_ts) {
    res.status(400).json({ message: "device_id, from, to required" });
    return;
  }

  const data = await dataService.getDeviceDataInRange(device_id as string, from_ts as string, to_ts as string);
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
