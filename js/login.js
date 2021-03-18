

const loginButton = document.querySelector("#loginButton");
const emailError = document.querySelector("#emailError");
const passwordError = document.querySelector("#passwordError");


//Event Listeners
document.addEventListener("DOMContentLoaded", () => {

});


let login = () => {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    console.log(email, password);
}

loginButton.addEventListener("click", login);
