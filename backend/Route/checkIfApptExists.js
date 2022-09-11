const express = require('express')
const rout = express.Router();
var session = require('express-session')

const connectDB = require('../db')
const con = connectDB();
rout.get('/', (req, res) => {
    let cond1, cond2, cond3 = ""
    let params = req.query;
    let email = params.email;
    let doc_email = params.docEmail;
    let startTime = params.startTime;
    let date = params.date;
    let ndate = new Date(date).toLocaleDateString().substring(0, 10)
    let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
    //sql to turn string to sql time obj
    let sql_start = `CONVERT('${startTime}', TIME)`;
    let statement = `SELECT * FROM PatientsAttendAppointments, Appointment  
    WHERE patient = "${email}" AND
    appt = id AND
    date = ${sql_date} AND
    starttime = ${sql_start}`
    console.log(statement)
    con.query(statement, function (error, results, fields) {
        if (error) throw error;
        else {
            cond1 = results;
            statement = `SELECT * FROM Diagnose d INNER JOIN Appointment a 
        ON d.appt=a.id WHERE doctor="${doc_email}" AND date=${sql_date} AND status="NotDone" 
        AND ${sql_start} >= starttime AND ${sql_start} < endtime`
            console.log(statement)
            con.query(statement, function (error, results, fields) {
                if (error) throw error;
                else {
                    cond2 = results;
                    statement = `SELECT doctor, starttime, endtime, breaktime, day FROM DocsHaveSchedules 
            INNER JOIN Schedule ON DocsHaveSchedules.sched=Schedule.id
            WHERE doctor="${doc_email}" AND 
            day=DAYNAME(${sql_date}) AND 
            (DATE_ADD(${sql_start},INTERVAL +1 HOUR) <= breaktime OR ${sql_start} >= DATE_ADD(breaktime,INTERVAL +1 HOUR));`
                    //not in doctor schedule
                    console.log(statement)
                    con.query(statement, function (error, results, fields) {
                        if (error) throw error;
                        else {
                            if (results.length) {
                                results = []
                            }
                            else {
                                results = [1]
                            }
                            return res.json({
                                data: cond1.concat(cond2, results)
                            })
                        };
                    });
                };
            });
        };
    });
    //doctor has appointment at the same time - Your start time has to be greater than all prev end times
});

module.exports = rout;