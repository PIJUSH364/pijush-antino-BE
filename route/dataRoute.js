import express from 'express';
import { getAllData, generateData, checkCalculationStatus } from '../controller/controller.js';

const router = express.Router();


router.get('/data', getAllData);


router.post('/generate', generateData);

router.get('/status/:id', checkCalculationStatus);

export default router;
