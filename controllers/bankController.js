const axios = require('axios');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');
const History = require('../models/history');
const customerController = require('./customerController');
const openpgp = require('openpgp');
const constant = require('../config/env');
const crypto = require('crypto');
const {
  signpgp,
  sendRequestRgp,
  verifyRgp,
  sendRequestPgp,
} = require('../utils/bankFunction');

exports.getRgpBank = async (req, res, next) => {
  try {
    console.log(req.body);
    const link =
      'https://salty-meadow-17297.herokuapp.com/customer/query_information';
    const response = await sendRequestRgp(req.body, link);
    res.json({ success: true, data: response.data.data });
  } catch (error) {
    res.json({ success: false });
    console.error(error);
  }
};

exports.getPgpBank = async (req, res, next) => {
  console.log(req.body);
  try {
    const link = 'https://wnc-api-banking.herokuapp.com/api/PGPBank/users';
    const response = await sendRequestPgp(req.body, link);
    res.json({ success: true, data: response.data.data });
  } catch (error) {
    res.json({ success: false });
    //console.error(error);
  }
};

exports.outerBankAddMoneyByStk = async (req, res, next) => {
  const {
    accountRequest,
    nameRequest,
    message,
    stk,
    amountOfMoney,
  } = req.body.data;
  let cleartext;
  if (!accountRequest || !nameRequest || !stk || !amountOfMoney) {
    let obj = { success: false, err: 'Please request with valid data' };
    cleartext = await signpgp(obj);
    res.status(400).json(cleartext);
  }
  const { company_id } = req.headers;
  try {
    const paymentAccount = await PaymentAccount.findOne({ stk: stk });
    paymentAccount.balance = paymentAccount.balance + amountOfMoney;
    await paymentAccount.save();
    const customer = await Customer.findOne({
      paymentAccountId: paymentAccount._id,
    });
    let transferAccount = await PaymentAccount.findOne({ stk: stk });
    if (company_id == process.env.RGP_ID) {
      await History.create({
        operator: 'Customer',
        accountSender: accountReq,
        sender: nameReq,
        accountReceive: stk,
        receiver: transferAccount.name,
        message,
        amountOfMoney,
        category: 'InternetBank',
        bankSender: 'RGPBANK',
      });
    }
    if (company_id == process.env.PGP_ID) {
      await History.create({
        operator: 'Customer',
        accountSender: accountReq,
        sender: nameReq,
        accountReceive: stk,
        receiver: transferAccount.name,
        message,
        amountOfMoney,
        category: 'InternetBank',
        bankSender: 'PGPBANK',
      });
    }
    let obj = { success: true, username: customer.name };
    cleartext = await signpgp(obj);
    res.status(202).json({ cleartext });
  } catch (err) {
    let obj = { success: false };
    console.log(err);
    cleartext = await signpgp(obj);
    res.status(400).json({ cleartext });
  }
};

exports.bankTransferPgp = async (req, res, next) => {
  const { des_username, value, message, otpcode } = req.body.data;
  if ((!des_username, !value, !otpcode)) {
    res
      .status(400)
      .json({ success: false, err: 'Please request with valid data' });
  }
  const bank_company_id = process.env.HEADER_COMPANYID;
  const accessToken = req.headers['x-access-token'];
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
      const allFee = value + parseInt(process.env.FEETRANSFER);
      if (userAccount.balance < allFee)
        return res
          .status(406)
          .json({ success: false, err: 'You dont have enough money' });
      body = {
        data: {
          des_username,
          value,
          message,
          bank_company_id,
          source_username: userAccount.stk,
          source_name: customer.name,
        },
      };
      try {
        const cleartext = await signpgp(body);
        console.log('clearTEXT ', cleartext);
        const link =
          'https://salty-meadow-17297.herokuapp.com/customer/recharge';
        const responseData = await sendRequestRgp({ cleartext }, link);
        const re = responseData.data;
        const data = JSON.stringify(re.data);
        // const verify = crypto.createVerify('SHA256');
        // verify.write(data);
        // verify.end();
        // let check = verify.verify(constant.RGP_PUBLICKEY, re.signature, 'hex');
        let check = await verifyRgp(data, constant.RGP_PUBLICKEY, re.signature);
        if (check === true) {
          userAccount.balance = userAccount.balance - allFee;
          customer.OTP = undefined;
          await History.create({
            operator: 'Customer',
            accountSender: userAccount.stk,
            sender: userAccount.name,
            accountReceive: des_username,
            message,
            amountOfMoney: value,
            category: 'InternetBank',
            bankReceiver: 'PGPBANK',
          });
          await userAccount.save();
          await customer.save();
          res.status(200).json({ success: true, re });
        }
        res.status(400).json({ success: false, err: 'Wrong verify' });
      } catch (err) {
        res.status(400).json({ success: false, err });
      }
    }
  );
};

// const signpgp = async (obj) => {
//   const {
//     keys: [privateKey],
//   } = await openpgp.key.readArmored(constant.BANK_PRIVATE_KEY);
//   await privateKey.decrypt(constant.PASSPHRASE);
//   let object = JSON.stringify(obj);
//   const { data: cleartext } = await openpgp.sign({
//     message: openpgp.cleartext.fromText(object), // CleartextMessage or Message object
//     privateKeys: [privateKey], // for signing
//   });
//   return cleartext;
// };

// const sendRequestPgp = async (body, link) => {
//   let timestamp = Date.now();
//   let sig = md5(timestamp + body + 'ThisKeyForHash');
//   const request = await axios.post(link, body, {
//     headers: {
//       company_id: 'pawGDX1Ddu',
//       timestamp: timestamp,
//       'x-signature': sig,
//     },
//   });
//   return request;
// };
