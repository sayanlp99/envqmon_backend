import { Request, Response } from 'express';
import User from '../models/User';

export class UserController {
  static async registerOrUpdateDevice(req: Request, res: Response): Promise<void> {
    try {
      const { userId, fcmToken } = req.body;
      if (!userId || !fcmToken) {
        res.status(400).json({ error: 'userId and fcmToken required' });
        return;
      }

      const [user, created] = await User.findOrCreate({
        where: { userId },
        defaults: { userId, fcmToken, updatedAt: new Date() },
      });

      if (!created) {
        await user.update({ fcmToken, updatedAt: new Date() });
      }

      const status = created ? 201 : 200;
      const message = created ? 'Device registered successfully' : 'Device token updated successfully';
      res.status(status).json({ message });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete
  static async deleteDevice(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.params;
      const deleted = await User.destroy({ where: { userId } });
      if (deleted === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'Device deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}