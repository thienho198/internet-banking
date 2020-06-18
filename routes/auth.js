const express = require('express');
var authController = require('../controllers/authController');
const router = express.Router();

router.post('/auth/login', authController.login);
router.post('/auth/forgotpassword', authController.forgotPassword);
router.post('/auth/resetpassword/:resettoken', authController.resetPassword);
module.exports = router;
