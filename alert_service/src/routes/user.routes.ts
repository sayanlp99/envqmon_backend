import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.post('/register', UserController.registerDevice);
router.put('/update', UserController.updateToken);
router.delete('/:userId', UserController.deleteDevice);

export default router;