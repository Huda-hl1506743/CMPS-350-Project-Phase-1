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


  pendingPaymentsButton.addEventListener("click", buildPendingPayments);
  bussServicesButton.addEventListener("click", buildBussServicePayment);
  receivedPaymentsReportButton.addEventListener('click', buildPendingPaymentsReport);
  pendingPaymentsReportButton.addEventListener('click', buildPendingPaymentsReportButton);
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
      <td>${payment.type} Fee</td>
      <td>${payment.remaining}</td>
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
      <th>Payment Category</th>
      <th>Remaining Amount</th>
      <th>Initial Amount</th>
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

function buildPaymentRows(array) {
  return array.map((payment) => `
  <tr>
    <td>${payment.student}</td>
    <td>${payment.email}</td>
    <td>${payment.type}</td>
    <td>${payment.category} Fee</td>
    <td>${payment.amount}</td>
    <td>${payment.remaining}</td>
    <td>${new Date(payment.date).toDateString()}</td>
  </tr>
`);
}

function buildPendingPaymentsReport() {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPaymentHistory();

  let date = new Date();
  let firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getTime();
  let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
  let amount = 0;
  //Getting Current Date Payments
  let data = payments.filter(payment => {
    let time = new Date(payment.date).getTime();

    return (firstDay <= time && time < lastDay);
  });

  data.forEach(payment => { amount += parseInt(payment.amount); });

  let TableRows = buildPaymentRows(data);

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
  <div>
    <div class="filter">
      <label>Filter Data By Category:</label>
      <select id="filterType" class="form-select w-40">
        <option value="all">All</option>
        <option value="Tuition">Tuition Fee</option>
        <option value="Transportation">Transportation Fee</option>
        <option value="Admission">Admission Fee</option>
      </select>
      <label>Start Date:</label>
      <input type="date" id="startDate">
      <label>End Date:</label>
      <input type="date" id="endDate"">
      <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
    </div>
    <div class="filter">
      <input type="text" id="searchBar" placeholder="Enter Students' Name" class="search-bar">
    </div>
    <table id="t01">
      <tr>
        <th>Student Name</th>
        <th>Parent Email</th>
        <th>Payment Type</th>
        <th>Category</th>
        <th>Received</th>
        <th>Remaining</th>
        <th>Date</th>
      </tr>
      <tbody id="tableBody">
        ${TableRows.join('')}
        <tr>
          <td colspan="5">Total Received</td>
          <td colspan="2" id="amount">${amount}</td>
        </tr>
      </tbody>
    </table>
  </div>
  `;

  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  let today = year + "-" + month + "-" + day;

  let startDate = document.getElementById('startDate');
  startDate.value = today;
  let endDate = document.getElementById('endDate');
  endDate.value = today;

  //Normal Filter
  document.querySelector('#filter').addEventListener('click', () => {
    let searchValue = document.getElementById('searchBar').value;
    searchValue = searchValue.toUpperCase();
    let filterType = document.getElementById('filterType').value;
    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    data = payments;
    amount = 0;

    if (searchValue.length != 0)
      data = data.filter(payment => {
        let time = new Date(payment.date).getTime();
        if (filterType === 'all')
          return (payment.student.toUpperCase().indexOf(searchValue) !== -1 && sd <= time && time < ed);
        return (sd <= time && time < ed && payment.category == filterType && payment.student.toUpperCase().indexOf(searchValue) !== -1);
      });
    else
      data = data.filter(payment => {
        let time = new Date(payment.date).getTime();
        if (filterType === 'all')
          return (sd <= time && time < ed);
        return (sd <= time && time < ed && payment.category == filterType);
      });

    data.forEach(payment => { amount += parseInt(payment.amount); });
    TableRows = buildPaymentRows(data);
    TableRows.push(
      `<tr>
      <td colspan="5">Total Received</td>
      <td colspan="2" id="amount">${amount}</td>
    </tr>`
    );

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });

  document.querySelector('#searchBar').addEventListener('keyup', () => {
    let searchValue = document.getElementById('searchBar').value;
    searchValue = searchValue.toUpperCase();
    let filterType = document.getElementById('filterType').value;

    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    data = payments;
    amount = 0;

    data = data.filter(payment => {
      let time = new Date(payment.date).getTime();
      if (filterType === 'all')
        return (payment.student.toUpperCase().indexOf(searchValue) !== -1 && sd <= time && time < ed);
      return (sd <= time && time < ed && payment.category == filterType && payment.student.toUpperCase().indexOf(searchValue) !== -1);
    });

    data.forEach(payment => { amount += parseInt(payment.amount); });
    TableRows = buildPaymentRows(data);
    TableRows.push(
      `<tr>
      <td colspan="5">Total Received</td>
      <td colspan="2" id="amount">${amount}</td>
    </tr>`);

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}

function buildPendingPaymentsReportButton() {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return payment.pending === true });

  let remaining = 0;
  let amount = 0;

  let TableRows = payments.map((payment) => {
    remaining += payment.remaining;
    amount += payment.amount;
    return `
    <tr>
      <td>${payment.parent_name}</td>
      <td>${payment.parent_email}</td>
      <td>${payment.student_name}</td>
      <td>${payment.student_grade}</td>
      <td>${payment.type} Fee</td>
      <td>${payment.remaining}</td>
      <td>${payment.amount}</td>
    </tr>
  `});
  TableRows.push(
    `<tr>
    <td colspan="5">Total Received</td>
    <td  id="remaining">${remaining}</td>
    <td  id="initial">${amount}</td>
  </tr>`
  );

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
  <div>
    <div class="filter">
      <label>Filter Data By Category:</label>
      <select id="filterType" class="form-select w-40">
        <option value="all">All</option>
        <option value="Tuition">Tuition Fee</option>
        <option value="Transportation">Transportation Fee</option>
        <option value="Admission">Admission Fee</option>
      </select>
      <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
    </div>
    <table id="t01">
      <tr>
        <th>Parent Name</th>
        <th>Parent Email</th>
        <th>Student Name</th>
        <th>Student Grade</th>
        <th>Payment Category</th>
        <th>Remaining Amount</th>
        <th>Initial Amount</th>
      </tr>
      <tbody id="tableBody">
        ${TableRows.join('')}
      </tbody>
    </table>
  </div>
  `;

  document.getElementById('filter').addEventListener('click', () => {
    let filterType = document.getElementById('filterType').value;

    let data = payments;

    amount = 0;
    remaining = 0;

    data = data.filter(payment => {
      if (filterType === 'all')
        return true;
      return (payment.type == filterType);
    });

    TableRows = data.map((payment) => {
      remaining += payment.remaining;
      amount += payment.amount;
      return `
      <tr>
        <td>${payment.parent_name}</td>
        <td>${payment.parent_email}</td>
        <td>${payment.student_name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.type} Fee</td>
        <td>${payment.remaining}</td>
        <td>${payment.amount}</td>
      </tr>
    `});

    TableRows.push(
      `<tr>
      <td colspan="5">Total Received</td>
      <td  id="remaining">${remaining}</td>
      <td  id="initial">${amount}</td>
    </tr>`
    );

    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Parents Functionality

function buildParentNavBar(user) {
  //NAVBAR BUTTONS
  let pendingPaymentsButton = document.querySelector('#pendingPayments');
  let bussServicesButton = document.querySelector('#bussServices');
  let paymentHistoryButton = document.querySelector('#paymentHistory');

  pendingPaymentsButton.addEventListener('click', () => buildParentsPendingPayments(user));
  bussServicesButton.addEventListener('click', () => buildParentBussService(user));
  paymentHistoryButton.addEventListener('click', () => buildParentPaymentHistory(user));
}



function buildParentsPendingPayments(user) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPendingPayments();
  payments = payments.filter((payment) => { return (payment.pending === true && payment.parent_email === user.email) });

  let TableRows = payments.map((payment) => `
    <tr id="payment_${payment.id}">
      <td>${payment.student_name}</td>
      <td>${payment.student_grade}</td>
      <td>${payment.type} Fee</td>
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

function buildSelectOptions(array) {
  return array.map(child =>
    `
    <option value="${child.id}">${child.name}</option>
    `
  );
}

function buildRows(array) {
  return array.map((request) => `
  <tr>
    <td>${request.parent_name}</td>
    <td>${request.parent_email}</td>
    <td>${request.student_name}</td>
    <td>${request.status}</td>
    <td>
      <div id="request_${request.id}">
        <input type="text" class="actionWrapperText" readonly value="${request.comment || 'none'}"/>
      </div>
    </td>
  </tr>
`);
}

function buildBussServiceBody(selectOptions, TableRows) {
  bodyDiv.innerHTML = `
  <div>
    <div class="filter">
      <label>Request Service For Student:</label>
      <select id="studentId" class="form-select" style="width: 100px">
      ${selectOptions.join('')}
      </select>
      <a class="actionButton btn-primary btn" style="cursor: pointer" id="requestService">Request</a>
    </div>
    <table id="t01">
      <tr>
        <th>Parent Name</th>
        <th>Parent Email</th>
        <th>Student Name</th>
        <th>Status</th>
        <th>Comments</th>
      </tr>
      ${TableRows.join('')}
    </table>
  </div>
  `;
}

function buildParentBussService(user) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let requests = bussRepository.bussRepository();
  requests.filter((request) => { return request.parent_email === user.email });
  let users = userRepository.getUsers();
  let childrenWithService = requests.map(u => u.child_id);
  user = users.filter(u => u.email === user.email)[0];
  let childrenWithNoServices = user.children.filter(u => !childrenWithService.includes(u.id));

  let selectOptions = buildSelectOptions(childrenWithNoServices);

  let TableRows = buildRows(requests);

  welcomeMessageDiv.innerHTML = `
  <h1 style="text-align: center; color: gray">
                Welcome To Payment Management
              </h1>
              <p style="text-align: center; color: black">
                Here are the List of Pending Payments
              </p>
              <br /><br />
  `;

  buildBussServiceBody(selectOptions, TableRows);

  document.querySelector('#requestService').addEventListener('click', () => {
    let selectedChild = document.getElementById('studentId').value;
    requests = bussRepository.bussRepository();
    selectedChild = childrenWithNoServices.find((u) => u.id == selectedChild);
    childrenWithNoServices.splice(childrenWithNoServices.indexOf(selectedChild), 1);

    selectOptions = buildSelectOptions(childrenWithNoServices)
    document.getElementById('studentId').innerHTML = selectOptions.join('');

    requests.push({
      "id": requests.length + 1,
      "student_name": selectedChild.name,
      "status": "pending",
      "child_id": selectedChild.id,
      "final": false,
      "parent_name": user.name,
      "parent_email": user.email,
      "comment": ''
    });
    bussRepository.setRequests(requests);

    TableRows = buildRows(requests);

    buildBussServiceBody(selectOptions, TableRows);
  })
}

function buildParentPaymentHistory(user) {
  let welcomeMessageDiv = document.querySelector('#welcome');
  let payments = paymentRepository.getPaymentHistory();
  payments = payments.filter((payment) => { return (payment.email === user.email) });

  let TableRows = payments.map((payment) => `
    <tr id="payment_${payment.id}">
      <td>${payment.student}</td>
      <td>${payment.type}</td>
      <td>${payment.amount}</td>
      <td>${payment.remaining}</td>
      <td>${new Date(payment.date).toDateString()}</td>
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
  <div>
    <div class="filter">
      <label>Start Date:</label>
      <input type="date" id="startDate">
      <label>End Date:</label>
      <input type="date" id="endDate"">
      <a class="filter-btn" id="filter" style="cursor: pointer">Filter</a>
    </div>
    <table id="t01">
      <tr>
        <th>Student Name</th>
        <th>Payment Type</th>
        <th>Payed Amount</th>
        <th>Remaining Amount</th>
        <th>Date</th>
      </tr>
      <tbody id="tableBody">
        ${TableRows.join('')}
      <tbody>
    </table>
  </div>
  `;

  let date = new Date();
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  let today = year + "-" + month + "-" + day;

  let startDate = document.getElementById('startDate');
  startDate.value = today;
  let endDate = document.getElementById('endDate');
  endDate.value = today;

  //Filter Function
  document.querySelector('#filter').addEventListener('click', () => {
    let sd = new Date(startDate.value).getTime();
    //End date is the end of the day so 86394000 is 23 hours 59 minutes 59 seconds in milliseconds
    let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

    let payments = paymentRepository.getPaymentHistory();

    payments = payments.filter(payment => {
      let time = new Date(payment.date).getTime();
      return (sd <= time && time < ed && payment.email === user.email);
    });
    let TableRows = payments.map((payment) => `
      <tr id="payment_${payment.id}">
        <td>${payment.student}</td>
        <td>${payment.type}</td>
        <td>${payment.amount}</td>
        <td>${payment.remaining}</td>
        <td>${new Date(payment.date).toDateString()}</td>
      </tr>
    `);
    document.querySelector('#tableBody').innerHTML = TableRows.join('');
  });
}

init();
