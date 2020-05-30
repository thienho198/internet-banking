const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const PaymentAccount = require('../models/paymentAccount');
const md5 = require('md5');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
  // else if (req.cookies.token){
  //     token = req.cookies.token
  // }
  if (!token) {
    return res
      .status(401)
      .json({ err: 'You need to login before access this route' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.customer = await Customer.findById(decoded.id);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ err: 'You need to login before access this route' });
  }
};

exports.protectBank = async (req, res, next) => {
  if (!req.headers.identify) {
    return res.status(401).json({ err: 'You can not connect to bank' });
  } else {
    const { id, stk } = req.body;
    console.log(req.body);
    const sig = req.headers.sig;
    const ts = req.headers.ts;
    if (req.headers.identify !== 'BankB') {
      return res.status(401).json({ err: 'You can not connect to bank' });
    }
    let checkSig = md5(req.body + ts);
    if (checkSig !== sig) {
      return res.status(401).json({ err: 'You can not access to bank' });
    }
    let bankBStk = 'bankb' + stk;
    req.body.stk = bankBStk;
    const account = await PaymentAccount.findOne({ stk: bankBStk });
    if (!account) {
      PaymentAccount.create({ stk: bankBStk, balance: 0 });
    }
    next();
  }
};
