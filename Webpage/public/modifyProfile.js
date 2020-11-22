document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
  document.getElementById('addSkillButton').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {userID:2, skill:3};
    //payload.skill = document.getElementById('searchSkillInput').value;
    
    // Insert into the skills table sql statement 
    // Ok inserting a skill against a user takes three steps:
    // 1. Insert the subject here - replace Subjects with classes.  Once it does
    //    the database will autopopulate the key (unique identifier) with an incremented 
    //    value. The description is something like "Python" or "C++" 
    //sqlStatement = "INSERT INTO Subjects (description) VALUES (?, ?, ?, ?)", [<user input>]];
    // 2. Do a select statement to pull the identifier from the database.  
    //  var sqlStatement = "SELECT * FROM `Subjects` WHERE description = <user input>;
    // pool.query(sqlStatement, function(err, result, fields)
    // {
    //    var userInfo = JSON.stringify(result);
    //    console.log(userInfo);
    //    res.send(userInfo);
    //});
    // 3. Use the pulled statement to insert the skill against the user.
    // var sqlStatement = "INSERT INTO ExpertSubjects VALUES (?, ?)", [<id of user>, <step 2 value>];
    // 
    // Alternatively you can combine the sql statements in 2 and 3, but I would recommend sticking 
    // with this simplistic view to minimize complexity and allow for an easier debugging experience
    // You should have the user id from the profile pulled already

    req.open('POST', '/basicProfileModify/addSkill', true);
    req.setRequestHeader('Content-Type', 'application/json');
    req.addEventListener('load', function(){
      if(req.status >= 200 && req.status < 400){
        //DO STUFF HERE                
      }
    });
    req.send(JSON.stringify(payload));
    event.preventDefault();    
  });
}

