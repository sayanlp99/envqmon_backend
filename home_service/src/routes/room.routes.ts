import { Router } from 'express';
import * as controller from '../controllers/room.controller';

const router = Router();

router.post('/', controller.createRoom);
router.get('/', controller.getAllRooms);
router.get('/:id', controller.getRoomById);
router.get('/home/:home_id', controller.getRoomsByHomeId);
router.put('/:id', controller.updateRoom);
router.delete('/:id', controller.deleteRoom);

export default router;
