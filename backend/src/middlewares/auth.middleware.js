const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.protect = async (req, res, next) => {
    try {
        let token = req.cookies.token; // Pehle cookie check karo

        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Phir header check karo
        }

        if (!token) {
            return res.status(401).json({ error: 'Bhai pehle login toh kar lo!' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        console.log("Cookies Header in Request:", req.headers.cookie);
        next();
    } catch (err) {
        res.status(401).json({ error: 'Session expired, login again.' });
    }
};