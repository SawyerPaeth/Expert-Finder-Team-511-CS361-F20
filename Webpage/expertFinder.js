var express = require('express');
var mysql = require("mysql");
var bodyParser = require('body-parser');

var app = express();
// This tells you the main.handlebars is the default layout
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8352);
var port = 8352;
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cookieParser());

var pool = mysql.createPool({
  connectionLimit : 10,
    host : 'classmysql.engr.oregonstate.edu',
    user : 'cs361_levinw',
    password : '8352',
    database : 'cs361_levinw'
});

const authTokens = {};

app.use((req, res, next) => {
    // Get auth token from the cookies
    const authToken = req.cookies['AuthToken'];

    // Inject the user to the request
    req.user = authTokens[authToken];

    next();
});

// This hashes a user password
const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const generateAuthToken = () => {
    return crypto.randomBytes(30).toString('hex');
}

// This should render each of the pages.
app.get('/', function(req, res, next)
{
    res.render('expertFinder');
});

app.get('/login', function(req, res, next)
{

        pool.query(sqlStatement, 
        function (err, rows, fields)
        {
            var SendData = JSON.stringify(rows);
            res.send(sendData);
        });

});

app.post('/expertFinder', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    sqlStatement="SELECT * FROM Users WHERE username = ? AND password = ?", [email, hashedPassword];
    pool.query(sqlStatement, 
        function (err, rows, fields)
        {
            const user = rows.find(u => {
                return u.email === email && hashedPassword === u.password
            });

            if (user) {
                const authToken = generateAuthToken();

                // Store authentication token
                authTokens[authToken] = user;

                // Setting the auth token in cookies
                res.cookie('AuthToken', authToken);

                // Redirect user to the protected page
                res.redirect('/protected');
            } else {
                res.render('expertFinder', {
                    message: 'Invalid username or password',
                    messageClass: 'alert-danger'
                });
            }
        });
});

app.get('/register', function(req, res, next)
{
    res.render('register');
});


app.post('/register', (req, res) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    // Check if the password and confirm password fields match
    if (password === confirmPassword) {

        sqlStatement = "SELECT username FROM Users WHERE user.email = email", [email];
        pool.query(sqlStatement, function(err, rows, field) {
            var users = JSON.stringify(rows);
            // Check if user with the same email is also registered
            if (users.email === email) {
                res.render('register', {
                    message: 'User already registered.',
                    messageClass: 'alert-danger'
                });

                return;

            };
        });
        const hashedPassword = getHashedPassword(password);

        sqlStatement = "INSERT INTO Users (username, lastname, firstname, password) VALUES (?, ?, ?, ?)", [email, firstName, lastName, password];
        pool.query(sqlStatement, function (err, rows, fields) {
            var sendData = JSON.stringify(rows);
            res.send(sendData);
        });

        res.render('expertFinder', {
            message: 'Registration Complete. Please login to continue.',
            messageClass: 'alert-success'
        });
    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});     

app.get('/addExpert', function(req, res, next)
{
	res.render('addExpert');
});

// Ok to add an expert you need to do the following:
// 1. Insert their basic information into the User table.  
// 2. Pull and store off their userid - this is the unique identifier in the user's table
// 3. Insert a link into the Links table 
// 4. Pull the link link id - unique identifier for the link
// 5. Put the link id and user id into the ExpertLinks table 
// - repeat steps 3-5 as necessary -
// 6. Insert a class into the Classes table
// 7. Pull the class id - unique identifier for the Class
// 8. Put the class id and user id into the ExpertClass table
// - repeat steps 6-8 as necessary -
// 9. Insert a subject into the Subject table
// 10. Pull the subject id - unique identifier for the Subject
// 11. Put the subject id and user id into the ExpertSubject table
// - repeat steps 9-12 as necessary - 
// 12. have a beer or whatever your celebatory drink is 
app.post('/addExpert', (req, res) => {
	const { first_name, last_name, expert_email, expert_twitter, expert_github, expert_linkedin, classes, skills, organizations } = req.body;

	sqlStatement = "INSERT INTO Users (firstName, lastName, username, expert_twitter, expert_github, expert_linkedin, classes, skills, organizations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [first_name, last_name, expert_email, expert_twitter, expert_github, expert_linkedin, classes, skills, organizations];
	pool.query(sqlStatement, function (err, rows, fields) {
		var sendData = JSON.stringify(rows);
		res.send(sendData);
	});
	res.render('addExpert', {
		message: 'Expert Added',
		messageClass: 'alert-success'
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

app.post('/basicProfileModify/addSkill',function(req,res){
  var sqlStatement = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES (' + req.body.userID + ',' + req.body.skill + ')';
  console.log(sqlStatement);
  pool.query(sqlStatement, function(err, rows, fields)
    {
    var sendData = JSON.stringify(rows);
    res.send(sendData);
    });

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

app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});