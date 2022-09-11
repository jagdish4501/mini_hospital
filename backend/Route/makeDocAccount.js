const express = require('express')
const rout = express.Router();
// var session = require('express-session')
//Connecting To Database
const connectDB = require('../db')
const con = connectDB();
rout.get('/', (req, res) => {
    let params = req.query;
    let name = params.name + " " + params.lastname;
    let email = params.email;
    let password = params.password;
    let gender = params.gender;
    let schedule = params.schedule;
    let sql_statement = `INSERT INTO Doctor (email, gender, password, name) 
                         VALUES ` + `("${email}", "${gender}", "${password}", "${name}")`;
    console.log(sql_statement);
    con.query(sql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
            let sql_statement = `INSERT INTO DocsHaveSchedules (sched, doctor) 
                         VALUES ` + `(${schedule}, "${email}")`;
            console.log(sql_statement);
            con.query(sql_statement, function (error) {
                if (error) throw error;
            })
            req.session.email_in_use = email;
            req.session.password_in_use = password;
            req.session.who = 'doc';
            req.session.save(function (err) {
                if (err) return next(err)
                // res.redirect('/')
            })
            return res.json({
                data: results
            })
        };
    });
});

module.exports = rout;