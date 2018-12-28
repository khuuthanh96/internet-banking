const mongoose = require("mongoose");
const Transaction = require("./transaction");
const User = require("./user");

const autoIncrement = require('mongoose-auto-increment');
const connection = mongoose.createConnection(process.env.DATABASE_LOCAL_URL);

const ActiveAccount = true,
      ClosedAccount = false

autoIncrement.initialize(connection);

const accountSchema = new mongoose.Schema({
    userID: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User", trim: true },
    number: { type: Number, required: true, unique: true },
    balance: { type: Number, default: 0 },
    historyTransaction: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction"}],
    status: { type: Boolean, default: true } //account open or closed state
});

accountSchema.plugin(autoIncrement.plugin, { 
    model: 'Account', 
    field: 'number',
    startAt: 1000000000,
    incrementBy: 1
})

const AccountModel = connection.model('Account', accountSchema);

class Account extends AccountModel {
    static async addAccount(userID) {
        const user = await User.getUser(userID);
        if (!user) return false;

        const account = new Account({ userID });
        return account.save()
            .catch(err => {
                console.log("Account.addAccount: got error: ", err.message);
                return false;
            });
    }

    static async doTransaction(accountSrc, accountDes, total) {
        let account;
        //check account exist
        account = await this.getAccount(accountDes);
        if (!account) return false;

        account = await this.getAccount(accountSrc);
        if (!account) return false;

        //check balance
        if(total >= account.balance) return false

        //update balance
        account = await this.updateBalance(accountSrc, total, false);
        if (!account) return false;

        account = await this.updateBalance(accountDes, total, true);
        if (!account) return false;

        let trans = await Transaction.createTransaction(accountSrc, accountDes, total);
        if(!trans) return false;

        trans = await this.addTransaction(accountSrc, trans._id)
        if(!trans) return false;

        return trans;
    };

    static getAccount(accountId) {
        return Account.findOne({ _id: accountId, status: ActiveAccount })
            .then(async (account) => {
                if (!account) return false;
                const acc = account.toObject();

                const user = await User.getUser(acc.userID);
                if(!user) {
                    acc.owner = "";
                    acc.phone = "";
                    acc.email = "";
                }
    
                acc.owner = user.name;
                acc.phone = user.phone;
                acc.email = user.email;
    
                return acc;
            })
            .catch(err => {
                console.log("Account.find: got error: ", err.message);
                return false;
            });
    };

    static async getAllAccount(doerID) {
        const doer = await User.getUser(doerID);
        return Account.find({ status: ActiveAccount })
            .then(accounts => {
                if(doer.roles !== "super") {
                    return accounts.map(acc => {
                        acc = acc.toObject();
                        delete acc.balance;
                        return acc
                    })
                }
                return accounts;
            })
            .catch(err => {
                console.log("Account.getAllAccount: ", err.message);
                return false;
            })
    };

    static async getAccountsUser(userID, doerID) {
        const user = await User.getUser(userID);
        const doer = await User.getUser(doerID);
        return Account.find({ userID, status: ActiveAccount })
            .then(accounts => {
                if (userID !== doerID && doer.roles === "user" || doer.roles === "admin") {
                    return accounts.map(acc => {
                        acc = acc.toObject();
                        delete acc.balance;
                        delete acc.historyTransaction;

                        acc.owner = user.name;
                        acc.phone = user.phone;
                        acc.email = user.email;
                        return acc
                    })
                }
                return accounts.map(acc => {
                    acc = acc.toObject();
                    
                    acc.owner = user.name;
                    acc.phone = user.phone;
                    acc.email = user.email;
                    return acc
                })
            })
            .catch(err => {
                console.log("Account.getAccountsUser: ", err.message);
                return false;
            });
    };

    //type = true: user add balance, type = false: user minus balance
    //default is false
    static async updateBalance(accountId, total, type) {
        type = type || false;

        const account = await this.getAccount(accountId);
        if (!account) return false;

        if(total <= 0) return false;

        let newBalance = 0;
        if (type) {
            newBalance = account.balance + total;
        } else {
            if(total >= account.balance) return false;

            newBalance = account.balance - total;
        };

        return Account.findByIdAndUpdate(accountId, {$set: { balance: newBalance }})
            .then(res => res)
            .catch(err => {
                console.log("Account.updateBalance: got error: ", err.message);
                return false
            });
    };

    static async addTransaction(accountId, transId) {
        const account = await this.getAccount(accountId);
        if (!account) return false;

        account.historyTransaction.push(transId); //add transaction

        return Account.findByIdAndUpdate(accountId, {$set: { historyTransaction: account.historyTransaction }})
            .catch(err => {
                console.log("Account.addTransaction: got error: ", err.message)
            });
    };

    static deleteAccount(accountId) {
        return Account.findByIdAndUpdate(accountId, {$set: { status: ClosedAccount }})
        .then(res => res)
        .catch(err => {
            console.log("Account.deleteAccount: got error: ", err.message);
            return false
        });
    }
};

module.exports = Account;