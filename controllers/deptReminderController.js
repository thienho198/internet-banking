const Customer = require('../models/customer');
const DeptReminder = require('../models/deptReminder');
const PaymentAccount = require('../models/paymentAccount');

exports.createDeptReminder = async (req, res, next) => {
  const { stkWasRemined, amountOfMoney, content } = req.body;
  const accountCustomer = await PaymentAccount.findById(
    req.customer.paymentAccountId
  );
  const accountWasReminded = await PaymentAccount.findOne({
    stk: stkWasRemined,
  });
  const stkRemind = accountCustomer.stk;
  try {
    const deptReminder = new DeptReminder({
      amountOfMoney: amountOfMoney,
      stkWasRemined: stkWasRemined,
      nameReminded: accountWasReminded.name,
      content: content,
      stkRemind: stkRemind,
      nameRemind: req.customer.name,
    });
    const deptReminderMG = await deptReminder.save();

    //for was reminded
    const paymentAccountIdWasRemined = await PaymentAccount.findOne(
      { stk: deptReminderMG.stkWasRemined },
      '_id'
    );
    const customerWasRemined = await Customer.findOne({
      paymentAccountId: paymentAccountIdWasRemined,
    });
    const listDeptRemindersUpdate = customerWasRemined.listDeptReminders;
    listDeptRemindersUpdate.push({ deptReminderId: deptReminderMG._id });
    customerWasRemined.listDeptReminders = listDeptRemindersUpdate;
    await customerWasRemined.save();

    //for remind
    const paymentAccountIdRemind = await PaymentAccount.findOne(
      { stk: deptReminderMG.stkRemind },
      '_id'
    );
    const customerRemind = await Customer.findOne({
      paymentAccountId: paymentAccountIdRemind,
    });
    const listDeptRemindersUpdate1 = customerRemind.listDeptReminders;
    listDeptRemindersUpdate1.push({ deptReminderId: deptReminderMG._id });
    customerRemind.listDeptReminders = listDeptRemindersUpdate1;
    await customerRemind.save();

    //console.log(customerWasRemined);
    res.json({ success: true });
  } catch (err) {
    console.log(err);
  }
};
