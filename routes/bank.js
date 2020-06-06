const express = require('express');

const bankController = require('../controllers/bankController');

const router = express.Router();

router.post('/bank/checkRgpCustomer', bankController.getRgpBank);

module.exports = router;
