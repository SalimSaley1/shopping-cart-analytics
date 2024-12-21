import express from "express";
import {seedController} from "../controllers/seed_controller";


const router = express.Router();

router.get('/seed',seedController);

export default router;