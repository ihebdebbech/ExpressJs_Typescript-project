import express from 'express';
import { createAccountController, forgetPasswordWithEmail, loginadminController, loginController, verifyCodeController } from '../controllers/authenticationController';
import { resetPasswordofForgetController } from '../controllers/authenticationController';

const router = express.Router();
router.post('/reset-password', resetPasswordofForgetController);
router.post('/create-account', createAccountController);
router.post("/forget-password", forgetPasswordWithEmail);
router.post('/verify-code', verifyCodeController);

router.post('/loginadmin', loginadminController);
router.post('/login', loginController);
export default router;
