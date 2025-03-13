import { Router } from 'express';
import { convertCurrency } from '../controllers/conversionController';

const router = Router();

router.get('/', convertCurrency);

export default router;