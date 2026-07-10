const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect, isAdmin, isStoreOwner, isUser } = require('../middlewares/authMiddleware');

// --- Admin Routes (must come before /:storeId to avoid conflicts) ---
router.post('/', protect, isAdmin, storeController.createStoreByAdmin);
router.get('/dashboard-stats', protect, isAdmin, storeController.getDashboardStats);

// --- Store Owner Route ---
router.get('/my-store', protect, isStoreOwner, storeController.getStoreOwnerDashboard);

// --- General authenticated route (User + Admin can browse stores) ---
router.get('/', protect, storeController.getAllStores);

// --- Store details + reviews (any logged-in user) ---
router.get('/:storeId/details', protect, storeController.getStoreDetails);

// --- Rating submission (Normal Users only) ---
router.post('/:storeId/ratings', protect, isUser, storeController.submitOrUpdateRating);

// --- Admin edit/delete (kept after the specific GET routes above) ---
router.put('/:id', protect, isAdmin, storeController.updateStoreByAdmin);
router.delete('/:id', protect, isAdmin, storeController.deleteStoreByAdmin);

module.exports = router;