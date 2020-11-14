var express = require('express');
var mysql = require("mysql");

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', '8352');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(express.static("public"));

var pool = mysql.createPool({
  connectionLimit : 10,
    host : 'classmysql.engr.oregonstate.edu',
    user : 'cs361_levinw',
    password : '8352',
    database : 'cs361_levinw'
});

// This should return the information by a passed in value set of first and
// and last name.
app.get('/', function(req, res, next)
{
    var sqlStatement = 'SELECT * FROM Users INNER JOIN ExpertSubjects INNER JOIN ExpertLinks INNER JOIN ExpertClasses WHERE Users.lastName = ? AND Users.firstName = ? AND Users.user_id = ExpertSubjects.user_id AND Users.user_id = ExpertLinks.user_id AND Users.user_id = ExpertClasses.user_id', [req.query.lastname], [req.query.firstname];
    pool.query(sqlStatement, function(err, result, fields)
    {
        var userInfo = JSON.stringify(result);
        res.send(userInfo);
    });
});

// This should create a new user in the user database
app.get('/add', function(req, res, next)
{
    var sqlStatement = 'INSERT INTO Users (username, lastname, firstname, password) VALUES (?, ?, ?, ?)', [req.query.username, req.query.lastname, req.query.lastname, req.query.username];
    
    pool.query(sqlStatement, function(err, rows, fields)
        {
        var sendData = JSON.stringify(rows);
        res.send(sendData);
        });
        
});
