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
  let receivedPaymentsReportButton = document.querySelector('receivedPaymentsReport');
  let pendingPaymentsReportButton = document.querySelector('pendingPaymentsReport');
  let duePaymentsButton = document.querySelector('duePayments');


  pendingPaymentsButton.addEventListener("click", buildPendingPayments);
  bussServicesButton.addEventListener("click", buildBussServicePayment);
};


function buildPendingPayments() {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return payment.pending === true });

  let TableRows = payments.map((payment) => `
    <tr>
      <td>${payment.parent_name}</td>
      <td>${payment.parent_email}</td>
      <td>${payment.student_name}</td>
      <td>${payment.student_grade}</td>
      <td>${payment.type === 'default' ? 'Tuition Fee' : 'Buss Service'}</td>
      <td>${payment.remaining}</td>
    </tr>
  `);

  welcomeMessageDiv.innerHTML = `
  <h1 style="text-align: center; color: gray">
                Welcome To Payment Management
              </h1>
              <p style="text-align: center; color: black">
                Here are the List of Pending Payments
              </p>
              <br /><br />
  `;

  bodyDiv.innerHTML = `
  <table id="t01">
    <tr>
      <th>Parent Name</th>
      <th>Parent Email</th>
      <th>Student Name</th>
      <th>Student Grade</th>
      <th>Payment Type</th>
      <th>Payment Amount</th>
    </tr>
    ${TableRows.join('')}
  </table>
  `;
}

function acceptRequest(id) {
  let requests = bussRepository.bussRepository();
  requests.forEach((request) => {
    if (request.id === id) {
      request.final = true;
      request.status = 'Accepted'
    }
  });
  bussRepository.setRequests(requests);
  let actionTD = document.querySelector('#request_'.concat(id));
  actionTD.innerHTML = 'Accepted';
}

function rejectRequest(id) {
  let requests = bussRepository.bussRepository();
  requests.forEach((request) => {
    if (request.id === id) {
      request.final = true;
      request.status = 'Rejected'
    }
  });
  bussRepository.setRequests(requests);
  let actionTD = document.querySelector('#request_'.concat(id));
  actionTD.innerHTML = 'Rejected';
}

function addComment(id) {
  let requests = bussRepository.bussRepository();
  let commentValue = document.getElementById('comment'.concat(id)).value;
  requests.forEach((request) => {
    if (request.id === id) {
      request.comment = commentValue;
    }
  });
  bussRepository.setRequests(requests);
}

function buildBussServicePayment() {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let requests = bussRepository.bussRepository();
  requests = requests.filter((request) => { return request.final === false });

  let TableRows = requests.map((request) => `
    <tr>
      <td>${request.parent_name}</td>
      <td>${request.parent_email}</td>
      <td>${request.student_name}</td>
      <td>
        <div id="request_${request.id}">
          <a class="actionButton btn-primary btn" style="cursor: pointer" id="acceptRequest_${request.id}">Accept</a>
          <a class="actionButton btn-danger btn" style="cursor: pointer" id="rejectRequest_${request.id}">Reject</a>
          <input type="text" class="actionWrapper" placeholder="Comment" id="comment${request.id}" value="${request.comment}"/>
          <a class="actionButton btn-success btn" style="cursor: pointer" id="comment_${request.id}">Add Comment </a>
        </div>
      </td>
    </tr>
  `);

  welcomeMessageDiv.innerHTML = `
  <h1 style="text-align: center; color: gray">
                Welcome To Payment Management
              </h1>
              <p style="text-align: center; color: black">
                Here are the List of Pending Payments
              </p>
              <br /><br />
  `;

  bodyDiv.innerHTML = `
  <table id="t01">
    <tr>
      <th>Parent Name</th>
      <th>Parent Email</th>
      <th>Student Name</th>
      <th>Actions</th>
    </tr>
    ${TableRows.join('')}
  </table>
  `;
  requests.forEach((request => {
    let acceptBtn = document.querySelector('#acceptRequest_'.concat(request.id));
    let rejectBtn = document.querySelector('#rejectRequest_'.concat(request.id));
    let addCommentBtn = document.querySelector('#comment_'.concat(request.id));

    acceptBtn.addEventListener('click', () => { acceptRequest(request.id) });
    rejectBtn.addEventListener('click', () => { rejectRequest(request.id) });
    addCommentBtn.addEventListener('click', () => { addComment(request.id) });
  }))
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parents Functionality

function buildParentNavBar(user) {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let bussServicesButton = document.querySelector('#bussServices');
  let paymentHistoryButton = document.querySelector('#paymentHistory');

  pendingPaymentsButton.addEventListener('click', () => buildParentsPendingPayments(user));
}

function buildParentsPendingPayments(user) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return (payment.pending === true && payment.parent_email === user.email) });

  let TableRows = payments.map((payment) => `
    <tr id="payment_${payment.id}">
      <td>${payment.student_name}</td>
      <td>${payment.student_grade}</td>
      <td>${payment.type === 'default' ? 'Tuition Fee' : 'Buss Service'}</td>
      <td id="amount${payment.id}">${payment.remaining}</td>
      <td>
        <div>
          <input type="number" class="actionWrapper" placeholder="Amount" id="amount_${payment.id}" max="${payment.remaining}" min="1" />
          <select name="payment_method" id="payment_method${payment.id}" class="form-select">
            <option value="1">Cash</option>
            <option value="2">Bank Card</option>
            <option value="3">Credit Card</option>
            <option value="4">Cheque</option>
            <option value="5">Bank Deposit</option>
          </select>
          <a class="actionButton btn-primary btn" style="cursor: pointer" id="pay_${payment.id}">Pay</a>
          <span class="help-block" id="payment_error${payment.id}"></span>
        </div>
      </td>
    </tr>
  `);

  welcomeMessageDiv.innerHTML = `
  <h1 style="text-align: center; color: gray">
                Welcome To Payment Management
              </h1>
              <p style="text-align: center; color: black">
                Here is the list of your Pending Payments
              </p>
              <br /><br />
  `;

  bodyDiv.innerHTML = `
  <table id="t01">
    <tr>
      <th>Student Name</th>
      <th>Student Grade</th>
      <th>Payment Type</th>
      <th>Remaining Amount</th>
      <th>Pay Now</th>
    </tr>
    ${TableRows.join('')}
  </table>
  `;

  payments.forEach((payment => {
    let payButton = document.querySelector('#pay_'.concat(payment.id));
    let errorSpan = document.querySelector('#payment_error'.concat(payment.id));
    let row = document.querySelector('#payment_'.concat(payment.id));

    payButton.addEventListener('click', () => {
      errorSpan.innerHTML = '';
      let paidAmount = document.getElementById('amount_'.concat(payment.id)).value;
      let paymentType = document.getElementById('payment_method'.concat(payment.id)).value;

      if (paidAmount > payment.remaining || paidAmount < 1)
        errorSpan.innerHTML = 'Error Paid Amount Invalid';
      else {
        let remainingAmount = payment.remaining - paidAmount;
        if (remainingAmount == 0) {
          row.parentNode.removeChild(row);
          payment.pending = false;
          payment.remaining = 0;
        } else {
          let paymentAmount = document.getElementById('amount'.concat(payment.id));
          paymentAmount.innerHTML = remainingAmount;
          errorSpan.innerHTML = 'Payment Success';
          payment.remaining = remainingAmount;
        }
        paymentRepository.addNewPayment(payment, paymentType, paidAmount);
      }
    });
  }))
}

init();
