import { Router } from 'express';
import userRoutes from './user.routes';
import alertRoutes from './alert.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/alerts', alertRoutes);

export default router;