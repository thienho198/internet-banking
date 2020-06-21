const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const bankerSchema = new Schema({
  name: {
    type: Schema.Types.String,
    require: [true, 'Please add name'],
  },
  password: {
    type: Schema.Types.String,
    require: [true, 'Please add a password'],
    select: false,
  },
  email: {
    type: Schema.Types.String,
    require: [true, 'Please add email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  role: {
    type: String,
    enum: ['employee', 'admin'],
    default: 'employee',
  },
  refreshToken: String,
  resetPasswordToken: String,
});

//Only allow one email to register
bankerSchema.plugin(uniqueValidator, {
  message: 'This email is already registerd in bank.',
});

//Encrypt password before create model
bankerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

//Sign JWT
bankerSchema.methods.SignJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Math user enter password
bankerSchema.methods.mathPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Banker', bankerSchema);
