const axios = require('axios');
const md5 = require('md5');
const PaymentAccount = require('../models/paymentAccount');
const Customer = require('../models/customer');
const openpgp = require('openpgp');
const constant = require('../config/env');

exports.getRgpBank = async (req, res, next) => {
  try {
    console.log(req.body);
    let timestamp = Date.now();
    let sig = md5(timestamp + req.body + 'ThisKeyForHash');
    const response = await axios.post(
      'https://salty-meadow-17297.herokuapp.com/customer/query_information',
      req.body,
      {
        headers: {
          company_id: 'pawGDX1Ddu',
          timestamp: timestamp,
          'x-signature': sig,
        },
      }
    );
    res.json({ success: true, data: response.data.data });
    console.log(response);
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
    responsePgp(res, obj, 202);
  } catch (err) {
    let obj = { success: false };
    console.log(err);
    responsePgp(res, obj, 400);
  }
};

const responsePgp = async (res, obj, status) => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(constant.BANK_PRIVATE_KEY);
  await privateKey.decrypt(constant.PASSPHRASE);
  let object = JSON.stringify(obj);
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText(object), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
  });
  console.log(cleartext);
  const verified = await openpgp.verify({
    message: await openpgp.cleartext.readArmored(cleartext), // parse armored message
    publicKeys: (await openpgp.key.readArmored(constant.BANK_PUBLIC_KEY)).keys, // for verification
  });

  const { valid } = verified.signatures[0];
  console.log(valid);
  if (valid) {
    console.log('signed by key id ' + verified.signatures[0].keyid.toHex());
  } else {
    throw new Error('signature could not be verified');
  }
  const response = {
    cleartext: cleartext,
  };
  res.status(status).json(response);
};
