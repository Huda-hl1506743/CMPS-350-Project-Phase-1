export function getPendingPayments() {
    let payments = [];
    if (localStorage.getItem('payments'))
        payments = JSON.parse(localStorage.getItem('payments'));
    return payments;
}