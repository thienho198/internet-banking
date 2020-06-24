const express = require('express');

const bankerController = require('../controllers/bankerController');

const router = express.Router();
const { verifyBanker } = require('../middleware/auth');

router.post('/banker/create', bankerController.create);
router.post(
  '/banker/addMoneyByEmail',
  verifyBanker,
  bankerController.addMoneyByEmail
);
router.post('/banker/addMoney', verifyBanker, bankerController.addMoneyByStk);
router.get(
  '/banker/getAllCustomer',
  verifyBanker,
  bankerController.getAllCustomer
);
module.exports = router;
