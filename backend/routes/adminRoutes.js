const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/auth');

// All admin routes require JWT authentication
router.use(authMiddleware);

// Dashboard Overview Metrics
router.get('/metrics', adminController.getDashboardMetrics);

// Get Pending Vendor Approvals
router.get('/vendors/pending', adminController.getPendingVendors);

// Approve a Vendor
router.put('/vendors/:id/approve', adminController.approveVendor);

// Reject / Delete a Vendor
router.delete('/vendors/:id/reject', adminController.rejectVendor);

module.exports = router;
