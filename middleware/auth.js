const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const PaymentAccount = require('../models/paymentAccount');
const md5 = require('md5');

exports.protect = (req, res, next) => {
  protect(req, res, next);
};

//Verify outter bank
exports.protectBank = async (req, res, next) => {
  if (!req.headers.company_id) {
    protect(req, res, next);
  } else {
    const { stk } = req.body;
    console.log(req.body);
    const sig = req.headers.sig;
    const ts = req.headers.ts;
    if (req.headers.company_id !== process.env.HEADER_COMPANYID) {
      return res.status(401).json({ err: 'Wrong input identify' });
    }
    if (Date.now() - ts > 600000) {
      return res.status(401).json({ err: 'Time expire' });
    }
    let checkSig = md5(req.body + ts + process.env.SECRET_KEY);
    if (checkSig !== sig) {
      return res.status(401).json({ err: 'Wrong sig' });
    }
    next();
  }
};

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization) {
    token = req.headers.authorization;
  }
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
