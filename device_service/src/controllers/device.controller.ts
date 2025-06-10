import { Request, Response } from 'express';
import Device from '../models/device.model';

export const createDevice = async (req: Request, res: Response): Promise<void> => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create device', error: err });
  }
};

export const getAllDevices = async (_req: Request, res: Response): Promise<void> => {
  const devices = await Device.findAll();
  res.json(devices);
};

export const getUserDevices = async (_req: Request, res: Response): Promise<void> => {
  const userId = _req.params.user_id as string;
  if (!userId) {
    res.status(400).json({ message: 'User ID is required' });
    return;
  }
  const devices = await Device.findAll({ where: { user_id: userId } });
  if (devices.length === 0) {
    res.status(404).json({ message: 'No devices found for this user' });
  } else {
    res.json(devices);
  }
};

export const getDeviceById = async (req: Request, res: Response): Promise<void> => {
  const device = await Device.findByPk(req.params.id);
  if (!device) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json(device);
  }
};

export const updateDevice = async (req: Request, res: Response): Promise<void> => {
  const [count] = await Device.update(req.body, { where: { device_id: req.params.id } });
  if (count === 0) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json({ message: 'Updated' });
  }
};

export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
  const count = await Device.destroy({ where: { device_id: req.params.id } });
  if (count === 0) {
    res.status(404).json({ message: 'Not found' });
  } else {
    res.json({ message: 'Deleted' });
  }
};
