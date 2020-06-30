const openpgp = require('openpgp');
const crypto = require('crypto');
const constant = require('../config/env');
const moment = require('moment');
const cryptoJS = require('crypto-js');
const axios = require('axios');
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
  let ts = moment().unix();
  let sign = cryptoJS.HmacSHA256(
    ts + JSON.stringify(body),
    process.env.SECRET_KEY
  );
  let request = await axios.post(link, body, {
    headers: {
      'partner-code': 2,
      ts,
      sign,
    },
  });
  console.log(request);
  return request;
};

const sendRequestRgp = async (body, link) => {
  let ts = Date.now();
  let sig = md5(timestamp + body + process.env.SECRET_KEY);
  let request = await axios.post(link, body, {
    headers: {
      company_id: process.env.HEADER_COMPANYID,
      timestamp: timestamp,
      'x-signature': sig,
    },
  });
  return request;
};

const verifyRgp = async (data, RGP_PUBLICKEY, signature) => {
  const verify = crypto.createVerify('SHA256');
  verify.write(data);
  verify.end();
  let check = verify.verify(RGP_PUBLICKEY, signature, 'hex');
  return check;
};

const verifyPgp = async (cleartext, publicKeyArmored) => {
  const verified = await openpgp.verify({
    message: await openpgp.cleartext.readArmored(cleartext), // parse armored message
    publicKeys: (await openpgp.key.readArmored(publicKeyArmored)).keys, // for verification
  });
  const { valid } = verified.signatures[0];
  return valid;
};

module.exports = {
  signpgp,
  sendRequestRgp,
  verifyRgp,
  sendRequestPgp,
};
