import * as userRepository from '../js/userRepository.js';

//SELECT DOM
const headDiv = document.querySelector("#navBar");
const bodyDiv = document.querySelector("#mainBody");
const footDiv = document.querySelector("#footer");


//User Session Object
let User = {
    isLoggedIn: false,
    email: '',
    type: ''
};


//Check if first time entering
if (userRepository.getSession() == null) {
    userRepository.setSession(User);
}

let clear = () => {
    headDiv.innerHTML = '';
    bodyDiv.innerHTML = '';
    footDiv.innerHTML = '';
}

let Refresh = () => {

    User = userRepository.getSession();
    clear();

    if (User.isLoggedIn == false) {
        //User is not loggedIn
    } else {
        // User is logged in Redirect to his view
    }
}

