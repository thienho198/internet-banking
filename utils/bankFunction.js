const openpgp = require('openpgp');
const crypto = require('crypto');
const constant = require('../config/env');
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
  sendRequestPgp,
  verifyRgp,
};
