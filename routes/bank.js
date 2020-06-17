const express = require('express');

const bankController = require('../controllers/bankController');
var paymentController = require('../controllers/paymentController');

const { protectBank, protectKey } = require('../middleware/auth');

const router = express.Router();

router.post('/bank/checkRgpCustomer', bankController.getRgpBank);

router.post(
  '/bank/rgpTransferMoney',
  protectBank,
  protectKey,
  bankController.rgpAddMoneyByStk
);

router.post(
  '/bank/rgpGetCustomer',
  protectBank,
  paymentController.getCustomerByPaymentAccount
);
module.exports = router;
