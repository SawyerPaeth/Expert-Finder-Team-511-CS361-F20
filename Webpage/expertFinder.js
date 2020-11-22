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

app.post('/login', (req, res) => {
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
                res.render('login', {
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

        // Check if user with the same email is also registered
        if (users.find(user => user.email === email)) {
            res.render('register', {
                message: 'User already registered.',
                messageClass: 'alert-danger'
            });

            return;
        }
        const hashedPassword = getHashedPassword(password);

        sqlStatement = "INSERT INTO Users (username, lastname, firstname, password) VALUES (?, ?, ?, ?)", [email, firstName, lastName, password];
        pool.query(sqlStatement, function (err, rows, fields) {
            var sendData = JSON.stringify(rows);
            res.send(sendData);
        });

        res.render('login', {
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
    pool.query(sqlStatement,
        function (err, rows, fields)
        {
            var SendData = JSON.stringify(rows);
            res.send(sendData);
        });
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