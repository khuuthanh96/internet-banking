const express = require("express");
const router = express.Router();

const User = require("../models/user");
const Account = require("../models/account");

//check roles function
async function rolesAuthorized(uID, roles) {
    const u = await User.getUser(uID).then(user => user);

    for (let i = 0; i < roles.length; i++) {
        if (u.roles === roles[i]) {
            return true;
        };
    };
    return false;
};

router.get("/", (req, res) => res.json({ message: `Hello ${req.user.name}` }));

//=========================================USER=========================================
//get user info
router.get("/user/:id", (req, res) => {
    const id = req.params.id;

    User.getUser(id)
        .then(user => {
            if (!user) {
                return res.json({
                    user,
                    message: "userID not found",
                    success: false
                });
            };

            res.json({
                user,
                message: "success",
                success: true
            });
        })
        .catch(_ => {
            res.json({
                user: false,
                message: "userID not found",
                success: false
            });
        });
});

//get all user info
router.get("/user", async (req, res) => {
    const isAutho = await rolesAuthorized(req.user.uID, ["admin", "super"]);
    if (!isAutho) return res.json({ success: false, message: "Your role cannot access this api"});

    User.getAllUser()
        .then(users => {
            if (!users) {
                return res.json({
                    users,
                    message: "no user found",
                    success: false
                });
            };

            res.json({
                users,
                message: "success",
                success: true
            });
        })
        .catch(_ => {
            res.json({
                users: false,
                message: "no user found",
                success: false
            });
        });
});

//create new user
router.post("/user", async (req, res) => {
    const isAutho = await rolesAuthorized(req.user.uID, ["admin", "super"]);
    if (!isAutho) return res.json({ success: false, message: "Your role cannot access this api"});

    const {username, password, phone, email, name} = req.body;
    if (
        username === "" ||
        password === "" ||
        phone === "" ||
        email === "" ||
        name === ""
    ){
        return res.json({ success: false, message: "Has an required field was not filled in"});
    };

    User.signUp(username, password, name, phone, email)
    .then(u => {
        if (!u) return res.json({ success: false, message: "Registration failed: Internal error!"});

        res.json({success: true, message: "success"})
    })
    .catch(err => {
        res.json({ success: false, message: err.message});
    });
});

//=========================================ACCOUNT=========================================
//create new account
router.post("/account", async (req, res) => {
    const isAutho = await rolesAuthorized(req.user.uID, ["admin", "super"]);
    if (!isAutho) return res.json({ success: false, message: "Your role cannot access this api"});

    const {userID} = req.body;
    if (userID === "") return res.json({ success: false, message: "Has an required field was not filled in"});

    const newAcc = await Account.addAccount(userID);
    if(!newAcc) return res.json({ success: false, message: "Create new account failed"});

    res.json({ success: true, message: "success", account: newAcc });
});

//put account balance
router.put("/account/:accId",async (req, res) => {
    const isAutho = await rolesAuthorized(req.user.uID, ["admin", "super"]);
    if (!isAutho) return res.json({ success: false, message: "Your role cannot access this api"});

    const accId = req.params.accId;
    const {total} = req.body;

    const accountInfo = await Account.updateBalance(accId, parseInt(total), true);
    if(!accountInfo) return res.json({ success: false, message: "Update account's balance failed"});

    res.json({ success: true, message: "success", payload:{
        total: parseInt(total),
        accNumber: accountInfo.number
    }});    
});

//get account info
router.get("/account/:accId", async (req, res) => {
    const accId = req.params.accId;

    let account = await Account.getAccount(accId);
    if(!account) return res.json({ success: false, message: "Get account info failed"});

    if (req.user.uID != account.userID) { //check is account owner
        let accDoRequest = await Account.getAccount(req.user.uID); //check is super admin
        if (accDoRequest.roles !== "super") {
            delete account.balance;
        }
    };

    res.json({ success: true, message: "success", account });
});

//get all account
router.get("/account", async (req, res) => {
    const accounts = await Account.getAllAccount(req.user.uID);
    if(!accounts) return res.json({ success: false, message: "Get account list failed"});

    res.json({ success: true, message: "success", accounts })
});

//get all account with userID
router.get("/accounts/:userId", async (req, res) => {
    const userId = req.params.userId;
    const accounts = await Account.getAccountsUser(userId, req.user.uID);
    if(!accounts) return res.json({ success: false, message: "Get user's accounts failed"});
    
    res.json({ success: true, message: "success", accounts });
});

//delete account
router.delete("/account/:accId", async (req, res) => {
    const accId = req.params.accId;

    let account = await Account.getAccount(accId);
    if(!account) return res.json({ success: false, message: "Get account info failed"});

    if (account.userID != req.user.uID) {
        res.json({ success: false, message: "You don't have right" });
        return;
    }
    if (account.balance > 0) {
        res.json({ success: false, message: "Account's balance must be zero" });
        return;
    }

    const success = await Account.deleteAccount(accId);
    if (!success) {
        res.json({ success: false, message: "Closing account failed" });
        return;
    }

    res.json({ success: true, message: "success", account });
});

module.exports = router;