const express = require('express');

const bankController = require('../controllers/bankController');
var paymentController = require('../controllers/paymentController');

const { protect, protectBank, protectRgp } = require('../middleware/auth');

const router = express.Router();

router.post('/bank/checkRgpCustomer', bankController.getRgpBank);
router.post('/bank/checkPgpCustomer', bankController.getPgpBank);

router.post(
  '/bank/rgpTransferMoney',
  protectBank,
  protectRgp,
  bankController.outerBankAddMoneyByStk
);

router.post('/bank/bankTransferPgp', protect, bankController.bankTransferPgp);

router.post(
  '/bank/rgpGetCustomer',
  protectBank,
  paymentController.getCustomerByPaymentAccount
);
module.exports = router;
