const express = require("express");
const router = express.Router();
const { sign, verify } = require("../lib/jwt");
const passport = require("passport");
const axios = require("axios");
const qs = require("querystring")

router.post("/login", (req, res) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (!req.body.recaptchaToken || req.body.recaptchaToken === "") {
            return res.status(400).json({message: "recaptcha is required"});
        }        

        if (err || !user) {
            return res.status(401).json({
                message: err || info,
                user: user
            });
        }

        axios.post("https://www.google.com/recaptcha/api/siteverify", qs.stringify({
            secret: process.env.G_RECAPTCHA_SECRET_KEY,
            response: req.body.recaptchaToken
        }))
        .then(response => {
            if(response.data.success) {
                return req.login(user, { session: false }, async (err) => {
                    if (err) {
                        res.json(err);
                    }
        
                    user.accessToken = await sign({ uID: user._id }, "10h");
                    user.refreshToken = await sign({ uID: user._id, rt: true }, "7d");
                    return res.json({ user });
                });
            }
            console.log("gg-response: ", response.data);
            res.status(400).json({message: "recaptcha is required"});
        })
        .catch(err => {
            console.log("login.verify-g-recaptcha error: ", err);
            res.status(400).json({message: "recaptcha is required"});
        })
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