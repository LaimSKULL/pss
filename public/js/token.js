// Функция для обновления уведомлений и применения анимации только при изменении значения
async function updateNotifications() {
    try {
        const response = await fetch('/auth/getMe', {
            method: 'GET',
        });

        if (response.status === 403) {
            window.location.href = '/auth/logOut';
        } else if (response.ok) {
            const data = await response.json();
            const notifyBadge = document.getElementById('notify-badge');

            const oldNotifyCount = parseInt(notifyBadge.textContent || '0', 10); // Получаем текущее значение уведомлений

            if (data.notifyCount !== oldNotifyCount) { // Проверяем, изменилось ли значение уведомлений
                if (data.notifyCount === 0) {
                    notifyBadge.textContent = data.notifyCount;
                    notifyBadge.classList.add('badge-success');
                    notifyBadge.classList.remove('badge-danger');
                    notifyBadge.classList.add('animate-slide-up');
                } else {
                    notifyBadge.textContent = data.notifyCount;
                    notifyBadge.classList.add('badge-danger');
                    notifyBadge.classList.remove('badge-success');
                    notifyBadge.classList.add('animate-slide-up');
                }

                // Удаляем класс анимации после определенного времени для повторного запуска анимации
                setTimeout(() => {
                    notifyBadge.classList.remove('animate-slide-up');
                }, 500); // Время анимации в миллисекундах
            }
        }
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
    }
}

updateNotifications(); // Вызываем функцию обновления уведомлений

setInterval(() => {
    updateNotifications(); // Обновляем уведомления каждые 10 секунд
}, 10000);
