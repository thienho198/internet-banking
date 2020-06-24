const express = require('express');

const customerController = require('../controllers/customerController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/customer/create', customerController.postCreateCustomer);
router.get(
  '/customer/getListDeptReminderWasRemined',
  protect,
  customerController.getListDeptReminderWasRemined
);
router.delete(
  '/customer/deleteDeptReminder',
  protect,
  customerController.deleteDeptReminder
);
router.get(
  '/customer/getListDeptReminderRemind',
  protect,
  customerController.getListDeptReminderRemind
);
router.post('/customer/sendOTP', protect, customerController.sendOTP);
router.post('/customer/transfer', protect, customerController.transferMoney);

module.exports = router;
