
const express = require("express");
const router = express.Router();
const { sign, verify } = require("../lib/jwt");
const passport = require("passport");

router.post("/login", (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(401).json({
                message: err || info,
                user: user
            });
        }
        req.login(user, { session: false }, async (err) => {
            if (err) {
                res.json(err);
            }

            user.accessToken = await sign({ uID: user._id }, "10h");
            user.refreshToken = await sign({ uID: user._id, rt: true }, "7d");
            return res.json({ user });
        });
    })(req, res);
});

router.post("/refreshtoken", (req, res) => {
    verify(req.body.refreshToken)
        .then(async (payload) => {
            if (payload.rt) {
                const accesstoken = await sign({uID: payload.uID}, "10h");
                return res.json({ accesstoken });
            } else {
                return res.status(401).json({
                    rt: true, //use for distinguish with accesstoken invalid
                    message: "Invalid token!",
                })
            }
        })
        .catch(err => {
            return res.status(401).json({
                rt: true,
                message: err.message,
            })
        });
})

module.exports = router;