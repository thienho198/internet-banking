const express = require('express');

const bankController = require('../controllers/bankController');

const router = express.Router();

router.get('/bank/checkRgpCustomer', bankController.getRgpBank);

module.exports = router;
