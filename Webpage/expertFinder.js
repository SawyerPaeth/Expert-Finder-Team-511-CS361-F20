var express = require('express');
var mysql = require("mysql");
var bodyParser = require('body-parser');

var app = express();
// This tells you the main.handlebars is the default layout
var handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const cookieParser = require('cookie-parser');
const crypto = require('crypto');

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 8352);
var port = 8352;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.use(cookieParser());

var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'classmysql.engr.oregonstate.edu',
    user: 'cs361_levinw',
    password: '8352',
    database: 'cs361_levinw'
});

const authTokens = {};
const ExpertUser = {};

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
app.get('/', function (req, res, next) {
    res.render('expertFinder');
});

app.get('/login', function (req, res, next) {

    pool.query(sqlStatement,
        function (err, rows, fields) {
            var SendData = JSON.stringify(rows);
            res.send(sendData);
        });

});


app.post('/expertFinder', (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = getHashedPassword(password);

    sqlStatement = 'SELECT * FROM Users WHERE username = "' + email + '" AND password = "' + hashedPassword +'"';
    pool.query(sqlStatement, function (err, rows, field) {
        loggedIn = false;
        for (var x in rows) {
            if (rows[x].username === email && rows[x].password === hashedPassword) {
                loggedIn = true;
            };
        };
        if (loggedIn === true) {
            const authToken = generateAuthToken();
            console.log("Successfully logged in");

            // Store authentication token
            authTokens[authToken] = email;

            // Setting the auth token in cookies
            res.cookie('AuthToken', authToken);

            // Redirect user to the protected page
            res.redirect('/basicProfile');

        } else {
            res.render('expertFinder', {
                message: 'Invalid username or password',
                messageClass: 'alert-danger'
            });
        }
    });
});

app.get('/register', function (req, res, next) {
    res.render('register');
});

app.post('/register', (req, res, next) => {
    const { email, firstName, lastName, password, confirmPassword } = req.body;
    if (password === "") {
        res.render('register', {
            message: 'Cannot have an empty password.',
            messageClass: 'alert-danger'
        });
        return;
    }
    if (email === "") {
        res.render('register', {
            message: 'Cannot have an empty email address.',
            messageClass: 'alert-danger'
        });
        return;
    }
    // Check if the password and confirm password fields match
    if (password === confirmPassword) {
        sqlStatement = 'SELECT username FROM Users WHERE Users.username = "' + email + '"';
        pool.query(sqlStatement, function (err, rows, field) {
            // Check if user with the same email is also registered
            for (var x in rows) {
                if (rows[x].username === email) {
                    res.render('register', {
                        message: 'User already registered.',
                        messageClass: 'alert-danger'
                    });
                    return;
                };
            };
            const hashedPassword = getHashedPassword(password);
            sqlStatement = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ("' + email + '", "' + firstName + '", "' + lastName + '", "' + hashedPassword + '")';
            console.log(sqlStatement);
            pool.query(sqlStatement, function (err, rows, field) {
                res.render('expertFinder', {
                    message: 'Registration Complete. Please login to continue.',
                    messageClass: 'alert-success'
                });
            });
        });

    } else {
        res.render('register', {
            message: 'Password does not match.',
            messageClass: 'alert-danger'
        });
    }
});

app.get('/addExpert', function (req, res, next) {
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

app.get('/advancedSearch', function (req, res, next) {
    res.render('advancedSearch');
});

app.get('/basicProfile', function (req, res, next) {
    // So this is what I would recommend - have a passed in user, check for existance
    // if it doesn't exist, user the logged in user. 
    console.log(req.query);
    let isLoggedOn;
    isLoggedOn = false;
    if (req.user) {
        isLoggedOn = true;
        sqlUser = req.user;
    };

    if (req.query.ExpertUser) {
        sqlUser = req.query.ExpertUser;
    }
    //   var sqlStatement = "SELECT description FROM Subjects WHERE subject_id IN (SELECT subject_id FROM ExpertSubjects WHERE user_id = 1)";
    // You can use the req.user to figure out what the currently logged in user's name is.
    // req.user is the email address of the logged in user (username)

    var UserSqlStatement = 'SELECT firstName, lastName, username FROM Users WHERE Users.username = "' + sqlUser + '"';

    pool.query(UserSqlStatement, function (err, Userinfo, fields) {

        var SubjectSqlStatement = 'SELECT description FROM Subjects LEFT JOIN ExpertSubjects ON ExpertSubjects.subject_id = Subjects.subject_id LEFT JOIN Users ON ExpertSubjects.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

        var ClassSqlStatement = 'SELECT description FROM Classes LEFT JOIN ExpertClasses ON ExpertClasses.class_id = Classes.class_id LEFT JOIN Users ON ExpertClasses.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

        var LinksSqlStatement = 'SELECT link, link_type FROM ExpertLinks LEFT JOIN Users ON ExpertLinks.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

        pool.query(SubjectSqlStatement, function (err, Subjects, fields) {

            var SubjectsString = JSON.stringify(Subjects);
            console.log(SubjectsString);

            pool.query(ClassSqlStatement, function (err, Classes, fields) {

                var ClassesString = JSON.stringify(Classes);
                console.log(ClassesString);

                pool.query(LinksSqlStatement, function (err, Links, fields) {
                    var LinksString = JSON.stringify(Links);
                    console.log(LinksString);
                    res.render('basicProfile', {
                        isLoggedOn: isLoggedOn,
                        Userinfo: Userinfo,
                        Subjects: Subjects,
                        Classes: Classes,
                        Links : Links
                    });

                });
            });


        });
    });
});


app.get('/basicProfileModify', function (req, res, next) {
    res.render('basicProfileModify');
});

app.post('/basicProfileModify/addSkill', function (req, res) {
    console.log(req.body)
    pool.query("INSERT INTO Subjects (description) VALUES (?)", req.body.skill, function (err, rows, fields) {
        var sendData = JSON.stringify(rows);
        //res.send(sendData);
        var skillInsertId = null;
        skillInsertId = rows.insertId;

        var sqlStatement = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES (' + req.body.userId + ',' + skillInsertId + ')';
        console.log(sqlStatement);
        pool.query(sqlStatement, function (err, rows, fields) { });
    });
});

app.post('/basicProfileModify/removeSkill', function (req, res) {
    pool.query("DELETE FROM ExpertSubjects WHERE user_id = ? AND subject_id = ?", [req.body.userID, req.body.skill], function (err, rows, fields) {
        var sendData = JSON.stringify(rows);
        res.send(sendData);
    });
});

app.get('/search01', function (req, res, next) {
    res.render('layout');
});

app.get('/memberSearch', function (req, res, next) {
    res.render('memberSearch');
});

app.get('/search', function (req, res, next) {
    res.render('search');
});

app.get('/search01', function (req, res, next) {
    res.render('search01');
});

app.get('/searchResult', function (req, res, next) {
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
app.get('/searchSkill', function (req, res, next) {

    var sqlStatement = "SELECT * FROM `Subjects` WHERE `description` = 'Python'";
    pool.query(sqlStatement, function (err, result, fields) {
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

app.listen(app.get('port'), function () {
    console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});