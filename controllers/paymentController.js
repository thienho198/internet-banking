const PaymentAccount = require("../models/paymentAccount");
const Customer = require("../models/customer");

exports.getCustomerByPaymentAccount = (req, res, next) => {
    const stk = req.query.stk;
    PaymentAccount.findOne({ stk: stk })
        .then(paymentAccount => {
            return paymentAccount
                .populate('Customer')
                .execPopulate();
        })
        .then(paymentAccount => {
            Customer.findOne({ paymentAccountId: paymentAccount._id }).select({
                name: 1,
            }).exec((err, customer) => {
                if (err) {
                    res.status(400).json({
                        sesult: 'fail',
                        data: {},
                        message: err,
                    })
                } else {
                    res.status(200).json({
                        resultl: 'success',
                        data: customer,
                        message: 'found',
                    })
                }
            })
        })
        .catch(err => console.log(err));
}

exports.addMoneyByStk =  async (req, res,next)=>{
    const {stk, amountOfMoney} = req.body;
    try {
        const paymentAccount = await PaymentAccount.findOne({stk:stk});
    paymentAccount.balance = paymentAccount.balance + amountOfMoney ;
    await paymentAccount.save();
    res.status(200).json({ success: true, currentBalance: paymentAccount.balance})
    }
    catch(err){
        console.log(err);
        res.status(400).json({ success: false, message:'server error'})
    }
  }