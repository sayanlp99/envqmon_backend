import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/register', UserController.registerOrUpdateDevice);
router.delete('/:userId', UserController.deleteDevice);

export default router;