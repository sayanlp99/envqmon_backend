import { Router } from 'express';
import * as controller from '../controllers/home.controller';

const router = Router();

router.post('/', controller.createHome);
router.get('/', controller.getAllHomes);
router.get('/user/:user_id', controller.getUserHomes);
router.get('/:id', controller.getHomeById);
router.put('/:id', controller.updateHome);
router.delete('/:id', controller.deleteHome);

export default router;
