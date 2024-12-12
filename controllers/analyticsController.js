const Password = require('../models/passwordModel');

exports.getUserAnalytics = async (req, res, next) => {
    try {
        const { userId } = req.query;

        const totalPasswords = await Password.countDocuments({ userId });

        // Calculate metrics
        const insecurePasswords = await Password.countDocuments({ userId, password: /(?=.{1,6})/ }); 
        const securePasswords = totalPasswords - insecurePasswords;

        res.status(200).json({
            totalPasswords,
            insecurePasswords,
            securePasswords,
        });
    } catch (error) {
        next(error);
    }
};
