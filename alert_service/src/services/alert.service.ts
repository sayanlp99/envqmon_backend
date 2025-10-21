import User from '../models/User';
import Alert from '../models/Alert';
import { LIMITS } from '../config/limits.config';

export class AlertService {
  static async generateAlert(alertType: string, value: number, unit: string, timestamp: number, deviceTopic?: string, userId?: string): Promise<void> {
    await Alert.create({ alertType, value, unit, timestamp, deviceTopic, userId });
  }

  static checkLimits(data: any): { type: string; value: number; unit: string }[] {
    const violations: { type: string; value: number; unit: string }[] = [];

    // Temperature
    if (data.temperature < LIMITS.temperature.min || data.temperature > LIMITS.temperature.max) {
      violations.push({ type: `temperature_${data.temperature > LIMITS.temperature.max ? 'high' : 'low'}`, value: data.temperature, unit: '°C' });
    }

    // Humidity
    if (data.humidity < LIMITS.humidity.min || data.humidity > LIMITS.humidity.max) {
      violations.push({ type: `humidity_${data.humidity > LIMITS.humidity.max ? 'high' : 'low'}`, value: data.humidity, unit: '%' });
    }

    // Pressure
    if (data.pressure < LIMITS.pressure.min || data.pressure > LIMITS.pressure.max) {
      violations.push({ type: `pressure_${data.pressure > LIMITS.pressure.max ? 'high' : 'low'}`, value: data.pressure, unit: 'hPa' });
    }

    // CO
    if (data.co > LIMITS.co.max) {
      violations.push({ type: 'co_high', value: data.co, unit: 'ppm' });
    }

    // Methane
    if (data.methane > LIMITS.methane.max) {
      violations.push({ type: 'methane_high', value: data.methane, unit: 'ppm' });
    }

    // LPG
    if (data.lpg > LIMITS.lpg.max) {
      violations.push({ type: 'lpg_high', value: data.lpg, unit: 'ppm' });
    }

    // PM2.5
    if (data.pm25 > LIMITS.pm25.max) {
      violations.push({ type: 'pm25_high', value: data.pm25, unit: 'µg/m³' });
    }

    // PM10
    if (data.pm10 > LIMITS.pm10.max) {
      violations.push({ type: 'pm10_high', value: data.pm10, unit: 'µg/m³' });
    }

    // Noise
    if (data.noise > LIMITS.noise.max) {
      violations.push({ type: 'noise_high', value: data.noise, unit: 'dB' });
    }

    // Light
    if (data.light < LIMITS.light.min) {
      violations.push({ type: 'light_low', value: data.light, unit: 'lux' });
    }

    return violations;
  }

  static async getUserTokens(userId: string): Promise<string[]> {
    const users = await User.findAll({ where: { userId: userId }, attributes: ['fcmToken'] });
    return users.map((u: any) => u.fcmToken);
  }

  static async getAlertsByUser(userId: string): Promise<any[]> {
    // Assuming alerts are global for simplicity; filter by user
    return Alert.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }
}