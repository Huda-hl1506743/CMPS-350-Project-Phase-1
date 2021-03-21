
////////////////////////////////////////
//Principle Duo Payments Report Builder

function buildDuoPayments(paymentRepository) {
    let welcomeMessageDiv = document.querySelector('#welcome');
    let payments = paymentRepository.getPendingPayments();

    let date = new Date();
    let firstDay = new Date(date.getFullYear(), 1, 1).getTime();
    let lastDay = new Date(date.getFullYear() + 1, 1, 0).getTime();

    //Getting Current Date Payments
    let data = payments.filter(payment => {
        let time = new Date(payment.date).getTime();

        return (firstDay <= time && time < lastDay);
    });

    let amount = 0;
    let remaining = 0;
    let finalPayment = [];
    for (i = 0; i < data.length; i++) {
        let totalAmount = 0;
        let totalRemaining = 0;
        let studentId = data[i].student_id;
        let currentPayment = null;
        data.forEach(payment => {
            if (payment.student_id === studentId) {
                totalAmount += payment.amount;
                totalRemaining += payment.remaining;
                currentPayment = payment;
            }
        });
        if (!finalPayment.some(payment => payment.id === studentId)) {
            finalPayment.push({
                id: currentPayment.student_id,
                remaining: totalRemaining,
                amount: totalAmount,
                final: totalAmount > totalRemaining ? false : true,
                name: currentPayment.student_name,
                parent_name: currentPayment.parent_name,
                parent_email: currentPayment.parent_email,
                student_grade: currentPayment.student_grade,
                date: currentPayment.date
            });
        }
    }


    let TableRows = finalPayment.map((payment) => {
        amount += payment.amount;
        remaining += payment.remaining;
        return `
      <tr>
        <td>${payment.parent_name}</td>
        <td>${payment.parent_email}</td>
        <td>${payment.name}</td>
        <td>${payment.student_grade}</td>
        <td>${payment.final ? 'Payment was completed' : 'Payment not complete'}</td>
        <td>${new Date(payment.date).toDateString()}</td>
        <td>${payment.remaining}</td>
        <td>${payment.amount}</td>
      </tr>
    `});
    TableRows.push(
        `
        <tr>
            <td colspan="6">Total</td>
            <td>${remaining}</td>
            <td>${amount}</td>
        </tr>`
    )

    welcomeMessageDiv.innerHTML = `
    <h1 style="text-align: center; color: gray">
                  Welcome To Payment Management
                </h1>
                <p style="text-align: center; color: black">
                  Duo Payments
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
            <a class="actionButton btn-primary btn" style="cursor: pointer" id="filter">Filter</a>
        </div>
        <table id="t01">
        <tr>
            <th>Parent Name</th>
            <th>Parent Email</th>
            <th>Student Name</th>
            <th>Student Grade</th>
            <th>Payment Status</th>
            <th>Payment Date</th>
            <th>Total Remaining</th>
            <th>Total Amount</th>
        </tr>
        <tbody id="tableBody">
            ${TableRows.join('')}
        </tbody>
        </table>
    </div>
    `;

    let year = date.getFullYear();

    let startDate = document.getElementById('startDate');
    startDate.value = year + "-01-01";
    let endDate = document.getElementById('endDate');
    endDate.value = (year + 1) + "-01-01";

    //Normal Filter
    document.querySelector('#filter').addEventListener('click', () => {
        let sd = new Date(startDate.value).getTime();
        let ed = new Date(endDate.value).getTime() + parseInt("86394000‬");

        data = payments;
        data = data.filter(payment => {
            let time = new Date(payment.date).getTime();
            return (sd <= time && time < ed);
        });

        amount = 0;
        remaining = 0;
        finalPayment = [];

        for (i = 0; i < data.length; i++) {
            let totalAmount = 0;
            let totalRemaining = 0;
            let studentId = data[i].student_id;
            let currentPayment = null;
            data.forEach(payment => {
                if (payment.student_id === studentId) {
                    totalAmount += payment.amount;
                    totalRemaining += payment.remaining;
                    currentPayment = payment;
                }
            });
            if (!finalPayment.some(payment => payment.id === studentId)) {
                finalPayment.push({
                    id: currentPayment.student_id,
                    remaining: totalRemaining,
                    amount: totalAmount,
                    final: totalAmount > totalRemaining ? false : true,
                    name: currentPayment.student_name,
                    parent_name: currentPayment.parent_name,
                    parent_email: currentPayment.parent_email,
                    student_grade: currentPayment.student_grade,
                    date: currentPayment.date
                });
            }
        }

        let TableRows = finalPayment.map((payment) => {
            amount += payment.amount;
            remaining += payment.remaining;
            return `
          <tr>
            <td>${payment.parent_name}</td>
            <td>${payment.parent_email}</td>
            <td>${payment.name}</td>
            <td>${payment.student_grade}</td>
            <td>${payment.final ? 'Payment was completed' : 'Payment not complete'}</td>
            <td>${new Date(payment.date).toDateString()}</td>
            <td>${payment.remaining}</td>
            <td>${payment.amount}</td>
          </tr>
        `});

        TableRows.push(
            `
            <tr>
                <td colspan="6">Total</td>
                <td>${remaining}</td>
                <td>${amount}</td>
            </tr>`
        );

        document.querySelector('#tableBody').innerHTML = TableRows.join('');
    });
}