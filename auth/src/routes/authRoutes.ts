import express from 'express';

const router = express.Router();

import { signup } from '../controllers/signup';
import { login } from '../controllers/login';
import { logout } from '../controllers/logout';
import { getCurrentUser } from '../controllers/currentUser';

import validateSignup from '../middlewares/request-validators/signupValidator';

router.post('/signup', validateSignup, signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/currentuser', getCurrentUser);

export { router as authRouter };
