const mongoose = require("mongoose");
const shortid = require("shortid");
const { sendMail } = require("../lib/mailer");

const User = require("./user");
const Account = require("./account.js");

const DEFAULT_FEE = 1000;

const transactionSchema = mongoose.Schema({
    accountSrc: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Account", trim: true },
    accountDes: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Account", trim: true },
    total: { type: Number, default: 0 },
    description: { type: String },
    fee: { type: Number,default: DEFAULT_FEE, required: true },
    optcode: { type: String, default: shortid.generate },
    verify: { type: Boolean, default: false },
    feeCharger: { type: Boolean, default: true } // true: account source charge fee - false: account des charge fee
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

class Transaction extends TransactionModel {
    static async createTransaction(accountSrc, accountDes, total, description, feeCharger) {
        if (typeof total !== "number" && total <= 0 ) {
            return Promise.reject("total can not < 0!")
        };

        if(feeCharger === false) {
            total -= DEFAULT_FEE
        }
       
        const desAcc = await Account.getAccount(accountDes)
        if (!desAcc) {
            return Promise.reject("Account des not found")
        }
        const desUser = await User.getUser(desAcc.userID)

        const transaction = new Transaction({accountSrc, accountDes, total, description, feeCharger})
        return transaction.save()
            .then(trans => {
                sendMail(desUser.email, desUser.name, trans.optcode)

                const t = trans.toObject();
                t.accountDesNumber = desAcc.number;
                delete t.optcode;
                return t;
            })
            .catch(err => {
                console.log("createTransaction: save error ", err.message);
                return false;
            });
    }

    static verifyTransaction(transId, optcode) {
        return Transaction.findById(transId)
            .then(async (trans) => {
                if (!trans) return false;
                if(trans.verify) return false;
                if(trans.optcode !== optcode) return false;

                let success = true;
                if(trans.feeCharger) {
                    success = await Account.updateBalance(trans.accountSrc, trans.total + trans.fee, false)
                    if (!success) return false;
                    success = await Account.updateBalance(trans.accountDes, trans.total, true)
                    if (!success) return false;

                } else {
                    success = await Account.updateBalance(trans.accountSrc, trans.total, false)
                    if (!success) return false;
                    success = await Account.updateBalance(trans.accountDes, trans.total - trans.fee, true)
                    if (!success) return false;
                }
                
                return await Transaction.findByIdAndUpdate(transId, {$set: {verify: true}})
                    .then(res => res)
                    .catch(err => {
                        console.log("Transaction.verifyTransaction: got error", err)
                        return err.message;
                    })
            })
            .catch(err =>{
                console.log("Transaction.verifyTransaction: got err", err)
                return err.message;
            })
    }
};

module.exports = { Transaction, DEFAULT_FEE }; 