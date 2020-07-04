const Banker = require('../models/banker');
const Customer = require('../models/customer');
const History = require('../models/history');
const PaymentAccount = require('../models/paymentAccount');
const jwt = require('jsonwebtoken');

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
    await Banker.create({ name, email, role, password });
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

exports.getHistoryAccount = async (req, res, next) => {
  const stk = req.body.stk.toString();
  try {
    const history = await History.find();
    const historyTransfer = history.filter(
      (item) => item.accountSender === stk
    );

    const historyReceive = history.filter(
      (item) => item.accountReceive === stk
    );

    const historyDeptPay = history.filter(
      (item) =>
        (item.accountSender === stk && item.category === 'DeptPay') ||
        (item.accountReceive === stk && item.category === 'DeptPay')
    );

    res.status(200).json({
      success: true,
      historyTransfer,
      historyReceive,
      historyDeptPay,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.getHistoryOnlineExchange = async (req, res, next) => {
  const history = await History.find();
  const { begin, to, month, bank } = req.body;
  const onlineHistory = history.filter((item) => {
    if (begin && to && month) {
      let d = new Date(item.createdAt);
      let day = d.getDate();
      if (
        Number(begin) <= day &&
        Number(to) >= day &&
        Number(month) - 1 == d.getMonth() &&
        item.category === 'InternetBank'
      ) {
        if (bank) {
          if (bank === item.bankReceiver || bank === item.bankSender)
            return item;
        } else return item;
      }
    } else return item.category === 'InternetBank';
  });
  let totalExchange = onlineHistory.reduce((money, item) => {
    let d = new Date(item.createdAt);
    return (money += item.amountOfMoney);
  }, 0);
  let totalTransfer = onlineHistory.reduce((money, item) => {
    if (item.bankSender === 'G16BANK') money += item.amountOfMoney;
    return money;
  }, 0);
  let totalReceive = onlineHistory.reduce((money, item) => {
    if (item.bankReceiver === 'G16BANK') money += item.amountOfMoney;
    return money;
  }, 0);
  res
    .status(200)
    .json({ onlineHistory, totalExchange, totalReceive, totalTransfer });
};

exports.getAllCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.find();
    res.status(200).json({ success: true, data: customer });
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};
