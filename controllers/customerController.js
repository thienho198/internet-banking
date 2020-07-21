const generator = require('creditcard-generator');
const PaymentAccount = require('../models/paymentAccount');
const History = require('../models/history');
const Customer = require('../models/customer');
const DeptReminder = require('../models/deptReminder');
const paymentController = require('../controllers/paymentController');
const sendEmail = require('../utils/sendEmail');
const rn = require('random-number');
const jwt = require('jsonwebtoken');

exports.getListDeptReminderWasRemined = (req, res, next) => {
  const customerId = req.customer;
  Customer.findById(customerId)
    .then((customer) => {
      return customer
        .populate(['listDeptReminders.deptReminderId', 'paymentAccountId'])
        .execPopulate();
    })
    .then((customer) => {
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

      listDeptReminders.nameRemind = PaymentAccount.name;
      res.status(201).json(listDeptReminders);
    })
    .catch((err) => console.log(err));
};

exports.getListDeptReminderRemind = (req, res, next) => {
  const customerId = req.customer;
  Customer.findById(customerId)
    .then((customer) => {
      return customer
        .populate(['listDeptReminders.deptReminderId', 'paymentAccountId'])
        .execPopulate();
    })
    .then((customer) => {
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
      res.status(201).json(listDeptReminders);
    })
    .catch((err) => res.status(202).json({ err: 'No data available' }));
};

exports.deleteDeptReminder = async (req, res, next) => {
  const { id, message } = req.body;
  const deptReminder = await DeptReminder.findById(id);
  const accessToken = req.headers['x-access-token'];
  if (!id) {
    res.status(400).json({ err: 'Dept reminder not exist' });
  }
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const idDeptRemind = payload.id;
        const stkremind = await PaymentAccount.findOne({
          stk: deptReminder.stkRemind,
        });
        const stkwasremined = await PaymentAccount.findOne({
          stk: deptReminder.stkWasRemined,
        });
        const customerRemind = await Customer.findOne({
          paymentAccountId: stkremind,
        });
        const customerWasRemined = await Customer.findOne({
          paymentAccountId: stkwasremined,
        });
        const listRemindUpdate = customerRemind.listDeptReminders.filter(
          (item) => item.deptReminderId.toString() !== id.toString()
        );
        const listWasRemindUpdate = customerWasRemined.listDeptReminders.filter(
          (item) => item.deptReminderId.toString() !== id.toString()
        );
        const customerRemindNotify = customerRemind.notifications;
        customerRemind.listDeptReminders = listRemindUpdate;
        customerWasRemined.listDeptReminders = listWasRemindUpdate;
        // Them notify
        if (idDeptRemind === customerRemind.id)
          customerWasRemined.notifications.push({
            notify:
              `So tai khoan ${deptReminder.stkRemind} da xoa nhac no voi noi dung:  ` +
              message,
          });
        else
          customerRemind.notifications.push({
            notify:
              `So tai khoan ${deptReminder.stkWasRemined} da xoa nhac no voi noi dung:  ` +
              message,
          });
        await customerWasRemined.save();
        await customerRemind.save();
        await deptReminder.remove();
      }
    );
    res.status(202).json({ succes: true });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err: err });
  }
};

exports.createListRemind = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  let { stk, nameRemind, bank } = req.body;
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        const findStk = customer.listAccountRemind.find(
          (item) => item.stk === stk.toString()
        );
        if (!bank || bank === 'G16BANK') {
          const accountRemind = await PaymentAccount.findOne({ stk });
          if (!accountRemind)
            return res.status(400).json({
              success: false,
              err: 'This account does not exist in bank',
            });
          if (!nameRemind) {
            nameRemind = accountRemind.name;
          }
        }
        if (!findStk) {
          customer.listAccountRemind.push({ stk, nameRemind, bank });
          await customer.save();
          return res
            .status(200)
            .json({ success: true, data: customer.listAccountRemind });
        }
        return res.status(400).json({
          success: false,
          err: 'This account is already in the remind list',
        });
      }
    );
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.getListRemind = async (req, res, next) => {
  try {
    const customer = req.customer;
    return res
      .status(200)
      .json({ listAccountRemind: customer.listAccountRemind });
  } catch (err) {
    res.status(400).json({ sucess: false, err });
  }
};

exports.updateListRemind = async (req, res, next) => {
  let { id, stk, nameRemind, bank } = req.body;
  if (!id)
    return res.status(400).json({ success: false, err: 'Please enter id' });
  try {
    const customer = req.customer;
    let check = false;
    let checkBank;
    let updateListRemind = customer.listAccountRemind.map((item) => {
      if (item._id.toString() === id) {
        if (nameRemind) item.nameRemind = nameRemind;
        if (bank) item.bank = bank;
        if (stk) item.stk = stk;
        check = true;
        if (item.bank === 'G16BANK') checkBank = 'G16BANK';
      }
      return item;
    });
    if (checkBank === 'G16BANK') {
      const checkAccount = await PaymentAccount.findOne({
        stk,
      });
      if (!checkAccount) {
        check = false;
        return res.status(400).json({ success: false, err: 'Invalid account' });
      }
    }

    if (check) {
      customer.listAccountRemind = updateListRemind;
      await customer.save();
      return res
        .status(200)
        .json({ success: true, data: customer.listAccountRemind });
    }
    return res.status(400).json({
      success: false,
      err: 'Account not found in list',
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

exports.deleteListRemind = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  let { stk } = req.body;
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        let check = false;
        let updateListRemind = customer.listAccountRemind.filter((item) => {
          if (item.stk === stk.toString()) check = true;
          return item.stk !== stk.toString();
        });
        if (check) {
          customer.listAccountRemind = updateListRemind;
          await customer.save();
          return res
            .status(200)
            .json({ success: true, data: customer.listAccountRemind });
        }
        return res.status(400).json({
          success: false,
          err: 'Account not found in list',
        });
      }
    );
  } catch (err) {
    res.status(400).json({ success: false, err });
  }
};

exports.historyDebtRemind = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        const paymentAccount = await PaymentAccount.findById(
          customer.paymentAccountId
        );
        const history = await History.find();
        const historyDebtRemind = history.filter(
          (item) =>
            ((item.accountReceive === paymentAccount.stk &&
              item.bankReceiver === 'G16BANK') ||
              (item.accountSender === paymentAccount.stk &&
                item.bankSender === 'G16BANK')) &&
            item.category === 'DeptPay'
        );
        res.status(200).json({
          success: true,
          historyDebtRemind,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.historyReceive = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        const paymentAccount = await PaymentAccount.findById(
          customer.paymentAccountId
        );
        const history = await History.find();
        const historyReceive = history.filter(
          (item) =>
            item.accountReceive === paymentAccount.stk &&
            item.bankReceiver === 'G16BANK'
        );
        res.status(200).json({
          success: true,
          historyReceive,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.historyTransfer = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        const paymentAccount = await PaymentAccount.findById(
          customer.paymentAccountId
        );
        const history = await History.find();
        const historyTransfer = history.filter(
          (item) =>
            item.accountSender === paymentAccount.stk &&
            item.bankSender === 'G16BANK'
        );
        res.status(200).json({
          success: true,
          historyTransfer,
        });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ err });
  }
};

exports.postCreateCustomer = async (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: 'Please add name, email and password' });
  }
  const stk = generator.GenCC('VISA', 1).toString();
  const balance = 0;
  const account = await PaymentAccount.create({
    name: name,
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
  const { stk, amountOfMoney, message, otpcode, category } = req.body;
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id);
        if (!customer) {
          return res
            .status(400)
            .json({ success: false, err: 'User not exists' });
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
        await History.create({
          operator: 'Customer',
          accountSender: userAccount.stk,
          sender: userAccount.name,
          accountReceive: stk,
          receiver: transferAccount.name,
          message,
          amountOfMoney,
          category,
        });
        res.json({ success: true, userAccount, transferAccount, message });
      }
    );
  } catch (err) {
    console.log(err);
    res.json({ success: false, err });
  }
};

exports.changePassword = async (req, res, next) => {
  const accessToken = req.headers['x-access-token'];
  const { oldPassword, newPassword } = req.body;
  try {
    jwt.verify(
      accessToken,
      process.env.JWT_SECRET,
      { ignoreExpiration: true },
      async function (err, payload) {
        const { id } = payload;
        const customer = await Customer.findById(id).select('+password');
        if (!customer) {
          return res
            .status(400)
            .json({ success: false, err: 'User not exists' });
        }
        const isMatch = await customer.mathPassword(oldPassword);
        if (!isMatch) {
          return res.status(400).json({
            error: 'Invalid old password',
            success: false,
          });
        }
        customer.password = newPassword;
        await customer.save();
        res.status(200).json({ success: true });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, err });
  }
};

var generateOTP = rn.generator({
  min: 10000,
  max: 99999,
  integer: true,
});
