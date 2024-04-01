var exp = require('express');
var path = require('path');
var mysql = require('mysql');
var bp = require('body-parser');
var app = exp();

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'data'
});

conn.connect(function(err) {
    if (err) {
        console.error('Error connecting to MySQL database: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database as id ' + conn.threadId);
});

app.use(exp.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(bp.urlencoded({ extended: true }));



app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'canditate.html'));
});

app.get('/submitted', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'submitted.html'));
});



app.post('/candidate', function(req, res) {
    let t1 = req.body.a1;
    let t2 = req.body.a2;
    let t3 = req.body.a3;

    conn.query("INSERT INTO employee(Ename, timesheet, work) VALUES (?, ?, ?)", [t1, t2, t3], function(err, result) {
        if (err) {
            console.error('Error inserting data into employee table: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Data inserted successfully');
        res.redirect('/submitted');
    });
});



app.set('views', path.join(__dirname, 'views'));



app.get('/manager', function(req, res) {
    conn.query("SELECT * FROM employee", function(err, results) {
        if (err) {
            console.error('Error querying employee table: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.render('manager', { employees: results }
        );
    });
});




app.get('/rating', function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'rating.html'));
});


app.post('/rating', function(req, res) {
    let s1 = req.body.ename;
    let s2 = req.body.rating;

    conn.query("INSERT INTO manager(Ename, rating) VALUES (?, ?)", [s1, s2], function(err, result) {
        if (err) {
            console.error('Error inserting data into manager table: ' + err.stack);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log('Data inserted successfully in manager');
        res.redirect('/submitted');
    });
});



app.listen(1212, function(req, res) {
    console.log("Server is running at port 1212");
});
