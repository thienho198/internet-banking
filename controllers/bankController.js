const axios = require('axios');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');
const customerController = require('./customerController');
const openpgp = require('openpgp');
const constant = require('../config/env');
const crypto = require('crypto');

exports.getRgpBank = async (req, res, next) => {
  try {
    console.log(req.body);
    const link =
      'https://salty-meadow-17297.herokuapp.com/customer/query_information';
    const response = await sendRequestPgp(req.body, link);
    res.json({ success: true, data: response.data.data });
  } catch (error) {
    res.json({ success: false });
    console.error(error);
  }
};

exports.rgpAddMoneyByStk = async (req, res, next) => {
  const { stk, amountOfMoney } = req.body.data;
  try {
    const paymentAccount = await PaymentAccount.findOne({ stk: stk });
    console.log(paymentAccount);
    paymentAccount.balance = paymentAccount.balance + amountOfMoney;
    console.log(paymentAccount.balance);
    await paymentAccount.save();
    const customer = await Customer.findOne({
      paymentAccountId: paymentAccount._id,
    });
    let obj = { success: true, username: customer.name };
    const cleartext = await signpgp(obj);
    res.status(202).json({ cleartext });
  } catch (err) {
    let obj = { success: false };
    console.log(err);
    const cleartext = await signpgp(obj);
    res.status(400).json({ cleartext });
  }
};

exports.bankTransferPgp = async (req, res, next) => {
  const { des_username, value, message, otpcode } = req.body.data;
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
        const responseData = await sendRequestPgp({ cleartext }, link);
        const re = responseData.data;
        const data = JSON.stringify(re.data);
        const verify = crypto.createVerify('SHA256');
        verify.write(data);
        verify.end();
        let check = verify.verify(constant.RGP_PUBLICKEY, re.signature, 'hex');
        if (check === true) res.json({ success: true, re });
        res.json({ success: false, err: 'Wrong verify' });
      } catch (err) {
        res.json({ success: false, err });
      }

      // transferAccount.balance = transferAccount.balance + amountOfMoney;
      // userAccount.balance = userAccount.balance - allFee;
      // customer.OTP = undefined;
      // await customer.save();
      // await userAccount.save();
      // await transferAccount.save();
      // return res.json({ userAccount, transferAccount, message });
    }
  );
};

const signpgp = async (obj) => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(constant.BANK_PRIVATE_KEY);
  await privateKey.decrypt(constant.PASSPHRASE);
  let object = JSON.stringify(obj);
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText(object), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
  });
  return cleartext;
};

const sendRequestPgp = async (body, link) => {
  let timestamp = Date.now();
  let sig = md5(timestamp + body + 'ThisKeyForHash');
  const request = await axios.post(link, body, {
    headers: {
      company_id: 'pawGDX1Ddu',
      timestamp: timestamp,
      'x-signature': sig,
    },
  });
  return request;
};
