const Customer = require("../models/customer");
const DeptReminder = require('../models/deptReminder');
const PaymentAccount = require('../models/paymentAccount');



exports.createDeptReminder =  async(req, res, next) => {
    const { stkRemind, stkWasRemined, amountOfMoney, content } = req.body;
    try {
        const deptReminder = new DeptReminder({ amountOfMoney: amountOfMoney, stkWasRemined: stkWasRemined, content: content, stkRemind: stkRemind });
        const deptReminderMG = await deptReminder.save();

        //for was reminded
        const paymentAccountIdWasRemined = await PaymentAccount.findOne({ stk: deptReminderMG.stkWasRemined }, '_id');
        console.log('haha',paymentAccountIdWasRemined);
        const customerWasRemined = await Customer.findOne({ paymentAccountId: paymentAccountIdWasRemined });
        const listDeptRemindersUpdate = customerWasRemined.listDeptReminders ;
        listDeptRemindersUpdate.push({deptReminderId:deptReminderMG._id});
        customerWasRemined.listDeptReminders = listDeptRemindersUpdate;
        await customerWasRemined.save();

        //for remind
        const paymentAccountIdRemind = await PaymentAccount.findOne({ stk: deptReminderMG.stkRemind }, '_id');
        console.log('haha',paymentAccountIdRemind);
        const customerRemind = await Customer.findOne({ paymentAccountId: paymentAccountIdRemind });
        const listDeptRemindersUpdate1 = customerRemind.listDeptReminders ;
        listDeptRemindersUpdate1.push({deptReminderId:deptReminderMG._id});
        customerRemind.listDeptReminders = listDeptRemindersUpdate1;
        await customerRemind.save();


        //console.log(customerWasRemined);
        res.json({ success: true })
    }
    catch (err) {
        console.log(err)
    }

}