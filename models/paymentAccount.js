const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentAccountSchema = new Schema({
  stk: {
    type: Schema.Types.String,
    require: true,
    unique: true,
  },
  balance: {
    type: Schema.Types.Number,
    require: true,
  },
  name: {
    type: Schema.Types.String,
    require: true,
  },
});

module.exports = mongoose.model('PaymentAccount', paymentAccountSchema);
