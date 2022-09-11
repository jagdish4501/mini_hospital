const express = require('express')
const rout = express.Router();
// var session = require('express-session')
const connectDB = require('../db')
const con = connectDB();
rout.get('/', (req, res) => {
    let query = req.query;
    let name = query.name + " " + query.lastname;
    let email = query.email;
    let password = query.password;
    let address = query.address;
    let gender = query.gender;
    let medications = query.medications;
    let conditions = query.conditions;
    let surgeries = query.surgeries;
    if (medications === undefined) {
        medications = "none"
    }
    if (conditions === undefined) {
        conditions = "none"
    }
    if (!surgeries === undefined) {
        surgeries = "none"
    }
    let sql_statement = `INSERT INTO Patient (email, password, name, address, gender) 
                         VALUES ` + `("${email}", "${password}", "${name}", "${address}", "${gender}")`;
    console.log(sql_statement);
    con.query(sql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
            req.session.email_in_use = email;
            req.session.password_in_use = password;
            req.session.who = "pat";
            req.session.save(function (err) {
                if (err) return next(err)
                // res.redirect('/')
            })
            return res.json({
                data: results
            })
        };
    });
    sql_statement = 'SELECT id FROM MedicalHistory ORDER BY id DESC LIMIT 1;';
    console.log(sql_statement)
    con.query(sql_statement, function (error, results, fields) {
        if (error) throw error;
        else {
            let generated_id = results[0].id + 1;
            let sql_statement = `INSERT INTO MedicalHistory (id, date, conditions, surgeries, medication) 
        VALUES ` + `("${generated_id}", curdate(), "${conditions}", "${surgeries}", "${medications}")`;
            console.log(sql_statement);
            con.query(sql_statement, function (error, results, fields) {
                if (error) throw error;
                else {
                    let sql_statement = `INSERT INTO PatientsFillHistory (patient, history) 
            VALUES ` + `("${email}",${generated_id})`;
                    console.log(sql_statement);
                    con.query(sql_statement, function (error, results, fields) {
                        if (error) throw error;
                        else { };
                    });
                };
            });
        };
    });
});

module.exports = rout;