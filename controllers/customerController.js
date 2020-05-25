const generator = require("creditcard-generator");
const bcrypt = require("bcryptjs");

const PaymentAccount = require("../models/paymentAccount");
const Customer = require("../models/customer");


exports.getListDeptReminderWasRemined = (req, res, next)=>{
  const customerId = req.query.id;
  Customer.findById(customerId)
  .then(customer=>{
    return customer
    .populate(['listDeptReminders.deptReminderId','paymentAccountId'])
    .execPopulate();
  })
  .then(customer=>{
    console.log('123',customer)
    const listDeptReminders = customer.listDeptReminders
    .filter(reminder=>{
      if(reminder.deptReminderId.stkWasRemined === customer.paymentAccountId.stk){
        return true;
      }
      return false;
    });
    //listDeptReminders = listDeptReminders.map(item=>item.deptReminderId._doc)
    res.json(listDeptReminders);
  })
  .catch(err=>console.log(err))
}
exports.getListDeptReminderRemind = (req, res, next)=>{
  const customerId = req.query.id;
  Customer.findById(customerId)
  .then(customer=>{
    return customer
    .populate(['listDeptReminders.deptReminderId','paymentAccountId'])
    .execPopulate();
  })
  .then(customer=>{
    console.log('123',customer.listDeptReminders)
    const listDeptReminders = customer.listDeptReminders
    .filter(reminder=>{
      if(reminder.deptReminderId.stkRemind === customer.paymentAccountId.stk){
        return true;
      }
      return false;
    });
    //listDeptReminders = listDeptReminders.map(item=>item.deptReminderId._doc)
    res.json(listDeptReminders);
  })
  .catch(err=>console.log(err))
}

exports.postCreateCustomer = (req, res, next) => {
  const { name, email, phoneNumber, password } = req.body;
  const stk = generator.GenCC("VISA", 1).toString();
  const balance = 0;
  const paymentAccount = new PaymentAccount({
    stk: stk,
    balance: balance,
  });
  paymentAccount
    .save()
    .then((account) => {
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const customer = new Customer({
            name: name,
            email: email,
            paymentAccountId: account._id,
            phoneNumber: phoneNumber,
            password: hashedPassword,
          });
          return customer.save();
        })
        .catch((err) => console.log(err));
    })
    .then(() => {
      res.json({ success: true });
    })
    .catch((err) => {
      console.log(err);
      res.json({ success: false });
    });
};
