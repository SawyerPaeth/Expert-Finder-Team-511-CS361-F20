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
app.post('/addExpert', (req, res, next) => {
	
    const { first_name, last_name, expert_email, expert_twitter, expert_github, expert_linkedin, classes, skills, organizations, password = 'TEMPpass' } = req.body;
    //password = 'TEMPpass';
    const hashedPassword = getHashedPassword(password);


    sqlStatement = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ("' + expert_email + '", "' + first_name + '", "' + last_name + '", "' + hashedPassword + '")';
    console.log(sqlStatement);
    var userid =null;
    pool.query(sqlStatement, function (err, rows, fields) {
        // added the expert email - wrl
    	sqlStatement2 = 'SELECT * FROM Users WHERE username ="' + expert_email + '"';
    	console.log(sqlStatement2);
    	pool.query(sqlStatement2, function (err, rows, field) { 
    		for (var x in rows) {
           		if (rows[x].username === expert_email) {
               		userid = rows[x].user_id;
            	};
        	};
        	console.log(userid);

        	sqlStatement_git = 'INSERT INTO ExpertLinks (user_id, link, link_type) VALUES ("' + userid + '","' + expert_github + '","' + 'github' + '")';
    		console.log(sqlStatement_git);
    		pool.query(sqlStatement_git, function(err, rows, fields) {

    			sqlStatement_twitter = 'INSERT INTO ExpertLinks (user_id, link, link_type) VALUES ("' + userid + '","' + expert_twitter + '","' + 'twitter' + '")';
    			console.log(sqlStatement_twitter);
    			pool.query(sqlStatement_twitter, function(err, rows, fields) {

    				sqlStatement_linkedin = 'INSERT INTO ExpertLinks (user_id, link, link_type) VALUES ("' + userid + '","' + expert_linkedin + '","' + 'linkedin' + '")';
    				console.log(sqlStatement_linkedin);
    				pool.query(sqlStatement_linkedin, function(err, rows, fields) {
                        // You should probably loop about classes in a for loop, pulling each
                        // added class out and running from here down with each class.  Also not sure
                        // you want to nest the links and this stuff like this - just because they don't
                        // have links doesn't mean they won't have classes.   As long as it's all nested 
                        // under the user it should be fine. 
                        // Added a check for the description - WRL 
    					sqlStatement_classes = 'SELECT * From Classes WHERE description = "' + classes + '"';
    					var classid = null;
    					pool.query(sqlStatement_classes, function(err, rows, fields) {
    						for (var x in rows) {
    							if (rows[x].description === classes) {
    								classid = rows[x].class_id;
    							}
    							else {
    								sql_class_add = 'INSERT INTO Classes (description) VALUES ("' + classes + '")';
    								pool.query(sql_class_add, function(err, rows, fields) {

    									pool.query(sqlStatement_classes, function(err, rows, fields) {
    										for (var x in rows) {
    											if (rows[x].description === classes) {
    												classid = rows[x].class_id;
    											};
    										};
    									});
    								});
    							};
    						};

    						sql_expert_class = 'INSERT INTO ExpertClasses (user_id, class_id) VALUES ("' + userid + '","' + classid + '")';
    						pool.query(sql_expert_class, function(err, rows, fields) {
                                // End the loop for classes - break out subjects into it's own area

    							sqlStatement_subjects = 'SELECT * From Subjects';
    							var subjectid = null;
    							pool.query(sqlStatement_subjects, function(err, rows, fields) {
    								for (var x in rows) {
    									if (rows[x].description === skills) {
    										subjectid = rows[x].subject_id;
    									}
    									else {
    										sql_subject_add = 'INSERT INTO Subjects (description) VALUES ("' + skills + '")';
    										pool.query(sql_subject_add, function(err, rows, fields) {

    											pool.query(sqlStatement_subjects, function(err, rows, fields) {
    												for (var x in rows) {
    													if (rows[x].description === skills) {
    														subjectid = rows[x].subject_id;
    													};
    												};
    											});
    										});
    									};
    								};

    								sql_expert_subject = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES ("' + userid + '","' + subjectid + '")';
    								pool.query(sql_expert_subject, function(err, rows, fields) {
    									res.render('addExpert', {
        										message: 'Expert' + " " + first_name + " " + last_name + " " + 'added',
        										messageClass: 'alert-success'
        									});

    									/*sqlStatement_orgs = 'SELECT * From Organizations';
    									var orgid = null;
    									pool.query(sqlStatement_orgs, function(err, rows, fields) {
    										for (var x in rows) {
    											if (rows[x].description === organizations) {
    												orgid = rows[x].organization_id;
    											}
    											else {
    												sql_org_add = 'INSERT INTO Organziations (description) VALUES ("' + organizations + '")';
    												pool.query(sql_org_add, function(err, row, field) {

    													pool.query(sqlStatement_orgs, function(err, rows, fields) {
    														for (var x in rows) {
    															if (rows[x].description === organizations) {
    																orgid = rows[x].organization_id;
    															};
    														};
    													});
    												});
    											};
    										};

    										sql_expert_class = 'INSERT INTO ExpertOrganizations (user_id, organization_id) VALUES ("' + userid + '","' + orgid + '")';
    										pool.query(sql_expert_class, function(err, rows, fields) {
    											res.render('addExpert', {
        										message: 'Expert' + " " + first_name + " " + last_name + " " + 'added',
        										messageClass: 'alert-success'
        										});
    										});
    									});*/

    								});
    							});
    						});
    					});
    				});
        
    			});
    		});
    	});
	});
});

app.get('/advancedSearch', function (req, res, next) {
    res.render('advancedSearch');
});

app.get('/basicProfile', function (req, res, next) {
    // So this is what I would recommend - have a passed in user, check for existance
    // if it doesn't exist, user the logged in user. 
    let isLoggedOn;
    isLoggedOn = false;
    if(req.user) {
        isLoggedOn = true;
    };
 //   var sqlStatement = "SELECT description FROM Subjects WHERE subject_id IN (SELECT subject_id FROM ExpertSubjects WHERE user_id = 1)";
 // You can use the req.user to figure out what the currently logged in user's name is.
 // req.user is the email address of the logged in user (username)
    var sqlStatement = 'SELECT description FROM Subjects WHERE subject_id IN (SELECT subject_id FROM ExpertSubjects INNER JOIN Users WHERE ExpertSubjects.user_id = Users.user_id AND Users.username = "' + req.user + '")';
    console.log(sqlStatement);
    pool.query(sqlStatement, function (err, result, fields) {

        var userInfo = JSON.stringify(result);
        console.log(userInfo);

        var sqlStatement = "SELECT description FROM Classes WHERE class_id IN (SELECT class_id FROM ExpertClasses WHERE user_id = 1)";
        pool.query(sqlStatement, function (err, result2, fields) {

            var userInfo = JSON.stringify(result2);
            console.log(userInfo)

            res.render('basicProfile', {
                isLoggedOn : isLoggedOn,
                result: result,
                result2: result2
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