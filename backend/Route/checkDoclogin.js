const express = require('express')
const rout = express.Router();
var session = require('express-session')
const connectDB = require('../db')
const con = connectDB();
rout.get('/', (req, res) => {
    let params = req.query;
    let email = params.email;
    let password = params.password;
    let sql_statement = `SELECT * 
                         FROM Doctor
                         WHERE email="${email}" AND password="${password}"`;
    console.log(sql_statement);
    con.query(sql_statement, function (error, results, fields) {
        if (error) {
            console.log("eror");
            return res.status(500).json({ failed: 'error ocurred' })
        }
        else {
            if (results.length === 0) {
            } else {
                var string = JSON.stringify(results);
                var json = JSON.parse(string);
                req.session.email_in_use = json[0].email;
                req.session.password_in_use = json[0].password;
                req.session.who = "doc";
                req.session.save(function (err) {
                    if (err) return next(err)
                    // res.redirect('/')
                })
                console.log(req.session.email_in_use);
                console.log(req.session.password_in_use);
            }
            return res.json({
                data: results
            })
        };
    });
});

module.exports = rout;