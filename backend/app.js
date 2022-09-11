const createError = require('http-errors');
const express = require('express');
const path = require('path');
//Logger that was used for debugging, commented later
// var logger = require('morgan');
const connectDB = require('./db')
//Connecting To Database
const con = connectDB();
const cors = require('cors');
var session = require('express-session');
const { route } = require('./Route/checkIfPatientExists');
const port = 3001

const app = express();



//Variables to keep state info about who is logged in
// var email_in_use = "";
// var password_in_use = "";
// var who = "";
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}))


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

//Signup, Login, Password Reset Related Queries
app.use('/checkIfPatientExists', require('./Route/checkIfPatientExists'));
//Creates User Account
app.use('/makeAccount', require('./Route/makeAccount'))
//Checks If Doctor Exists
app.use('/checkIfDocExists', require('./Route/checkIfDocExists'))
//Makes Doctor Account
app.use('/makeDocAccount', require('./Route/makeDocAccount'))
//Checks if patient is logged in
app.use('/checklogin', require('./Route/checklogin'))
//Checks if doctor is logged in
app.use('/checkDoclogin', require('./Route/checkDoclogin'))
//Resets Patient Password
app.use('/resetPasswordPatient', require('./Route/resetPasswordPatient'))
//Resets Doctor Password
app.use('/resetPasswordDoctor', require('./Route/resetPasswordDoctor'))
//Returns Who is Logged in
app.use('/userInSession', require('./Route/userInSession'))
//Logs the person out
app.use('/endSession', require('./Route/endSession'))
//Appointment Related

//Checks If a similar appointment exists to avoid a clash
app.use('/checkIfApptExists', require('./Route/checkIfApptExists'))
//Returns Date/Time of Appointment
app.get('/getDateTimeOfAppt', (req, res) => {
  let tmp = req.query;
  let id = tmp.id;
  let statement = `SELECT starttime as start, 
                          endtime as end, 
                          date as theDate 
                   FROM Appointment 
                   WHERE id = "${id}"`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      console.log(JSON.stringify(results));
      return res.json({
        data: results
      })
    };
  });
});

//Patient Info Related

//to get all doctor names
app.get('/docInfo', (req, res) => {
  let statement = 'SELECT * FROM Doctor';
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

//To return a particular patient history
app.get('/OneHistory', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT gender,name,email,address,conditions,surgeries,medication
                    FROM PatientsFillHistory,Patient,MedicalHistory
                    WHERE PatientsFillHistory.history=id
                    AND patient=email AND email = ` + email;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  })
});

//To show all patients whose medical history can be accessed
app.get('/MedHistView', (req, res) => {
  let params = req.query;
  let patientName = "'%" + params.name + "%'";
  let secondParamTest = "" + params.variable;
  let statement = `SELECT name AS 'Name',
                    PatientsFillHistory.history AS 'ID',
                    email FROM Patient,PatientsFillHistory
                    WHERE Patient.email = PatientsFillHistory.patient
                    AND Patient.email IN (SELECT patient from PatientsAttendAppointments 
                    NATURAL JOIN Diagnose WHERE doctor="${req.session.email_in_use}")`;
  if (patientName != "''")
    statement += " AND Patient.name LIKE " + patientName
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Returns Appointment Info To patient logged In
app.get('/patientViewAppt', (req, res) => {
  let tmp = req.query;
  let email = tmp.email;
  let statement = `SELECT PatientsAttendAppointments.appt as ID,
                  PatientsAttendAppointments.patient as user, 
                  PatientsAttendAppointments.concerns as theConcerns, 
                  PatientsAttendAppointments.symptoms as theSymptoms, 
                  Appointment.date as theDate,
                  Appointment.starttime as theStart,
                  Appointment.endtime as theEnd,
                  Appointment.status as status
                  FROM PatientsAttendAppointments, Appointment
                  WHERE PatientsAttendAppointments.patient = "${email}" AND
                  PatientsAttendAppointments.appt = Appointment.id`;
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

//Checks if history exists
app.get('/checkIfHistory', (req, res) => {
  let params = req.query;
  let email = params.email;
  let statement = "SELECT patient FROM PatientsFillHistory WHERE patient = " + email;
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    };
  });
});

//Adds to PatientsAttendAppointment Table
app.get('/addToPatientSeeAppt', (req, res) => {
  let params = req.query;
  let email = params.email;
  let appt_id = params.id;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let sql_try = `INSERT INTO PatientsAttendAppointments (patient, appt, concerns, symptoms) 
                 VALUES ("${email}", ${appt_id}, "${concerns}", "${symptoms}")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      return res.json({
        data: results
      })
    }
  });

});

//Schedules Appointment
app.get('/schedule', (req, res) => {
  let params = req.query;
  let time = params.time;
  let date = params.date;
  let id = params.id;
  let endtime = params.endTime;
  let concerns = params.concerns;
  let symptoms = params.symptoms;
  let doctor = params.doc;
  let ndate = new Date(date).toLocaleDateString().substring(0, 10)
  let sql_date = `STR_TO_DATE('${ndate}', '%d/%m/%Y')`;
  //sql to turn string to sql time obj
  let sql_start = `CONVERT('${time}', TIME)`;
  //sql to turn string to sql time obj
  let sql_end = `CONVERT('${endtime}', TIME)`;
  let sql_try = `INSERT INTO Appointment (id, date, starttime, endtime, status) 
                 VALUES (${id}, ${sql_date}, ${sql_start}, ${sql_end}, "NotDone")`;
  console.log(sql_try);
  con.query(sql_try, function (error, results, fields) {
    if (error) throw error;
    else {
      let sql_try = `INSERT INTO Diagnose (appt, doctor, diagnosis, prescription) 
                 VALUES (${id}, "${doctor}", "Not Yet Diagnosed" , "Not Yet Diagnosed")`;
      console.log(sql_try);
      con.query(sql_try, function (error, results, fields) {
        if (error) throw error;
        else {
          return res.json({
            data: results
          })
        }
      });
    }
  });
});

//Generates ID for appointment
app.get('/genApptUID', (req, res) => {
  let statement = 'SELECT id FROM Appointment ORDER BY id DESC LIMIT 1;'
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let generated_id = results[0].id + 1;
      return res.json({ id: `${generated_id}` });
    };
  });
});

//To fill diagnoses
app.get('/diagnose', (req, res) => {
  let params = req.query;
  let id = params.id;
  let diagnosis = params.diagnosis;
  let prescription = params.prescription;
  let statement = `UPDATE Diagnose SET diagnosis="${diagnosis}", prescription="${prescription}" WHERE appt=${id};`;
  console.log(statement)
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      let statement = `UPDATE Appointment SET status="Done" WHERE id=${id};`;
      console.log(statement)
      con.query(statement, function (error, results, fields) {
        if (error) throw error;
      })
    };
  });
});

//To show diagnoses
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
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

//To show appointments to doctor
app.get('/doctorViewAppt', (req, res) => {
  let a = req.query;
  let email = a.email;
  let statement = `SELECT a.id,a.date, a.starttime, a.status, p.name, psa.concerns, psa.symptoms
  FROM Appointment a, PatientsAttendAppointments psa, Patient p
  WHERE a.id = psa.appt AND psa.patient = p.email
  AND a.id IN (SELECT appt FROM Diagnose WHERE doctor="${req.session.email_in_use}")`;
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

//To show diagnoses to patient
app.get('/showDiagnoses', (req, res) => {
  let id = req.query.id;
  let statement = `SELECT * FROM Diagnose WHERE appt=${id}`;
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

//To Show all diagnosed appointments till now
app.get('/allDiagnoses', (req, res) => {
  let params = req.query;
  let email = params.patientEmail;
  let statement = `SELECT date,doctor,concerns,symptoms,diagnosis,prescription FROM 
  Appointment A INNER JOIN (SELECT * from PatientsAttendAppointments NATURAL JOIN Diagnose 
  WHERE patient=${email}) AS B ON A.id = B.appt;`
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

//To delete appointment
app.get('/deleteAppt', (req, res) => {
  let a = req.query;
  let uid = a.uid;
  let statement = `SELECT status FROM Appointment WHERE id=${uid};`;
  console.log(statement);
  con.query(statement, function (error, results, fields) {
    if (error) throw error;
    else {
      results = results[0].status
      if (results == "NotDone") {
        statement = `DELETE FROM Appointment WHERE id=${uid};`;
        console.log(statement);
        con.query(statement, function (error, results, fields) {
          if (error) throw error;
        });
      }
      else {
        if (req.session.who == "pat") {
          statement = `DELETE FROM PatientsAttendAppointments p WHERE p.appt = ${uid}`;
          console.log(statement);
          con.query(statement, function (error, results, fields) {
            if (error) throw error;
          });
        }
      }
    };
  });
  return;
});

// If 404, forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(port, () => {
  console.log(`Listening on port ${port} `);
});

module.exports = app;