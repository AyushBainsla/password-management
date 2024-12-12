const Password = require('../models/passwordModel');
const encryptionService = require('../services/encryptionService');

/**
 * Create a new password entry
 */
exports.createPassword = async (req, res, next) => {
    try {
        const { name, url, username, password } = req.body;

        // Encrypt the password before storing it
        const encryptedPassword = encryptionService.encrypt(password);

        const newPassword = await Password.create({
            userId: req.user.id,
            name,
            url,
            username,
            password: encryptedPassword,
        });

        res.status(201).json({
            message: 'Password created successfully',
            data: newPassword,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all passwords with pagination
 */
exports.getPasswords = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 10;

        // Retrieve paginated passwords for the logged-in user
        const passwords = await Password.find({ userId: req.user.id })
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });

        const decryptedPasswords = passwords.map((entry) => ({
            ...entry._doc,
            password: encryptionService.decrypt(entry.password),
        }));

        res.status(200).json({
            message: 'Passwords retrieved successfully',
            data: decryptedPasswords,
            currentPage: page,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a password entry
 */
exports.updatePassword = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, url, username, password } = req.body;

        const encryptedPassword = encryptionService.encrypt(password);

        const updatedPassword = await Password.findByIdAndUpdate(
            { _id: id, userId: req.user.id },
            { name, url, username, password: encryptedPassword },
            { new: true }
        );

        if (!updatedPassword) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        res.status(200).json({
            message: 'Password updated successfully',
            data: updatedPassword,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a password entry
 */
exports.deletePassword = async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedPassword = await Password.findOneAndDelete({ _id: id, userId: req.user.id });

        if (!deletedPassword) {
            return res.status(404).json({ message: 'Password entry not found' });
        }

        res.status(200).json({ message: 'Password deleted successfully' });
    } catch (error) {
        next(error);
    }
};
