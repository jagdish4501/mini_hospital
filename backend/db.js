const mysql = require('mysql');

//Connection Info
const connectDB = () => {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'jagdish',
        password: 'TrNiw6b*zno62@!x',
        database: 'HMS',
        multipleStatements: true
    });
    connection.connect();

    connection.query('SELECT 1+1 AS solution',
        (err, rows, fields) => {
            if (err) throw err
            console.log('The solution is', rows[0].solution)
        })

    return connection;
}
module.exports = connectDB