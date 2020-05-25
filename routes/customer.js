const express = require("express");

const customerController = require("../controllers/customerController");

const router = express.Router();

router.post("/customer/create", customerController.postCreateCustomer);
router.get('/customer/getListDeptReminderWasRemined', customerController.getListDeptReminderWasRemined);
router.get('/customer/getListDeptReminderRemind', customerController.getListDeptReminderRemind);

module.exports = router;
