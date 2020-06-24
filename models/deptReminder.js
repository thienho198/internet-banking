const mongoose = require('mongoose');
const Customer = require('./customer');
const PaymentAccount = require('./paymentAccount');
const Schema = mongoose.Schema;

const deptReminderSchema = new Schema({
  amountOfMoney: {
    type: Schema.Types.Number,
    require: true,
  },
  content: {
    type: Schema.Types.String,
    require: true,
  },
  stkRemind: {
    type: Schema.Types.String,
    required: true,
  },
  stkWasRemined: {
    type: Schema.Types.String,
    required: true,
  },
  status: {
    type: Schema.Types.String,
    enum: ['paid', 'unpaid'],
    default: 'unpaid',
    required: true,
  },
});

// deptReminderSchema.pre('remove', async function (next) {
//   console.log('remove dept in customer');
//   console.log(this.message);
//   id = this._id;
//   console.log(id);
//   const stkremind = await PaymentAccount.findOne({ stk: this.stkRemind });
//   const stkwasremined = await PaymentAccount.findOne({
//     stk: this.stkWasRemined,
//   });
//   const customerRemind = await Customer.findOne({
//     paymentAccountId: stkremind,
//   });
//   const customerWasRemined = await Customer.findOne({
//     paymentAccountId: stkwasremined,
//   });
//   console.log(customerRemind);
//   const listRemindUpdate = customerRemind.listDeptReminders.filter(
//     (item) => item.deptReminderId.toString() !== id.toString()
//   );
//   const listWasRemindUpdate = customerWasRemined.listDeptReminders.filter(
//     (item) => item.deptReminderId.toString() !== id.toString()
//   );
//   const customerRemindNotify = customerRemind.notifications
//   customerRemind.listDeptReminders = listRemindUpdate;
//   customerWasRemined.listDeptReminders = listWasRemindUpdate;
//   await customerWasRemined.save();
//   await customerRemind.save();
//   console.log(asd);
//   next();
// });

module.exports = mongoose.model('DeptReminder', deptReminderSchema);
