var express = require('express');
var paymentController = require('../controllers/paymentController');
const router = express.Router();

router.get('/payment/getCustomer', paymentController.getCustomerByPaymentAccount);

module.exports = router;