const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Admin Login
router.post('/admin/login', authController.adminLogin);

// User Login
router.post('/user-login', authController.userLogin);

module.exports = router;
