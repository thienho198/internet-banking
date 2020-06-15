var express = require('express');
var paymentController = require('../controllers/paymentController');
const { protect, protectBank } = require('../middleware/auth');
const router = express.Router();

router.post(
  '/payment/getCustomer',
  protect,
  paymentController.getCustomerByPaymentAccount
);
router.get('/payment/allPayment', protect, paymentController.getAll);
router.post('/payment/addMoney', protect, paymentController.addMoneyByStk);
router.get('/payment/:id', protect, paymentController.getAccount);

module.exports = router;
