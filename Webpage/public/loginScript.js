

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
    document.getElementById("registerbutton").addEventListener("click", register);
}
document.addEventListener("DOMContentLoaded", createListeners);
