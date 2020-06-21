const express = require('express');

const deptReminerController = require('../controllers/deptReminderController');

const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/deptReminder/create', deptReminerController.createDeptReminder);

module.exports = router;
