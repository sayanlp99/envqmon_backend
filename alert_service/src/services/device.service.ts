import Device from '../models/Device';

export class DeviceService {
    static async getUserIdByDeviceId(deviceId: string): Promise<string> {
        try {
            const response = await fetch(`${process.env.DEVICE_SERVICE_URL}/api/devices/${deviceId}`);
            if (!response.ok) {
                throw new Error(`Error fetching device: ${response.status} ${response.statusText}`);
            }
            const deviceData = await response.json() as Device;
            if (!deviceData || !deviceData.user_id) {
                throw new Error('User ID not found in device data');
            }
            return deviceData.user_id;
        } catch (error) {
            console.error('Error in getUserIdByDeviceId:', error);
            return '';
        }
    }
}