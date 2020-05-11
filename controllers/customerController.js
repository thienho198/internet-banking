const generator = require("creditcard-generator");
const bcrypt = require("bcryptjs");

const PaymentAccount = require("../models/paymentAccount");
const Customer = require("../models/customer");

exports.postCreateCustomer = (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  const stk = generator.GenCC("VISA", 1).toString();
  const balance = 0;
  const paymentAccount = new PaymentAccount({
    stk: stk,
    balance: balance,
  });
  paymentAccount
    .save()
    .then((account) => {
      return bcrypt.hash(password, 12).then((hashedPassword) => {
        const customer = new Customer({
          name: name,
          email: email,
          paymentAccountId: account._id,
          phoneNumber: phoneNumber,
          password: hashedPassword,
        });
        return customer.save();
      });
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
};
