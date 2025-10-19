import { Router } from 'express';
import { AlertController } from '../controllers/alert.controller';

const router = Router();

router.get('/', AlertController.getAlerts);
router.get('/all', AlertController.getAllAlerts);
router.delete('/:id', AlertController.deleteAlert);

export default router;