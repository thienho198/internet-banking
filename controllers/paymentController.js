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
