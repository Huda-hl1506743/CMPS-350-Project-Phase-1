export function getSession() {
    return JSON.parse(localStorage.getItem('session'));
}

export function setSession(user) {
    localStorage.setItem('session', JSON.stringify(user));
}