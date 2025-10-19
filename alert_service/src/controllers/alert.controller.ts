import { Request, Response } from 'express';
import Alert from '../models/Alert';
import { AlertService } from '../services/alert.service';

export class AlertController {
  static async getAlerts(req: Request, res: Response): Promise<void> {
    try {
      const { userId } = req.query;
      const alerts = await AlertService.getAlertsByUser(userId as string);
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Additional CRUD: Get all alerts (admin)
  static async getAllAlerts(req: Request, res: Response): Promise<void> {
    try {
      const alerts = await Alert.findAll({ order: [['createdAt', 'DESC']] });
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // Delete alert
  static async deleteAlert(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await Alert.destroy({ where: { id: parseInt(id, 10) } });
      if (deleted === 0) {
        res.status(404).json({ error: 'Alert not found' });
        return;
      }
      res.json({ message: 'Alert deleted' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}