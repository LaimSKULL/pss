function sendRegistrationData() {
    // Получение значений из полей формы
    var firstName = document.querySelector('input[name="firstName"]').value.trim();
    var lastName = document.querySelector('input[name="lastName"]').value.trim();
    var middleName = document.querySelector('input[name="middleName"]').value.trim();
    var email = document.querySelector('input[name="email"]').value.trim();
    var password = document.querySelector('input[name="password"]').value.trim();

    // Проверка заполненности полей firstName, email и password
    if (firstName === '' || email === '' || password === '') {
        showAlert('Пожалуйста, заполните обязательные поля: Имя, Email и Пароль.', 'alert-danger');
        return; // Прекращаем выполнение функции, если поля не заполнены
    }

    // Формирование объекта с данными для отправки на сервер
    var data = {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName,
        email: email,
        password: password
    };

    // Отправка данных на сервер
    fetch(window.location.origin + "/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                // Если регистрация прошла успешно, показать блок с сообщением
                document.getElementById('authA').classList.add('d-none');
                document.getElementById('authF').classList.remove('d-none');
            } else {
                return response.json(); // Обработка JSON-ответа в случае ошибки
            }
        })
        .then(data => {
            if (data && data.status === 'Error' && data.message) {
                showAlert(data.message, 'alert-danger'); // Показать сообщение об ошибке
            } else {
                showAlert('Ошибка при регистрации', 'alert-danger'); // Если данные об ошибке не были получены
            }
        })
        .catch(error => {
            showAlert('Ошибка: ' + error, 'alert-danger'); // Обработка других ошибок
        });
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
