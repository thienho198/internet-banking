var express = require('express');
var paymentController = require('../controllers/paymentController');
const router = express.Router();

router.get('/payment/getCustomer', paymentController.getCustomerByPaymentAccount);
router.post('/payment/addMoney', paymentController.addMoneyByStk);

module.exports = router;