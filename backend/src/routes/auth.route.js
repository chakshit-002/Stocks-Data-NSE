const express = require('express');
const router = express.Router();
const { register, login,getMe,logout } = require('../controllers/auth.controller');
const { body, validationResult } = require('express-validator');
const { protect } = require('../middlewares/auth.middleware');
// Validator Middleware
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
};

router.get('/me', protect, getMe);

router.post('/register', [
    body('email').isEmail().withMessage('Email sahi dalo bhai'),
    body('password').isLength({ min: 6 }).withMessage('Password kam se kam 6 char ka ho'),
    validate
], register);

router.post('/login', login);

router.post('/logout', protect, logout);


module.exports = router;