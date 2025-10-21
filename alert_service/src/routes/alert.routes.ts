import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';

const router = Router();

router.get('/', AlertController.getAlerts);
router.get('/:userId', AlertController.getAlertsByUser);
router.delete('/:id', AlertController.deleteAlert);

export default router;