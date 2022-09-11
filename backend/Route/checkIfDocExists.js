const express = require('express')
const rout = express.Router();
const connectDB = require('../db')
const con = connectDB();
rout.get('/checkIfDocExists', (req, res) => {
    let params = req.query;
    let email = params.email;
    let statement = `SELECT * FROM Doctor WHERE email = "${email}"`;
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