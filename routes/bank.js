const express = require('express');

const bankController = require('../controllers/bankController');
var paymentController = require('../controllers/paymentController');

const { protectBank, protectKey } = require('../middleware/auth');

const router = express.Router();

router.post('/bank/checkRgpCustomer', bankController.getRgpBank);

router.post('/bank/getCustomer', protectBank, bankController.rgpAddMoneyByStk);

router.post(
  '/bank/rgpTransferMoney',
  protectBank,
  protectKey,
  paymentController.addMoneyByStk
);
module.exports = router;
