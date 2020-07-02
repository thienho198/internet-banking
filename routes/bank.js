const express = require('express');

const bankController = require('../controllers/bankController');
var paymentController = require('../controllers/paymentController');

const { protect, protectBank, protectRgp } = require('../middleware/auth');

const router = express.Router();

router.post('/bank/checkRgpCustomer', protect, bankController.getRgpBank);
router.post('/bank/checkPgpCustomer', bankController.getPgpBank);

router.post(
  '/bank/outerTransferMoney',
  protectBank,
  protectRgp,
  bankController.outerBankAddMoneyByStk
);

router.post('/bank/bankTransferRgp', protect, bankController.bankTransferRgp);

router.post(
  '/bank/getCustomer',
  protectBank,
  paymentController.getCustomerByPaymentAccount
);
module.exports = router;
