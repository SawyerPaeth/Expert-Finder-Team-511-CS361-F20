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

app.post('/addExpert', (req, res, next) => {
	
    const { first_name, last_name, expert_email, expert_twitter, expert_github, expert_linkedin, classes, skills, organizations, password = 'TEMPpass' } = req.body;
    const hashedPassword = getHashedPassword(password);


    sqlStatement = 'INSERT INTO Users (username, firstname, lastname, password) VALUES ("' + expert_email + '", "' + first_name + '", "' + last_name + '", "' + hashedPassword + '")';
    console.log(sqlStatement);
    var userid =null;
    pool.query(sqlStatement, function (err, rows, fields) {
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

    		});

    		sqlStatement_twitter = 'INSERT INTO ExpertLinks (user_id, link, link_type) VALUES ("' + userid + '","' + expert_twitter + '","' + 'twitter' + '")';
    		console.log(sqlStatement_twitter);
    		pool.query(sqlStatement_twitter, function(err, rows, fields) {

    		});

    		sqlStatement_linkedin = 'INSERT INTO ExpertLinks (user_id, link, link_type) VALUES ("' + userid + '","' + expert_linkedin + '","' + 'linkedin' + '")';
    		console.log(sqlStatement_linkedin);
    		pool.query(sqlStatement_linkedin, function(err, rows, fields) {

    		});
               
    		sqlStatement_classes = 'SELECT * From Classes';
    		var classid = null;
    		pool.query(sqlStatement_classes, function(err, rows, fields) {
    			for (var x in rows) {
    				if (rows[x].description === classes) {
    					classid = rows[x].class_id;
    				};
    			};
                console.log(classid + 'class');
                if (classid === null) {
                	sql_class_add = 'INSERT INTO Classes (description) VALUES ("' + classes + '")';
                	console.log(sql_class_add);
                    console.log(sqlStatement_classes);
                    pool.query(sql_class_add, function(err, rows, fields) {
                		pool.query(sqlStatement_classes, function(err, rows, fields) {
                			for (var x in rows) {
                				if (rows[x].description === classes) {
                					classid = rows[x].class_id;
                				};
                			};
                		    console.log(classid + 'class2');
                		    sql_expert_class = 'INSERT INTO ExpertClasses (user_id, class_id) VALUES ("' + userid + '","' + classid + '")';
    					    pool.query(sql_expert_class, function(err, rows, fields) {

    						});
                        });
                    });
                };
                sql_expert_class = 'INSERT INTO ExpertClasses (user_id, class_id) VALUES ("' + userid + '","' + classid + '")';
    			pool.query(sql_expert_class, function(err, rows, fields) {

    			});
    		});
    		
    		sqlStatement_subjects = 'SELECT * From Subjects WHERE description = "' + skills + '"';
    		var subjectid = null;
    		pool.query(sqlStatement_subjects, function(err, rows, fields) {
    			for (var x in rows) {
    				if (rows[x].description === skills) {
    					subjectid = rows[x].subject_id;
    				};
    			};
                console.log(subjectid + 'skills');
                if (subjectid === null) {
                	sql_subject_add = 'INSERT INTO Subjects (description) VALUES ("' + skills + '")';
                	pool.query(sql_subject_add, function(err, rows, fields) {
                		pool.query(sqlStatement_subjects, function(err, rows, fields) {
                			for (var x in rows) {
                				if (rows[x].description === skills) {
                					subjectid = rows[x].subject_id;
                				};
                			};
                            console.log(subjectid + 'skills3');
                            sql_expert_subject = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES ("' + userid + '","' + subjectid + '")';
                            pool.query(sql_expert_subject, function(err, rows, fields) {

                            });
                        });
                    });
                };

                console.log(subjectid + 'skills2');
                sql_expert_subject = 'INSERT INTO ExpertSubjects (user_id, subject_id) VALUES ("' + userid + '","' + subjectid + '")';
    			pool.query(sql_expert_subject, function(err, rows, fields) {

    		      });
            });

    		sqlStatement_organizations = 'SELECT * From Organizations WHERE description = "' + organizations + '"';
    		var orgid = null;
    		pool.query(sqlStatement_organizations, function(err, rows, fields) {
    			for (var x in rows) {
    				if (rows[x].description === organizations) {
    					orgid = rows[x].org_id;
    				};
    			};
                console.log(orgid + 'org');
                if (orgid === null) {
                	sql_organization_add = 'INSERT INTO Organizations (description) VALUES ("' + organizations + '")';
                	pool.query(sql_organization_add, function(err, rows, fields) {
                		pool.query(sqlStatement_organizations, function(err, rows, fields) {
                			for (var x in rows) {
                				if (rows[x].description === organizations) {
                					orgid = rows[x].org_id;
                				};
                			};

                			console.log(orgid +' org2');
                			sql_expert_organizations = 'INSERT INTO ExpertOrganizations (user_id, org_id) VALUES ("' + userid + '","' + orgid + '")';
    						pool.query(sql_expert_organizations, function(err, rows, fields) {
    							res.render('addExpert', {
        							message: 'Expert' + " " + first_name + " " + last_name + " " + 'has been added',
        							messageClass: 'alert-success'
        						});
    						});
                		});
                	});
                };
                
                sql_expert_organizations = 'INSERT INTO ExpertOrganizations (user_id, org_id) VALUES ("' + userid + '","' + orgid + '")';
    			pool.query(sql_expert_organizations, function(err, rows, fields) {
    				res.render('addExpert', {
        				message: 'Expert' + " " + first_name + " " + last_name + " " + 'has been added',
        				messageClass: 'alert-success'
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
    console.log(req.query);

    let isLoggedOn;
    isLoggedOn = false;
    if (req.user) {
        console.log(req.user);
        isLoggedOn = true;
        sqlUser = req.user;
    };

    if (req.query.ExpertUser) {
        console.log(req.query.ExpertUser);
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

        var OrganizationSqlStatement = 'SELECT description FROM Organizations LEFT JOIN ExpertOrganizations ON ExpertOrganizations.org_id = Organizations.org_id LEFT JOIN Users ON ExpertOrganizations.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';
        
        pool.query(SubjectSqlStatement, function (err, Subjects, fields) {

            var SubjectsString = JSON.stringify(Subjects);
            console.log(SubjectsString);

            pool.query(ClassSqlStatement, function (err, Classes, fields) {

                var ClassesString = JSON.stringify(Classes);
                console.log(ClassesString);

                pool.query(LinksSqlStatement, function (err, Links, fields) {
                    
                    var LinksString = JSON.stringify(Links);
                    console.log(LinksString);
                    
                    pool.query(OrganizationSqlStatement, function (err, Organizations, fields) {

                        var OrganizationsString = JSON.stringify(Organizations);
                        console.log(OrganizationsString);
                        res.render('basicProfile', {
                            isLoggedOn: isLoggedOn,
                            Userinfo: Userinfo,
                            Subjects: Subjects,
                            Classes: Classes,
                            Links : Links,
                            Organizations : Organizations
                        });
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
    
    console.log('KARI THINKS IM DOING MY SQL TWICE');
    if(req.query.searchType === 'Name'){
        //console.log(req.query.searchType);
        var context = [];
        var searchTermFormatted = "%" + req.query.searchTerm + "%";
        //irstName LIKE ? OR lastname LIKE ?"
        pool.query("SELECT * FROM Users WHERE firstName LIKE ?", searchTermFormatted, function (err, rows, fields) {
            //var sendData = JSON.stringify(rows);
            var tasks = 0;
            for(var x in rows){ tasks++};
            //console.log(tasks);
            //console.log(err);
            //console.log(rows);
            
            function taskComplete(){
                tasks--;
                if(tasks <= 0){
                    console.log("ARRAY LENGTH");
                    console.log(context.length);
                    console.log(JSON.stringify(context));
                    res.render('searchResult', context);
                    //res.redirect(301,'/searchResult');
                }
            }
            
            for(var x in rows){
                sqlUser = rows[x].username;
                var UserSqlStatement = 'SELECT firstName, lastName, username FROM Users WHERE Users.username = "' + sqlUser + '"';
                pool.query(UserSqlStatement, function (err, Userinfo, fields) {

                    var SubjectSqlStatement = 'SELECT description FROM Subjects LEFT JOIN ExpertSubjects ON ExpertSubjects.subject_id = Subjects.subject_id LEFT JOIN Users ON ExpertSubjects.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                    var ClassSqlStatement = 'SELECT description FROM Classes LEFT JOIN ExpertClasses ON ExpertClasses.class_id = Classes.class_id LEFT JOIN Users ON ExpertClasses.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                    var LinksSqlStatement = 'SELECT link, link_type FROM ExpertLinks LEFT JOIN Users ON ExpertLinks.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                    pool.query(SubjectSqlStatement, function (err, Subjects, fields) {

                        var SubjectsString = JSON.stringify(Subjects);
                        //console.log(SubjectsString);

                        pool.query(ClassSqlStatement, function (err, Classes, fields) {

                            var ClassesString = JSON.stringify(Classes);
                            //console.log(ClassesString);

                            pool.query(LinksSqlStatement, function (err, Links, fields) {
                                var LinksString = JSON.stringify(Links);
                                //console.log(LinksString);
                                context.push({
                                    Userinfo: Userinfo,
                                    Subjects: Subjects,
                                    Classes: Classes,
                                    Links : Links
                                });
                                taskComplete();
                                //console.log("scope1");
                                //console.log(context);
                            });
                            //console.log("scope2");
                            //console.log(context);
                        });
                    });
                });
            }
            //console.log("scope3");
            //console.log(context); 
        });
        //console.log("scope4");
        //console.log(context); 
    };
    //res.render('searchResult');
});

/*app.post('/search/search', function (req, res) {
    //console.log(req.body)
    var context = [];
    var searchTermFormatted = "%" + req.body.searchTerm + "%";
    //irstName LIKE ? OR lastname LIKE ?"
    pool.query("SELECT * FROM Users WHERE firstName LIKE ?", searchTermFormatted, function (err, rows, fields) {
        var sendData = JSON.stringify(rows);
        var tasks = 0;
        //res.redirect(301,'/searchResult');
        for(var x in rows){ tasks++}
        //console.log(size);
        //res.send(sendData);
        //console.log(err);
        //console.log(rows);
        
        function taskComplete(){
            tasks--;
            if(tasks <= 0){
                console.log(context);
                res.render('searchResult', context);
                //res.redirect(301,'/searchResult');
            }
        }
        
        for(var x in rows){
            sqlUser = rows[x].username;
            var UserSqlStatement = 'SELECT firstName, lastName, username FROM Users WHERE Users.username = "' + sqlUser + '"';
            pool.query(UserSqlStatement, function (err, Userinfo, fields) {

                var SubjectSqlStatement = 'SELECT description FROM Subjects LEFT JOIN ExpertSubjects ON ExpertSubjects.subject_id = Subjects.subject_id LEFT JOIN Users ON ExpertSubjects.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                var ClassSqlStatement = 'SELECT description FROM Classes LEFT JOIN ExpertClasses ON ExpertClasses.class_id = Classes.class_id LEFT JOIN Users ON ExpertClasses.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                var LinksSqlStatement = 'SELECT link, link_type FROM ExpertLinks LEFT JOIN Users ON ExpertLinks.user_id = Users.user_id WHERE Users.username = "' + sqlUser + '"';

                pool.query(SubjectSqlStatement, function (err, Subjects, fields) {

                    var SubjectsString = JSON.stringify(Subjects);
                    //console.log(SubjectsString);

                    pool.query(ClassSqlStatement, function (err, Classes, fields) {

                        var ClassesString = JSON.stringify(Classes);
                        //console.log(ClassesString);

                        pool.query(LinksSqlStatement, function (err, Links, fields) {
                            var LinksString = JSON.stringify(Links);
                            //console.log(LinksString);
                            context.push({
                                Userinfo: Userinfo,
                                Subjects: Subjects,
                                Classes: Classes,
                                Links : Links
                            });
                            taskComplete();
                            //console.log("scope1");
                            //console.log(context);
                        });
                        //console.log("scope2");
                        //console.log(context);
                    });
                });
            });
        }
        //console.log("scope3");
        //console.log(context); 
    });
    //console.log("scope4");
    //console.log(context); 

});
*/

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