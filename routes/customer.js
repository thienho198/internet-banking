const express = require('express');

const customerController = require('../controllers/customerController');

const router = express.Router();
const { protect, verifyBanker } = require('../middleware/auth');

router.post(
  '/customer/create',
  verifyBanker,
  customerController.postCreateCustomer
);
router.post(
  '/customer/createListRemind',
  protect,
  customerController.createListRemind
);

router.put(
  '/customer/updateListRemind',
  protect,
  customerController.updateListRemind
);

router.delete(
  '/customer/deleteListRemind',
  protect,
  customerController.deleteListRemind
);

router.get(
  '/customer/getListDeptReminderWasRemined',
  protect,
  customerController.getListDeptReminderWasRemined
);
router.get('/customer/history', protect, customerController.getHistory);
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
