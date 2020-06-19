const generator = require('creditcard-generator');
const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');
const paymentController = require('../controllers/paymentController');
const sendEmail = require('../utils/sendEmail');
const rn = require('random-number');
const jwt = require('jsonwebtoken');

exports.getListDeptReminderWasRemined = (req, res, next) => {
  const customerId = req.query.id;
  Customer.findById(customerId)
    .then((customer) => {
      return customer
        .populate(['listDeptReminders.deptReminderId', 'paymentAccountId'])
        .execPopulate();
    })
    .then((customer) => {
      console.log('123', customer);
      const listDeptReminders = customer.listDeptReminders.filter(
        (reminder) => {
          if (
            reminder.deptReminderId.stkWasRemined ===
            customer.paymentAccountId.stk
          ) {
            return true;
          }
          return false;
        }
      );
      //listDeptReminders = listDeptReminders.map(item=>item.deptReminderId._doc)
      res.json(listDeptReminders);
    })
    .catch((err) => console.log(err));
};
exports.getListDeptReminderRemind = (req, res, next) => {
  const customerId = req.query.id;
  Customer.findById(customerId)
    .then((customer) => {
      return customer
        .populate(['listDeptReminders.deptReminderId', 'paymentAccountId'])
        .execPopulate();
    })
    .then((customer) => {
      console.log('123', customer.listDeptReminders);
      const listDeptReminders = customer.listDeptReminders.filter(
        (reminder) => {
          if (
            reminder.deptReminderId.stkRemind === customer.paymentAccountId.stk
          ) {
            return true;
          }
          return false;
        }
      );
      //listDeptReminders = listDeptReminders.map(item=>item.deptReminderId._doc)
      res.json(listDeptReminders);
    })
    .catch((err) => console.log(err));
};

exports.postCreateCustomer = async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  const stk = generator.GenCC('VISA', 1).toString();
  const balance = 0;
  const account = await PaymentAccount.create({
    stk: stk,
    balance: balance,
  });
  try {
    const customer = await Customer.create({
      name: name,
      email: email,
      paymentAccountId: account._id,
      phoneNumber: phoneNumber,
      password: password,
    });
    res.json({ success: true });
  } catch (err) {
    if (err.errors.email) {
      res
        .status(400)
        .json({ error: err.errors.email.properties.message, success: false });
    } else {
      res.json({ success: false });
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
    console.log(customerPopulateAccountPM);
    const stk = customerPopulateAccountPM.paymentAccountId.stk;
    paymentController.addMoneyByStk(
      { body: { stk: stk, amountOfMoney: amountOfMoney } },
      res
    );
  } catch (err) {
    res.status(400).json({ success: true, message: 'server error' });
  }
};

exports.sendOTP = async (req, res, next) => {
  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) {
    return res.status(401).json({ success: false, err: 'Invalid email!' });
  }
  let number = generateOTP();
  customer.OTP = number;
  const message = `Your OTP is: ${number}`;
  try {
    await sendEmail({
      email: customer.email,
      subject: 'OTP for transfer',
      message,
    });
    await customer.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    customer.OTP = undefined;
    await customer.save({ validateBeforeSave: false });
    res.status(500).json({ err: 'Email could not be sent' });
  }
};

exports.transferMoney = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  const { stk, amountOfMoney, message, otpcode } = req.body;
  jwt.verify(
    accessToken,
    process.env.JWT_SECRET,
    { ignoreExpiration: true },
    async function (err, payload) {
      const { id } = payload;
      const customer = await Customer.findById(id);
      if (!customer) {
        return res.status(400).json({ success: false, err: 'User not exists' });
      }
      if (customer.OTP !== otpcode) {
        return res.status(403).json({ success: false, err: 'Invalid OTP' });
      }
      const userAccount = await PaymentAccount.findById(
        customer.paymentAccountId
      );
      const allFee = amountOfMoney + parseInt(process.env.FEETRANSFER);
      if (userAccount.balance < allFee)
        return res
          .status(406)
          .json({ success: false, err: 'You dont have enough money' });

      const transferAccount = await PaymentAccount.findOne({ stk: stk });
      transferAccount.balance = transferAccount.balance + amountOfMoney;
      userAccount.balance = userAccount.balance - allFee;
      customer.OTP = undefined;
      await customer.save();
      await userAccount.save();
      await transferAccount.save();
      return res.json({ userAccount, transferAccount, message });
    }
  );
};

exports.refresh = async (req, res, next) => {
  const { refreshToken, accessToken } = req.body;
  jwt.verify(
    accessToken,
    process.env.JWT_SECRET,
    { ignoreExpiration: true },
    async function (err, payload) {
      const { id } = payload;
      const customer = await Customer.findById(id);
      if (!customer) {
        res.status(400).json({ success: false, err: 'User not exists' });
      }
      if (customer.refreshToken === refreshToken) {
        const newAccessToken = customer.SignJwtToken();
        res.status(202).json({ accessToken: newAccessToken, refreshToken });
      }
      res.status(402).json({ success: false, err: 'Invalid refresh token' });
    }
  );
};

var generateOTP = rn.generator({
  min: 10000,
  max: 99999,
  integer: true,
});
