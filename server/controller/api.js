const express = require("express");
const router  = express.Router();

const User = require("../models/user");

router.get("/", (req, res) => res.json({message: `Hello ${req.user.name}`}));

//=========================================USER=========================================
router.get("/user/:id", (req, res) => {
    const id = req.params.id;
    User.findById(id)
    .then(user => {
        if (!user) {
            return res.json({
                user: false,
                message: "userID not found"
            })
        }
        let u = user.toObject()
        delete u.password;
        res.json({
            user: u,
            message: "success"
        })
    })
    .catch(err => {
        console.log(`/user/:id -> User.findById: ${err}`);
        res.json({
            user: false,
            message: "userID not found"
        })
    })
})

module.exports = router