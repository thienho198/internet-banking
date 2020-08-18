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
router.get(
  '/payment/paymentAccount',
  protect,
  paymentController.paymentAccount
);

module.exports = router;
