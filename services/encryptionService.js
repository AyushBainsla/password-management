const crypto = require('crypto');

// Encryption configuration
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'defaultencryptionkey123'; // Must be 32 characters for AES-256
const IV_LENGTH = 16; // Initialization vector length for AES-256-CBC

/**
 * Encrypt a given plain text using AES-256-CBC.
 * @param {string} text - The plain text to encrypt.
 * @returns {string} - The encrypted text in base64 format.
 */
const encrypt = (text) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let encrypted = cipher.update(text, 'utf8', 'base64');
        encrypted += cipher.final('base64');
        return iv.toString('base64') + ':' + encrypted;
    } catch (err) {
        console.error('Encryption error:', err);
        throw new Error('Error encrypting the data');
    }
};

/**
 * Decrypt an encrypted text using AES-256-CBC.
 * @param {string} text - The encrypted text in base64 format.
 * @returns {string} - The decrypted plain text.
 */
const decrypt = (text) => {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts[0], 'base64');
        const encryptedText = parts[1];
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (err) {
        console.error('Decryption error:', err);
        throw new Error('Error decrypting the data');
    }
};

module.exports = {
    encrypt,
    decrypt,
};
