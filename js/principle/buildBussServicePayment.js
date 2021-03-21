////////////////////////////////////////
//Principle Buss Service Builder

function acceptRequest(id, bussRepository) {
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

function rejectRequest(id, bussRepository) {
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

function addComment(id, bussRepository) {
    let requests = bussRepository.bussRepository();
    let commentValue = document.getElementById('comment'.concat(id)).value;
    requests.forEach((request) => {
        if (request.id === id) {
            request.comment = commentValue;
        }
    });
    bussRepository.setRequests(requests);
}

function buildBussServicePayment(bussRepository) {
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

        acceptBtn.addEventListener('click', () => { acceptRequest(request.id, bussRepository) });
        rejectBtn.addEventListener('click', () => { rejectRequest(request.id, bussRepository) });
        addCommentBtn.addEventListener('click', () => { addComment(request.id, bussRepository) });
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
