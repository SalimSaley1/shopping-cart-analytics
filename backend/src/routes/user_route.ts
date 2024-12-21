import express from 'express';
import {AuthController} from '../controllers/user_controller';

const router = express.Router();
const autController = new AuthController();

router.post('/login',autController.login);
router.post('/signup', autController.signup);

export default router;
