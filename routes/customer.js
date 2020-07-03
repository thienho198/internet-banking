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
  '/customer/getListRemind',
  protect,
  customerController.getListRemind
);

router.get(
  '/customer/getListDeptReminderWasRemined',
  protect,
  customerController.getListDeptReminderWasRemined
);
router.get(
  '/customer/historyDebtRemind',
  protect,
  customerController.historyDebtRemind
);
router.get(
  '/customer/historyReceive',
  protect,
  customerController.historyReceive
);
router.get(
  '/customer/historyTransfer',
  protect,
  customerController.historyTransfer
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

router.post(
  '/customer/changePassword',
  protect,
  customerController.changePassword
);

router.post('/customer/sendOTP', protect, customerController.sendOTP);
router.post('/customer/transfer', protect, customerController.transferMoney);

module.exports = router;
