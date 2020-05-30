var express = require('express');
var paymentController = require('../controllers/paymentController');
const { protect, protectBank } = require('../middleware/auth');
const router = express.Router();

router.get(
  '/payment/getCustomer',
  paymentController.getCustomerByPaymentAccount
);
router.get('/payment/:stk', protect, paymentController.getAccount);
router.get('/allPayment', protect, paymentController.getAll);
router.get('/outterAccount', protectBank, paymentController.getOutterAccount);
router.post('/payment/addMoney', protect, paymentController.addMoneyByStk);
module.exports = router;
