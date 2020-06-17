const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: Schema.Types.String,
    require: true,
  },
  password: {
    type: Schema.Types.String,
    require: [true, 'Please add a password'],
    select: false,
  },
  email: {
    type: Schema.Types.String,
    require: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  phoneNumber: {
    type: Schema.Types.String,
    require: true,
  },
  paymentAccountId: {
    type: Schema.Types.ObjectId,
    ref: 'PaymentAccount',
    require: true,
  },
  refreshToken: String,
  listDeptReminders: [
    {
      deptReminderId: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'DeptReminder',
      },
    },
  ],
});

//Only allow one email to register
customerSchema.plugin(uniqueValidator, { message: 'is already taken.' });

//Encrypt password before create model
customerSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  this.password = await bcrypt.hash(this.password, 12);
});

//Sign JWT
customerSchema.methods.SignJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Math user enter password
customerSchema.methods.mathPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Customer', customerSchema);
