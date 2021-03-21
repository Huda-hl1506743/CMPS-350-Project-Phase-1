//This File is responsible for loading all Json Data into local storage for a first run.



const initData = async () => {
    let users = await fetchData('../data/users.json');
    let bussService = await fetchData('../data/bussService.json');
    let payment_bill = await fetchData('../data/payment_bill.json');
    let payments = await fetchData('../data/payments.json');

    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('payments', JSON.stringify(payments));
    localStorage.setItem('buss', JSON.stringify(bussService));
    localStorage.setItem('payment_bill', JSON.stringify(payment_bill));
};

async function fetchData(url) {
    const response = await fetch(url);
    return await response.json();
}

export default initData;