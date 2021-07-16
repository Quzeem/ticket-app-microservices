import { body } from 'express-validator';

const validateLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail({ all_lowercase: true }),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

export default validateLogin;
