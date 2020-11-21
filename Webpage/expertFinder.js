var express = require('express');
var mysql = require("mysql");
var bodyParser = require('body-parser');

var app = express();
// This tells you the main.handlebars is the default layout
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8352);
var port = 8352;
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

// This should render each of the pages.
app.get('/', function(req, res, next)
{
    res.render('expertFinder');
});

app.get('/login', function(req, res, next)
{
    sqlStatement="SELECT * FROM Users WHERE username = ? AND password = ?", [req.query.username, req.query.password];

    pool.query(sqlStatement, 
    function (err, rows, fields)
    {
        var SendData = JSON.stringify(rows);
        res.send(sendData);
    });

});

app.get('/advancedSearch', function(req, res, next)
{
    res.render('advancedSearch');
});

app.get('/basicProfile', function(req, res, next)
{
    res.render('basicProfile');
});

app.get('/basicProfileModify', function(req, res, next)
{
    res.render('basicProfileModify');
});

app.get('/search01', function(req, res, next)
{
    res.render('layout');
});

app.get('/memberSearch', function(req, res, next)
{
    res.render('memberSearch');
});

app.get('/search', function(req, res, next)
{
    res.render('search');
});

app.get('/search01', function(req, res, next)
{
    res.render('search01');
});

app.get('/searchResult', function(req, res, next)
{
    res.render('searchResult');
});

/*
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

app.get('/addCourse', function(req, res, next)
{
    var sqlStatement = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES (?, ?)', [req.query.user_id, req.query.subject_id];
    
    pool.query(sqlStatement, function(err, rows, fields)
        {
        var sendData = JSON.stringify(rows);
        res.send(sendData);
        });
        
});
*/
app.get('/searchSkill', function(req, res, next)
{
    
    var sqlStatement = "SELECT * FROM `Subjects` WHERE `description` = 'Python'";
    pool.query(sqlStatement, function(err, result, fields)
    {
        var userInfo = JSON.stringify(result);
        console.log(userInfo);
        res.send(userInfo);
    });
    

});


app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});