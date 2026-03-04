const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect, isAdmin } = require('../middlewares/authMiddleware');

// --- Admin Routes (must come before /:storeId to avoid conflicts) ---
router.post('/', protect, isAdmin, storeController.createStoreByAdmin);
router.get('/dashboard-stats', protect, isAdmin, storeController.getDashboardStats);

// --- Store Owner Route ---
router.get('/my-store', protect, storeController.getStoreOwnerDashboard);

// --- General authenticated route (User + Admin can browse stores) ---
router.get('/', protect, storeController.getAllStores);

// --- Rating submission (Normal Users only, but middleware just checks auth) ---
router.post('/:storeId/ratings', protect, storeController.submitOrUpdateRating);

module.exports = router;