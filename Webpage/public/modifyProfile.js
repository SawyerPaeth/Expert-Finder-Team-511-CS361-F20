document.addEventListener('DOMContentLoaded', bindButtons);

function bindButtons(){
  document.getElementById('addSkillButton').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {userID:2, skill:3};
    //payload.skill = document.getElementById('searchSkillInput').value;

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

