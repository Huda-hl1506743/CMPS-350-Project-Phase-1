import * as userRepository from './userRepository.js';
import * as paymentRepository from './paymentRepository.js';
import * as bussRepository from './bussRepository.js';
import initData from './dataLoader.js';

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
let user = userRepository.firstTime();
if (user == false) {
  userRepository.setSession(User);
  initData(); //Load fake data into local storage
  userRepository.setFirstTime(); //Set that website has ben loaded.
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Init Function:

let init = () => {
  User = userRepository.getLoginStatus();

  if (User == false) {
    //User is not loggedIn
  } else {
    if (User.type == 'principle') {
      //Setting Principle NavBar
      headDiv.innerHTML =
        `<div id="navBar">
            <div>
              <ul>
                <li style="float: left">
                  <a style="cursor: pointer" class="TITLE">Payment Management</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="pendingPayments">Pending Payments</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="bussServices">Buss Service</a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="receivedPaymentsReport">
                    Get Received Payment Report
                  </a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="pendingPaymentsReport">
                    Get Pending Payment Report
                  </a>
                </li>
                <li style="float: left">
                  <a style="cursor: pointer" id="duePayments">
                    Generate Due Payments
                  </a>
                </li>
                <li style="float: right">
                  <a style="cursor: pointer" id="logout">Logout</a>
                </li>
                <li style="float: right"><a id="userEmail"></a></li>
              </ul>
            </div>
            <div align="center" id="welcome">
              
            </div>
          </div>`;
      buildPrincipleNavBar();
    } else {
      //Setting Parents NavBar
      headDiv.innerHTML =
        `<div id="navBar">
          <div>
            <ul>
              <li style="float: left">
                <a style="cursor: pointer" class="TITLE">Payment Management</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="pendingPayments">Pending Payments</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="bussServices">Buss Service</a>
              </li>
              <li style="float: left">
                <a style="cursor: pointer" id="paymentHistory">Payment History</a>
              </li> 
              <li style="float: right">
                <a style="cursor: pointer" id="logout">Logout</a>
              </li>
              <li style="float: right"><a id="userEmail"></a></li>
            </ul>
          </div>
          <div align="center" id="welcome">
            
          </div>
        </div>`;
      buildParentNavBar(User);
    }

    //Logout Functionality
    let logoutButton = document.querySelector('#logout');
    logoutButton.addEventListener('click', function () {
      userRepository.setSession({
        isLoggedIn: false,
        email: '',
        type: ''
      });
      location.reload();
    });
  }
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Principle Functionality

function buildPrincipleNavBar() {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let bussServicesButton = document.querySelector('#bussServices');
  let receivedPaymentsReportButton = document.querySelector('#receivedPaymentsReport');
  let pendingPaymentsReportButton = document.querySelector('#pendingPaymentsReport');
  let duePaymentsButton = document.querySelector('#duePayments');


  pendingPaymentsButton.addEventListener("click", () => buildPendingPayments(paymentRepository));
  bussServicesButton.addEventListener("click", () => buildBussServicePayment(bussRepository));
  receivedPaymentsReportButton.addEventListener('click', () => buildReceivedPaymentsReport(paymentRepository));
  pendingPaymentsReportButton.addEventListener('click', () => buildPendingPaymentsReport(paymentRepository));
};

//buildPendingPayments ==> /principle/buildPendingPayments.js

//buildBussServicePayment ==> /principle/buildBussServicePayment.js

//buildReceivedPaymentsReport ==> /principle/buildPendingPaymentsReport.js

//buildPendingPaymentsReport ==> /principle/buildPendingPaymentsReport.js

//buildDuoPayments ==> /principle/buildDuoPayments.js



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parents Functionality

function buildParentNavBar(user) {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let bussServicesButton = document.querySelector('#bussServices');
  let paymentHistoryButton = document.querySelector('#paymentHistory');

  pendingPaymentsButton.addEventListener('click', () => buildParentsPendingPayments(user, paymentRepository));
  bussServicesButton.addEventListener('click', () => buildParentBussService(user, bussRepository, userRepository));
  paymentHistoryButton.addEventListener('click', () => buildParentPaymentHistory(user, paymentRepository));
}


// buildParentsPendingPayments ==> /parent/buildPendingPayments.js

// buildParentBussService ==> /parent/buildBussService.js

// buildParentPaymentHistory ==> /parent/buildPaymentHistory.js

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//Call of Init

init();
