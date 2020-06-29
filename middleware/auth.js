const jwt = require('jsonwebtoken');
const Customer = require('../models/customer');
const Banker = require('../models/customer');
const PaymentAccount = require('../models/paymentAccount');
const md5 = require('md5');
const crypto = require('crypto');
const openpgp = require('openpgp');
const { response } = require('express');
const constant = require('../config/env');
const { verifyRgp } = require('../utils/bankFunction');

exports.protect = async (req, res, next) => {
  let token = req.headers['x-access-token'];
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
    console.log(err);
    return res
      .status(401)
      .json({ err: 'You need to login before access this route' });
  }
};

exports.verifyBanker = async (req, res, next) => {
  let token = req.headers['x-access-token'];
  if (!token) {
    return res.status(401).json({ err: 'You have no right to access' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.banker = await Banker.findById(decoded.id);
    next();
  } catch (err) {
    return res.status(401).json({ err: 'You have no right to access' });
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

exports.protectRgp = async (req, res, next) => {
  try {
    let data = JSON.stringify(req.body.data);
    let signature = req.body.signature;
    console.log('data: ' + data);
    console.log('sig: ' + req.body.signature);
    // const verify = crypto.createVerify('SHA256');
    // verify.write(data);
    // verify.end();
    // let check = verify.verify(constant.RGP_PUBLICKEY, signature, 'hex');
    let check = await verifyRgp(data, constant.RGP_PUBLICKEY, signature);
    if (check) {
      next();
    } else {
      return res
        .status(401)
        .json({ err: 'Wrong verify. You have no right to access' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ err: error });
  }
};

exports.protectPgp = async (req, res, next) => {
  try {
  } catch (error) {}
};

const protectBank = async (req, res, next) => {
  const { sig, ts, company_id } = req.headers;
  if (company_id !== process.env.RGP_ID || company_id !== process.env.PGP_ID) {
    return res.status(401).json({ err: 'Wrong input identify' });
  }
  if (Date.now() - ts > 600000) {
    return res.status(401).json({ err: 'Time expire' });
  }
  let checkSig;
  if (company_id == process.env.RGP_ID)
    checkSig = md5(req.body + ts + process.env.RGP_SECRET_KEY);
  else checkSig = md5(req.body + ts + process.env.PGP_SECRET_KEY);
  if (checkSig !== sig) {
    return res.status(401).json({ err: 'Wrong sig' });
  }
};
