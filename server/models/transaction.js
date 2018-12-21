const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema({
    accountSrc: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Account", trim: true },
    accountDes: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Account", trim: true },
    total: {type: Number, default: 0}
}, {
    timestamps: true
});

const TransactionModel = mongoose.model('Transaction', transactionSchema);

class Transaction extends TransactionModel {
    static createTransaction(accountSrc, accountDes, total) {
        if (typeof total !== "number" && total <= 0 ) {
            return Promise.reject("total can not < 0!")
        };

        const transaction = new Transaction({accountSrc, accountDes, total})
        return transaction.save()
            .catch(err => {
                console.log("createTransaction: save error ", err.message);
                return false;
            });
    }
};

module.exports = Transaction;