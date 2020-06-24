const Banker = require('../models/banker');
const Customer = require('../models/customer');
const History = require('../models/history');
const PaymentAccount = require('../models/paymentAccount');

exports.create = async (req, res, next) => {
  const { name, email, role, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please add name, email and password' });
  }
  const customer = await Customer.findOne({ email: email });
  if (customer) {
    return res
      .status(400)
      .json({ success: false, err: 'This email belong to one of customer' });
  }
  try {
    const banker = await Banker.create({ name, email, role, password });
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    if (err.errors.email) {
      res
        .status(400)
        .json({ error: err.errors.email.properties.message, success: false });
    } else {
      res.json({ success: false, err });
    }
  }
};

exports.addMoneyByEmail = async (req, res, next) => {
  const { email, amountOfMoney } = req.body;
  try {
    const customer = await Customer.findOne({ email: email });
    const customerPopulateAccountPM = await customer
      .populate('paymentAccountId')
      .execPopulate();
    // console.log(customerPopulateAccountPM);
    const stk = customerPopulateAccountPM.paymentAccountId.stk;

    this.addMoneyByStk(
      { body: { stk: stk, amountOfMoney: amountOfMoney } },
      res
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: true, err });
  }
};

exports.addMoneyByStk = async (req, res, next) => {
  const { stk, amountOfMoney } = req.body;
  try {
    const paymentAccount = await PaymentAccount.findOne({ stk: stk });
    paymentAccount.balance = paymentAccount.balance + amountOfMoney;
    await paymentAccount.save();
    await History.create({
      operator: 'System',
      accountReceive: stk,
      amountOfMoney,
      receiver: paymentAccount.name,
      message: `Account ${stk} have received ${amountOfMoney}`,
    });
    return res
      .status(200)
      .json({ success: true, currentBalance: paymentAccount.balance });
  } catch (err) {
    console.log(err);
    return res.status(400).json({ success: false, err: 'server error' });
  }
};

exports.getAllCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.find();
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
