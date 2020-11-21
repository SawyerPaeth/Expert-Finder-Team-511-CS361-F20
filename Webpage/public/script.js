
function login(event)
{
    var loginForm = document.getElementById("login");
    var req = new XMLHttpRequest();
    // Yes this is a bad idea - the password is shown in the clear will fix later
    payload = "/login?username=" + loginForm.elements.username.value + "&password=" + loginForm.elements.password.value;

    req.open("GET", payload, true);

    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    req.send(null);
    // Add the event listener for loading the next page
    req.addEventListener("load", function()
    {

    });

}

function register(event)
{
    var registerForm = document.getElementById("register");
    var req = new XMLHttpRequest();
    console.log("Got here");

    payload = "/registeruser?username=" + registerForm.elements.username.value + "&firstname=" + registerForm.elements.firstname.value + "&lastname=" + registerForm.elements.lastname.value + "&password=" + registerForm.elements.password.value;
    
    req.open("GET", payload, true);
    req.send(null);
    // Add the event listener for loading
    req.addEventListener("load", function()
    {
        console.log("Got here");
    });

}

function createListeners()
{
    document.getElementById("loginbutton").addEventListener("click", login);
    document.getElementById("registerbutton").addEventListener("click", register);
}
document.addEventListener("DOMContentLoaded", createListeners);
