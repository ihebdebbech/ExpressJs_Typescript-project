import express from 'express';
import { initPayment, paymentsuccess } from '../controllers/transactionController';

const router = express.Router();

// Route to initialize a payment
router.post('/init-payment', initPayment);
//router.get('/payment-success', paymentsuccess);

export default router;