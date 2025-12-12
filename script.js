// script.js - полная версия с отладкой
const SERVER_URL = 'https://483aeb0e-d724-4e9b-ad96-9b813e0002fa-00-fe63autuudl3.pike.replit.dev';

// Тест соединения при загрузке
window.addEventListener('load', async () => {
    try {
        const test = await fetch(SERVER_URL + '/test');
        const data = await test.json();
        console.log('✅ Сервер доступен:', data);
    } catch (error) {
        console.error('❌ Сервер недоступен:', error);
    }
});

// Функция для запроса
async function makeRequest(endpoint, body) {
    console.log(`🔄 Отправка на ${SERVER_URL}${endpoint}:`, body);
    
    try {
        const response = await fetch(SERVER_URL + endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        console.log('📡 Статус:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Ответ:', data);
        return data;
        
    } catch (error) {
        console.error('❌ Ошибка запроса:', error);
        throw error;
    }
}

// Обработчик Send Code
sendBtn.addEventListener('click', async () => {
    const phone = phoneInput.value.trim();
    
    if (!phone.startsWith('+')) {
        showMessage('Введите номер с +', 'error');
        return;
    }
    
    showMessage('📤 Отправка...', 'info');
    sendBtn.disabled = true;
    
    try {
        const data = await makeRequest('/send-code', { phone });
        
        if (data.success) {
            showMessage(`✅ Код: ${data.code}`, 'success');
            codeInput.disabled = false;
            codeInput.focus();
            
            // Сохраняем код для проверки
            window.lastCode = data.code;
            console.log(`💾 Сохранён код: ${data.code}`);
        }
    } catch (error) {
        showMessage('❌ Ошибка отправки', 'error');
        sendBtn.disabled = false;
    }
});
