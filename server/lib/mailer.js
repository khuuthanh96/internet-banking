const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    "888176198749-9ead7edlmn9ad33hnfileki5nu77nf5n.apps.googleusercontent.com", // ClientID
    "m_ZuACSgjUl39TT2X3aszQt8", // Client Secret
    "https://developers.google.com/oauthplayground" // Redirect URL
);

oauth2Client.setCredentials({
    refresh_token: "1/m4S5cmIQpXf1-_TwajCC5AXB_YQEMqXtLkNBswkHEDk"
});

// const getAccesstoken = async () => {
//     const tokens = await oauth2Client.refreshAccessToken()
//     return tokens.credentials.access_token
// }

// console.log("accesstoken", getAccesstoken())


const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: "khuuthanh1001@gmail.com", 
        clientId: "888176198749-9ead7edlmn9ad33hnfileki5nu77nf5n.apps.googleusercontent.com",
        clientSecret: "m_ZuACSgjUl39TT2X3aszQt8",
        refreshToken: "1/m4S5cmIQpXf1-_TwajCC5AXB_YQEMqXtLkNBswkHEDk",
        // accessToken: getAccesstoken()
    }
})

const mailOptions = (dest, username, optCode) => ({
    from: 'Internet Banking OTP code <khuuthanh1001@gmail.com>', // sender address
    to: dest, // list of receivers
    subject: 'Transaction OTP code', // Subject line
    html: `
    <h1>Hello ${username}</h1>
    <p>Your transaction OTP code is here: <b><i>${optCode}</i></b></p>`// plain text body
})
  
const sendMail = (desEmail, username, optCode) => transporter.sendMail(mailOptions(desEmail, username, optCode), (error, response) => {
    error ? console.log(error) : console.log(response);
    transporter.close();
})

module.exports = { sendMail }
