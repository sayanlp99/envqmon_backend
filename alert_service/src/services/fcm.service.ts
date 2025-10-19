import admin from '../config/fcm.config';

export class FCMService {
  static async sendAlert(tokens: string[], title: string, body: string): Promise<void> {
    if (tokens.length === 0) return;

    const message = {
      notification: {
        title,
        body,
      },
      tokens,
    };

    try {
      await admin.messaging().sendMulticast(message);
      console.log('FCM alerts sent successfully');
    } catch (error) {
      console.error('FCM send error:', error);
    }
  }
}