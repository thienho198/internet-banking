const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');

exports.getCustomerByPaymentAccount = async (req, res, next) => {
  const stk = req.body.stk;
  const paymentAccount = await PaymentAccount.findOne({ stk: stk }).populate(
    'customer'
  );
  if (!paymentAccount) {
    res.status(404).json({ success: false, mes: 'account not found' });
  }
  const customer = await Customer.findOne({
    paymentAccountId: paymentAccount._id,
  }).select({
    name: 1,
  });
  if (!customer) {
    res.status(404).json({ success: false, mes: 'customer not found' });
  }
  res.status(200).json({ success: true, data: customer, msg: 'found' });
};

exports.getAll = async (req, res, next) => {
  console.log(req.body);
  try {
    const accounts = await PaymentAccount.find();
    res.status(200).json({ success: true, data: accounts });
  } catch (err) {
    res.status(400).json({ success: false, yes: 'ok' });
  }
};

exports.getAccount = async (req, res, next) => {
  const account = await PaymentAccount.findById(req.params.id);
  if (!account) {
    return res.status(404).json({ success: false });
  }
  res.status(200).json({ success: true, yourAccount: { account } });
};

exports.addMoneyByStk = async (req, res, next) => {
  const { stk, amountOfMoney } = req.body;
  try {
    const paymentAccount = await PaymentAccount.findOne({ stk: stk });
    paymentAccount.balance = paymentAccount.balance + amountOfMoney;
    await paymentAccount.save();
    res
      .status(200)
      .json({ success: true, currentBalance: paymentAccount.balance });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: 'server error' });
  }
};
