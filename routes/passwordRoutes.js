const express = require('express');
const router = express.Router();
const { createPassword, getPasswords, updatePassword, deletePassword } = require('../controllers/passwordController');
const {protect} = require('../middlewares/authMiddleware');

router.post('/', protect, createPassword);
router.get('/', protect, getPasswords);
router.put('/:id', protect, updatePassword);
router.delete('/:id', protect, deletePassword);

module.exports = router;
