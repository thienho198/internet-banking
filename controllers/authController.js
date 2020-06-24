const Customer = require('../models/customer');
const Banker = require('../models/banker');
const PaymentAccount = require('../models/paymentAccount');
const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
const e = require('express');
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let user = await Customer.findOne({ email }).select('+password');
  let userAccess = 'customer';
  if (!user) {
    user = await Banker.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        error: 'Authentication invalid, please try again',
        isLogin: true,
      });
    }
    if (user.role === 'employee') userAccess = 'employee';
    else userAccess = 'admin';
  }
  const isMatch = await user.mathPassword(password);
  if (!isMatch) {
    return res.status(401).json({
      error: 'Authentication invalid, please try again',
      isLogin: true,
    });
  }
  const accesstoken = user.SignJwtToken();
  const refreshToken = randToken.generate(process.env.REFRESH_TOKEN);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  if (userAccess === 'customer') {
    let paymentAccount = await PaymentAccount.findById(user.paymentAccountId);
    res.status(200).json({
      success: true,
      userAccess,
      email,
      id: user.id,
      name: user.name,
      stk: paymentAccount.stk,
      accesstoken,
      refreshToken,
    });
  } else {
    res.status(200).json({
      success: true,
      userAccess,
      name: user.name,
      accesstoken,
      refreshToken,
    });
  }
};

exports.refresh = async (req, res, next) => {
  const { refreshToken, accessToken } = req.body;
  jwt.verify(
    accessToken,
    process.env.JWT_SECRET,
    { ignoreExpiration: true },
    async function (err, payload) {
      const { id } = payload;
      let user = await Customer.findById(id);
      if (!user) {
        user = await Banker.findById(id);
        if (!user)
          res.status(400).json({ success: false, err: 'User not exists' });
      }
      if (user.refreshToken === refreshToken) {
        const newAccessToken = user.SignJwtToken();
        res.status(202).json({ accessToken: newAccessToken, refreshToken });
      }
    }
  );
};

exports.forgotPassword = async (req, res, next) => {
  const customer = await Customer.findOne({ email: req.body.email });
  if (!customer) {
    return res.status(401).json({ success: false, err: 'Invalid email!' });
  }
  resetToken = jwt.sign({ time: Date.now() }, process.env.RESETPASS_SECRET, {
    expiresIn: process.env.RESETJWT_EXPIRE,
  });
  customer.resetPasswordToken = resetToken;
  await customer.save({ validateBeforeSave: false });
  const resetUrl = `${req.protocol}://${req.get(
    'host'
  )}/auth/resetpassword/${resetToken}`;
  const message = `Access ${resetUrl} to reset password`;
  try {
    await sendEmail({
      email: customer.email,
      subject: 'Password reset token',
      message,
    });
    res.status(200).json({ success: true, data: 'Email sent' });
  } catch (err) {
    customer.resetPasswordToken = undefined;
    await customer.save({ validateBeforeSave: false });
    res.status(500).json({ err: 'Email could not be sent' });
  }
};

exports.resetPassword = async (req, res, next) => {
  const resetToken = req.params.resettoken;
  try {
    const decoded = jwt.verify(resetToken, process.env.RESETPASS_SECRET);
    const customer = await Customer.findOne({
      resetPasswordToken: req.params.resettoken,
    });
    if (!customer) {
      res.json({ err: 'Invalid token' });
    }
    customer.password = req.body.password;
    customer.resetPassword = undefined;
    await customer.save();
    res.status(200).json({ success: true, customer });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};
