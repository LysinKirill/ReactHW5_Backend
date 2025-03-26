import express from 'express';
import { login, logout, refresh, register } from '../controllers/authController';
import { validate } from '../validators/authValidator';

const router = express.Router();

router.post('/register', validate, register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refresh);

export default router;