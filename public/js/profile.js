document.addEventListener('DOMContentLoaded', function () {
    let currentlyEditing = null;
    let originalValues = {};

    function addEditFunctionality(fieldId, editButtonId, saveButtonId, pattern, title, fieldType) {
        document.querySelector(editButtonId).addEventListener('click', function () {
            if (currentlyEditing && currentlyEditing !== fieldId) {
                cancelEdit(currentlyEditing[0], currentlyEditing[1], currentlyEditing[2]);
            }

            currentlyEditing = [fieldId, editButtonId, saveButtonId];

            let fieldValue = document.querySelector(fieldId).textContent;
            originalValues[fieldId] = fieldValue;

            let inputField;
            if (fieldType === 'date' || fieldType === 'password') {
                inputField = document.createElement('input');
                inputField.setAttribute('type', fieldType);
            } else {
                inputField = document.createElement('input');
                inputField.setAttribute('type', 'text');
            }
            inputField.setAttribute('class', 'form-control');
            inputField.setAttribute('id', fieldId.substring(1));
            inputField.setAttribute('value', fieldValue);

            document.querySelector(fieldId).replaceWith(inputField);
            document.querySelector(saveButtonId).classList.remove('d-none');
            this.classList.add('d-none');

            let errorId = fieldId.substring(1) + "-error";
            let errorDiv = document.createElement('div');
            errorDiv.setAttribute('id', errorId);
            errorDiv.setAttribute('class', 'error-message');
            this.parentElement.appendChild(errorDiv);

            document.querySelector('#' + fieldId.substring(1)).addEventListener('input', function () {
                let value = this.value;
                let regex = new RegExp(pattern);

                if (!regex.test(value)) {
                    document.querySelector('#' + errorId).textContent = title;
                    document.querySelector(saveButtonId).disabled = true;
                } else {
                    document.querySelector('#' + errorId).textContent = '';
                    document.querySelector(saveButtonId).disabled = false;
                }
            });
        });

        document.querySelector(saveButtonId).addEventListener('click', function () {
            let editedValue = document.querySelector('#' + fieldId.substring(1)).value;
            let regex = new RegExp(pattern);

            if (regex.test(editedValue)) {
                // Отправка данных на сервер
                sendData(fieldId.substring(1), editedValue); // Вызов функции отправки данных
                if (fieldType === 'password') {
                    editedValue = '*'.repeat(editedValue.length); // Заменяем все символы на звездочки
                }

                let spanElement = document.createElement('span');
                if (fieldId.includes('social')){
                    spanElement.setAttribute('class', 'text-secondary ml-2');
                }
                else {
                    spanElement.setAttribute('class', 'text-secondary');
                }
                spanElement.setAttribute('id', fieldId.substring(1));
                spanElement.textContent = editedValue;

                document.querySelector('#' + fieldId.substring(1)).replaceWith(spanElement);
                document.querySelector(editButtonId).classList.remove('d-none');
                this.classList.add('d-none');
                currentlyEditing = null;
                delete originalValues[fieldId];


            } else {
                alert('Пожалуйста, введите корректные данные.');
            }
        });
    }

    function cancelEdit(fieldId, editButtonId, saveButtonId) {
        let currentValue = originalValues[fieldId] || '';
        let spanElement = document.createElement('span');
        spanElement.setAttribute('class', 'text-secondary');
        spanElement.setAttribute('id', fieldId.substring(1));
        spanElement.textContent = currentValue;

        document.querySelector('#' + fieldId.substring(1)).replaceWith(spanElement);
        document.querySelector(saveButtonId).classList.add('d-none');
        document.querySelector(editButtonId).classList.remove('d-none');
        document.querySelector('#' + fieldId.substring(1) + "-error").classList.add('d-none');
        delete originalValues[fieldId];
    }

    function sendData(fieldId, value) {
        id = location.pathname.split('/')[2];
        let dataToSend = {};

        if (fieldId === 'password') {
            dataToSend = {
                fieldId: fieldId,
                value: value // Отправляем фактический пароль на сервер
            };
        } else {
            dataToSend = {
                fieldId: fieldId,
                value: value
            };
        }

        fetch('/profile/' + id + '/saveData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataToSend)
        })
            .then(response => {
                if (response.ok) {
                    // Данные успешно отправлены
                    console.log('Данные успешно отправлены на сервер');
                } else {
                    // Обработка ошибки отправки данных
                    console.error('Ошибка при отправке данных на сервер');
                }
            })
            .catch(error => {
                // Обработка ошибок сети или других ошибок
                console.error('Произошла ошибка:', error);
            });
    }



    addEditFunctionality('#lastName', '#editLastName', '#saveLastName', '^[A-Za-zА-Яа-яЁё]+(?: [A-Za-zА-Яа-яЁё]+)?$', 'Только буквы и пробел (если есть)', 'text');
    addEditFunctionality('#firstName', '#editFirstName', '#saveFirstName', '^[A-Za-zА-Яа-яЁё]+$', 'Только буквы', 'text');
    addEditFunctionality('#middleName', '#editMiddleName', '#saveMiddleName', '^[A-Za-zА-Яа-яЁё]+(?: [A-Za-zА-Яа-яЁё]+)?$', 'Только буквы и пробел (если есть)', 'text');
    addEditFunctionality('#email', '#editEmail', '#saveEmail', '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$', 'Валидный email', 'text');
    addEditFunctionality('#dob', '#editDob', '#saveDob', '^\\d{4}-\\d{2}-\\d{2}$', 'Формат: ГГГГ-ММ-ДД', 'date');
    addEditFunctionality('#password', '#editPassword', '#savePassword', '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d\\s]).{8,}$', 'Минимум 8 символов, хотя бы одна большая и маленькая буквы, один спец. символ', 'password');

    // Функции для редактирования социальных сетей без валидации
    addEditFunctionality('#socialWebsite', '#editSocialWebsite', '#saveSocialWebsite', '^(http|https)://[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9-._~:/?#[\\]@!$&\'()*+,;=]*)?$', 'Неверный URL');
    addEditFunctionality('#socialGithub', '#editSocialGithub', '#saveSocialGithub', '^(http|https)://[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9-._~:/?#[\\]@!$&\'()*+,;=]*)?$', 'Неверный URL');
    addEditFunctionality('#socialTelegram', '#editSocialTelegram', '#saveSocialTelegram', '^(http|https)://[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9-._~:/?#[\\]@!$&\'()*+,;=]*)?$', 'Неверный URL');
    addEditFunctionality('#socialVk', '#editSocialVk', '#saveSocialVk', '^(http|https)://[a-zA-Z0-9-.]+\\.[a-zA-Z]{2,}(?:/[a-zA-Z0-9-._~:/?#[\\]@!$&\'()*+,;=]*)?$', 'Неверный URL');
});
