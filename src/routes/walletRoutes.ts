import { Router } from 'express';
import { getWallet, addWallet } from '../controllers/walletController';

const router = Router();

router.get('/:address', getWallet);
router.post('/', addWallet);

export default router;