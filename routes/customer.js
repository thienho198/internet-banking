const express = require('express');

const customerController = require('../controllers/customerController');

const router = express.Router();
const { protect } = require('../middleware/auth');

router.post('/customer/create', customerController.postCreateCustomer);
router.post('/customer/login', customerController.login);
router.get(
  '/customer/getListDeptReminderWasRemined',
  protect,
  customerController.getListDeptReminderWasRemined
);
router.get(
  '/customer/getListDeptReminderRemind',
  protect,
  customerController.getListDeptReminderRemind
);
router.post('/customer/transfer', protect, customerController.transferMoney);
router.post('/customer/addMoneyByEmail', customerController.addMoneyByEmail);
router.post('/customer/refresh', customerController.refresh);

module.exports = router;
