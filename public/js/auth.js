function sendReq() {
    var emailValue = document.querySelector('input[name="email"]').value;
    var passwordValue = document.querySelector('input[name="password"]').value;

    if (!emailValue || !passwordValue) {
        showAlert("Пожалуйста, заполните все поля.", "alert-danger");
        return; // Прерываем выполнение функции, если поля пустые
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var deviceInfo = {
        "device": navigator.userAgent,
        "language": navigator.language,
        "cookiesEnabled": navigator.cookieEnabled,
        "platform": navigator.platform,
        "userAgent": navigator.userAgent,
        "screenWidth": window.screen.width,
        "screenHeight": window.screen.height,
        "timezoneOffset": new Date().getTimezoneOffset(),
        "doNotTrack": navigator.doNotTrack || "не определен",
        "connectionType": navigator.connection?.effectiveType || "не определен",
        "onlineStatus": navigator.onLine,
        "hardwareConcurrency": navigator.hardwareConcurrency || "не определен",
        "batteryLevel": navigator.getBattery ? navigator.getBattery().then(battery => battery.level) : "не определен",
        "referrer": document.referrer || "не определен",
        "touchPoints": navigator.maxTouchPoints || "не определен"
        // Можно добавить другие доступные данные об устройстве, если необходимо
    };

    var raw = JSON.stringify({
        "email": emailValue,
        "password": passwordValue,
        "deviceInfo": deviceInfo
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(window.location.origin + "/auth/login", requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status === "Ok") {
                var authAElement = document.getElementById("authA");
                authAElement.classList.add("d-none");
                authAElement.classList.remove("d-flex");

                var authFElement = document.getElementById("authF");
                authFElement.classList.remove("d-none");
                authFElement.classList.add("d-flex");
                localStorage.setItem('accessToken', result.token);
                localStorage.setItem('refreshToken', result.refreshToken);
                showAlert("Успешный вход!", "alert-success");
                setTimeout(function () {
                    window.location.href = window.location.origin;
                }, 3000);
            } else {
                showAlert("Ошибка: " + result.message, "alert-danger");
            }
        })
        .catch(error => console.error('Ошибка:', error));
}

function showAlert(message, alertType) {
    var alertDiv = document.createElement('div');
    alertDiv.classList.add('alert', alertType);
    alertDiv.textContent = message;

    var formElement = document.querySelector('.card-body');
    formElement.insertBefore(alertDiv, formElement.firstChild);

    setTimeout(function() {
        alertDiv.remove();
    }, 5000);
}
