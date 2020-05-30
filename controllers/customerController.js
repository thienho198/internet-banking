const generator = require('creditcard-generator');
const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');
const paymentController = require('../controllers/paymentController');

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
  console.log(account);

  try {
    const customer = await Customer.create({
      name: name,
      email: email,
      paymentAccountId: account._id,
      phoneNumber: phoneNumber,
      password: password,
    });
    sendTokenResponse(customer, 200, res);
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  req.header;
  const customer = await Customer.findOne({ email }).select('+password');
  if (!customer) {
    return res
      .status(401)
      .json({ error: 'Authentication invalid, please try again' });
  }

  const isMatch = await customer.mathPassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ error: 'Authentication invalid, please try again' });
  }
  sendTokenResponse(customer, 200, res);
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

const sendTokenResponse = (customer, statusCode, res) => {
  const token = customer.SignJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
  });
};

// paymentAccount
//     .save()
//     .then((account) => {
//       return bcrypt
//         .hash(password, 12)
//         .then((hashedPassword) => {
//           const customer = new Customer({
//             name: name,
//             email: email,
//             paymentAccountId: account._id,
//             phoneNumber: phoneNumber,
//             password: hashedPassword,
//           });
//           return customer.save();
//         })
//         .catch((err) => res.json({ msg: err.errors.email.message }));
//     })
//     .then(() => {
//       const token = customer.SignJwtToken();
//       res.json({ success: true, token: this.token });
//     })
//     .catch((err) => {
//       console.log(err);
//       res.json({ success: false });
//     });
