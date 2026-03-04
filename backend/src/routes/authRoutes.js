const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

// Public routes
router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);

// Protected route — any logged-in user can change their password
// Frontend calls: PUT /api/auth/password with { currentPassword, newPassword }
router.put('/password', protect, authController.changePassword);

module.exports = router;