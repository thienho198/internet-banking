const axios = require('axios');
const md5 = require('md5');
const PaymentAccount = require('../models/paymentAccount');
const openpgp = require('openpgp');
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
  console.log(stk);
  try {
    const paymentAccount = await PaymentAccount.findOne({ stk: stk });
    console.log(paymentAccount);
    paymentAccount.balance = paymentAccount.balance + amountOfMoney;
    console.log(paymentAccount.balance);
    await paymentAccount.save();
    let obj = { success: true };
    responsePgp(obj, 202);
  } catch (err) {
    let obj = { success: false };
    console.log(err);
    responsePgp(obj, 400);
  }
};

const responsePgp = async (obj, status) => {
  const {
    keys: [privateKey],
  } = await openpgp.key.readArmored(process.env.BANK_PRIVATE_KEY);
  await privateKey.decrypt(process.env.PASSPHRASE);
  let object = JSON.stringify(obj);
  const { data: cleartext } = await openpgp.sign({
    message: openpgp.cleartext.fromText(object), // CleartextMessage or Message object
    privateKeys: [privateKey], // for signing
  });
  const response = {
    cleartext: cleartext,
  };
  res.status(status).json(response);
};
