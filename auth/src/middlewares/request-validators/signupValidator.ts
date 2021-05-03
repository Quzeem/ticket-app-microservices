import { body } from 'express-validator';

const validattors = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email')
    .normalizeEmail({ all_lowercase: true }),
  body('password')
    .trim()
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 8 })
    .withMessage('Password must be atleast 8 characters in length'),
];

export default validattors;
