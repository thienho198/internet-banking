const express = require("express");

const customerController = require("../controllers/customerController");

const router = express.Router();

router.post("/customer/create", customerController.postCreateCustomer);

module.exports = router;
