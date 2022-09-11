const express = require('express')
const rout = express.Router();
// var session = require('express-session')


rout.get('/', (req, res) => {
    return res.json({
        email: `${req.session.email_in_use === undefined ? "" : req.session.email_in_use}`,
        who: `${req.session.who === undefined ? "" : req.session.who}`
    });
});

module.exports = rout;