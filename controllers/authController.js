const Customer = require('../models/customer');
const randToken = require('rand-token');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendEmail');
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const customer = await Customer.findOne({ email }).select('+password');
  if (!customer) {
    return res
      .status(401)
      .json({ error: 'Authentication invalid, please try again' });
  }

  const isMatch = await customer.mathPassword(password);
  if (!isMatch) {
    return res
      .status(401)
      .json({ error: 'Authentication invalid, please try again' });
  }
  const accesstoken = customer.SignJwtToken();
  const refreshToken = randToken.generate(process.env.REFRESH_TOKEN);
  customer.refreshToken = refreshToken;
  await customer.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
    accesstoken,
    refreshToken,
  });
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
