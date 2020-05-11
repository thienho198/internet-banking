const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const paymentAccountSchema = new Schema({
  stk: {
    type: Schema.Types.String,
    require: true,
  },
  balance: {
    type: Schema.Types.Number,
    require: true,
  },
});

module.exports = mongoose.model("PaymentAccount", paymentAccountSchema);
