const jwt = require('jsonwebtoken');

function sign(payload, expiresIn) {
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.TOKEN_SECRET_KEY, { expiresIn: expiresIn }, (err, token) => {
            if (err) return reject(err);
            resolve(token);
        })
    });
};

function verify(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, process.env.TOKEN_SECRET_KEY, (err, payload) => {
            if (err) return reject(err);
            resolve(payload);
        });
    });
};
module.exports = { sign, verify };