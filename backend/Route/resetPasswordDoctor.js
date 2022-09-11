const express = require('express')
const rout = express.Router();
var session = require('express-session')

const connectDB = require('../db')
const con = connectDB();

rout.post('/', (req, res) => {
    let something = req.query;
    let email = something.email;
    let oldPassword = "" + something.oldPassword;
    let newPassword = "" + something.newPassword;
    let statement = `UPDATE Doctor
                     SET password = "${newPassword}" 
                     WHERE email = "${email}" 
                     AND password = "${oldPassword}";`;
    console.log(statement);
    con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
            return res.json({
                data: results
            })
        };
    });
});

module.exports = rout;