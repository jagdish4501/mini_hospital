const express = require('express')
const rout = express.Router();
var session = require('express-session')


rout.get('/', (req, res) => {
    console.log("Ending session");
    req.session.email_in_use = undefined;
    req.session.password_in_use = undefined;
    req.session.who = undefined;
    req.session.save(function (err) {
        if (err) next(err)

        // regenerate the session, which is good practice to help
        // guard against forms of session fixation
        req.session.regenerate(function (err) {
            if (err) next(err)
            res.redirect('/')
        })
    })
});

module.exports = rout;