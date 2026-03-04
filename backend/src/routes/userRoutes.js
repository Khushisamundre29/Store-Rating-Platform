const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Admin Routes ---
router.post('/', protect, isAdmin, userController.createUserByAdmin);      // Create user
router.get('/', protect, isAdmin, userController.getAllUsersByAdmin);       // List all users
router.get('/:id', protect, isAdmin, userController.getUserByIdByAdmin);   // Get user by ID

// NOTE: Password change is handled at PUT /api/auth/password (in authRoutes)
// It is NOT here to avoid the /:id wildcard swallowing /update-password

module.exports = router;