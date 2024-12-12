const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

exports.protect = async (req, res, next) => {
    try {
        // Get the token from the request header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by ID and attach user info to the request object
        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Attach the user to the request
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
};
