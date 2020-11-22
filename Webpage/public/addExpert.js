document.addEventListener('DOMContentLoaded', submitButtons);

function submitButtons() {
  document.getElementById('submit_expert').addEventListener('click', function(event){
    var req = new XMLHttpRequest();
    var payload = {first_name: null, last_name: null, email: null, twitter: null, github: null, linkedin: null, classes: null, skills: null, organizations: null};
    payload.first_name = document.getElementById('first_name').value;
    payload.last_name = document.getElementById('last_name').value;
    payload.email = document.getElementById('expert_email').value;
    payload.twitter = document.getElementById('expert_twitter').value;
    payload.github = document.getElementById('expert_github').value;
    payload.linkedin = document.getElementById('expert_linkedin').value;
    payload.classes = document.getElementById('classes').value;
    payload.skills = document.getElementById('skills').value;
    payload.organizations = document.getElementById('organizations').value;

    req.setRequestHeader('Content-Type', 'application/json');
    req.send(JSON.stringify(payload));
    event.preventDefault();
  })