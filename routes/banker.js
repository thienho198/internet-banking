const express = require('express');

const bankerController = require('../controllers/bankerController');

const router = express.Router();
const { verifyBanker, verifyAdmin } = require('../middleware/auth');

router.post(
  '/banker/create',
  verifyBanker,
  verifyAdmin,
  bankerController.create
);
router.post(
  '/banker/addMoneyByEmail',
  verifyBanker,
  bankerController.addMoneyByEmail
);

router.post(
  '/banker/historyOnlineExchange',
  verifyBanker,
  verifyAdmin,
  bankerController.getHistoryOnlineExchange
);

router.post(
  '/banker/getHistoryAccount',
  verifyBanker,
  bankerController.getHistoryAccount
);
router.post('/banker/addMoney', verifyBanker, bankerController.addMoneyByStk);
router.get(
  '/banker/getAllCustomer',
  verifyBanker,
  bankerController.getAllCustomer
);
router.get(
  '/banker/getAllBanker',
  verifyBanker,
  verifyAdmin,
  bankerController.getAllBanker
);
router.delete(
  '/banker/deleteBanker',
  verifyBanker,
  verifyAdmin,
  bankerController.deleteBanker
);
module.exports = router;
