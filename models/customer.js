const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const customerSchema = new Schema({
  name: {
    type: Schema.Types.String,
    require: true,
  },
  password: {
    type: Schema.Types.String,
    require: true,
  },
  email: {
    type: Schema.Types.String,
    require: true,
  },
  phoneNumber: {
    type: Schema.Types.String,
    require: true,
  },
  paymentAccountId: {
    type: Schema.Types.ObjectId,
    ref: "PaymentAccount",
    require: true,
  },
});

module.exports = mongoose.model("Customer", customerSchema);
