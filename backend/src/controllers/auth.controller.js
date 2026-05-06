const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// src/controllers/auth.controller.js

exports.register = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'Email already registered' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        // --- COOKIE SET KARO ---
        res.cookie('token', token, {
            httpOnly: true, // Sabse important: JS ise access nahi kar payegi (XSS protection)
            secure: false,  // Development mein false rakho, production (HTTPS) mein true
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 din
            sameSite: 'none' // Cross-site request protection
        });

        res.status(201).json({
            message: "User registered and logged in",
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.comparePassword(password))) {
            const token = generateToken(user._id);

            // Cookie mein token set kar rahe hain
            res.cookie('token', token, {
                httpOnly: true, // Frontend JS ise read nahi kar payegi (Secure)
                secure: process.env.NODE_ENV === 'production', // Sirf HTTPS par chalega
                maxAge: 30 * 24 * 60 * 60 * 1000 ,// 30 din,
                  sameSite: 'none'
            });

            res.json({
                message: "Logged in successfully",
                user: { id: user._id, name: user.name, email: user.email }
            });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// auth.controller.js
exports.getMe = async (req, res) => {
    // req.user humein protect middleware se mil jayega
    res.json({ user: req.user });
};

exports.logout = (req, res) => {
    // Cookie ko clear karo
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none'
    });

    res.status(200).json({ message: 'Logged out successfully! Fir milenge bhai.' });
};