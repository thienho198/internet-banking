const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historySchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: ['Transfer', 'DeptPay', 'InternetBank'],
    default: 'Transfer',
  },
  operator: {
    type: String,
    required: true,
    enum: ['System', 'Customer'],
  },
  bankSender: {
    type: String,
    required: true,
    enum: ['G16BANK', 'RGPBANK', 'PGPBANK'],
    default: 'G16BANK',
  },
  amountOfMoney: {
    type: Number,
    required: true,
  },
  accountSender: {
    type: String,
  },
  sender: {
    type: String,
  },
  bankReceiver: {
    type: String,
    required: true,
    enum: ['G16BANK', 'RGPBANK', 'PGPBANK'],
    default: 'G16BANK',
  },
  accountReceive: {
    type: String,
  },
  receiver: {
    type: String,
  },
  message: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('History', historySchema);
