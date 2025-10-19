import client from '../config/mqtt.config';
import { AlertService } from './alert.service';
import { FCMService } from './fcm.service';

client.on('message', async (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('Received MQTT data:', data);

    const violations = AlertService.checkLimits(data);

    for (const violation of violations) {
      await AlertService.generateAlert(violation.type, violation.value, violation.unit || '', data.recorded_at, topic);
      
      const tokens = await AlertService.getUserTokens();
      const title = `Alert: ${violation.type.replace('_', ' ').toUpperCase()}`;
      const body = `${violation.type}: ${violation.value}${violation.unit} at ${new Date(data.recorded_at * 1000).toISOString()}`;
      
      await FCMService.sendAlert(tokens, title, body);
    }
  } catch (error) {
    console.error('MQTT message processing error:', error);
  }
});