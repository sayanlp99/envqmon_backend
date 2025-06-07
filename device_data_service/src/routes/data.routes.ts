import { Router } from 'express';
import { getDataInRange, getLatestData } from '../controllers/data.controller';

const router = Router();

router.get('/range', getDataInRange);
router.get('/latest/:device_id', getLatestData);

export default router;
