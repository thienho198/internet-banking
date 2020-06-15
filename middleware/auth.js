const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const PaymentAccount = require('../models/paymentAccount');
const md5 = require('md5');
const crypto = require('crypto');
const openpgp = require('openpgp');
const { response } = require('express');
const constant = require('../config/env');

exports.protect = async (req, res, next) => {
  let token;
  console.log(constant.RGP_PUBLICKEY);
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
    console.log(decoded);
    req.customer = await Customer.findById(decoded.id);
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ err: 'You need to login before access this route' });
  }
};

//Verify outter bank
exports.protectBank = async (req, res, next) => {
  if (!req.headers.company_id) {
    return res.status(401).json({ err: 'You dont allow to access' });
  } else {
    protectBank(req, res, next);
    next();
  }
};

exports.protectKey = async (req, res, next) => {
  try {
    let data = JSON.stringify(req.body.data);
    let signature = req.body.signature;
    console.log('data: ' + data);
    console.log('sig: ' + req.body.signature);
    const verify = crypto.createVerify('SHA256');
    verify.write(data);
    verify.end();
    let check = verify.verify(constant.RGP_PUBLICKEY, signature, 'hex');
    console.log('check' + check);
    if (check) {
      next();
    }
    return res
      .status(401)
      .json({ err: 'Wrong verify. You dont allow to access' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: error });
  }
};

const protectBank = async (req, res, next) => {
  const sig = req.headers.sig;
  const ts = req.headers.ts;
  if (req.headers.company_id !== process.env.RGP_ID) {
    return res.status(401).json({ err: 'Wrong input identify' });
  }
  if (Date.now() - ts > 600000) {
    return res.status(401).json({ err: 'Time expire' });
  }
  let checkSig = md5(req.body + ts + process.env.RGP_SECRET_KEY);
  if (checkSig !== sig) {
    return res.status(401).json({ err: 'Wrong sig' });
  }
};
