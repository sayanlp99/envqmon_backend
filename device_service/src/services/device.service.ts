import Device from '../models/device.model';

export const addDevice = async (data: any) => {
  return await Device.create(data);
};

export const listDevices = async () => {
  return await Device.findAll();
};

export const getDeviceById = async (id: string) => {
  return await Device.findByPk(id);
};

export const editDevice = async (id: string, data: any) => {
  const device = await Device.findByPk(id);
  if (!device) throw new Error('Device not found');
  await device.update(data);
  return device;
};

export const deleteDevice = async (id: string) => {
  const device = await Device.findByPk(id);
  if (!device) throw new Error('Device not found');
  await device.destroy();
};
