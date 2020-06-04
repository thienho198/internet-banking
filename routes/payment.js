var express = require('express');
var paymentController = require('../controllers/paymentController');
const { protect, protectBank } = require('../middleware/auth');
const router = express.Router();

router.get(
  '/payment/getCustomer',
  protectBank,
  paymentController.getCustomerByPaymentAccount
);
router.get('/payment/allPayment', protect, paymentController.getAll);
router.post('/payment/addMoney', protectBank, paymentController.addMoneyByStk);
router.get('/payment/:id', protect, paymentController.getAccount);

module.exports = router;
