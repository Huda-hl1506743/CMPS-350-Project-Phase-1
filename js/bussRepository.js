export function bussRepository() {
    let requests = [];
    if (localStorage.getItem('buss'))
        requests = JSON.parse(localStorage.getItem('buss'));
    return requests;
}

export function setRequests(requests) {
    localStorage.setItem('buss', JSON.stringify(requests));
}