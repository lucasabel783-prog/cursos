function addZero(number) {
    return number < 10 ? `0${number}` : number;
}

function updateClock() {
    const now = new Date();

    const hours = addZero(now.getHours());
    const minutes = addZero(now.getMinutes());
    const seconds = addZero(now.getSeconds());

    document.getElementById('hour').innerText = hours;
    document.getElementById('minute').innerText = minutes;
    document.getElementById('second').innerText = seconds;
}

updateClock();
setInterval(updateClock, 1000);
