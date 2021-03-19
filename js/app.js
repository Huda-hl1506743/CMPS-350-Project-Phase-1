import * as userRepository from './userRepository.js';
import * as paymentRepository from './paymentRepository.js';
import * as bussRepository from './bussRepository.js';
import initData from './dataLoader.js';
//SELECT DOM
const headDiv = document.querySelector("#navBar");
const bodyDiv = document.querySelector("#mainBody");
const footDiv = document.querySelector("#footer");


//NAV BUTTONS FOR PRINCIPLE:
let pendingPaymentsButton = null;
let bussServicesButton = null;
let receivedPaymentsReportButton = null;
let pendingPaymentsReportButton = null;
let duePaymentsButton = null;

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

let init = () => {
  User = userRepository.getLoginStatus();

  if (User == false) {
    //User is not loggedIn
  } else {
    if (User == 'principle') {
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

    }
  }
}

let buildPrincipleNavBar = () => {
  //NAVBAR BUTTONS
  pendingPaymentsButton = document.querySelector('#pendingPayments');
  bussServicesButton = document.querySelector('#bussServices');
  receivedPaymentsReportButton = document.querySelector('receivedPaymentsReport');
  pendingPaymentsReportButton = document.querySelector('pendingPaymentsReport');
  duePaymentsButton = document.querySelector('duePayments');

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
      <td>${payment.amount}</td>
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

init();
