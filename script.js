// Селектори елементів
const dateSelect = document.getElementById('dateSelect');
const programDaySelect = document.getElementById('programDaySelect');
const waterCountEl = document.getElementById('waterCount');
const waterProgressBar = document.getElementById('waterProgress');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const vitD3 = document.getElementById('vitD3');
const omega3 = document.getElementById('omega3');
const magnesium = document.getElementById('magnesium');
const ashwa = document.getElementById('ashwa');
const weightInput = document.getElementById('weightInput');
const weightLeft = document.getElementById('weightLeft');
const dayNotes = document.getElementById('dayNotes');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');
const historyLog = document.getElementById('historyLog');
const themeToggle = document.getElementById('themeToggle');

// Поточна робоча змінна для води на обраний день
let currentWater = 0;
const WATER_TARGET = 12;

// 1. Налаштування поточної дати (сьогодні) за замовчуванням
const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;

// 2. Логіка Темної Теми
if (localStorage.getItem('fit_theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.textContent = '☀️ Світла тема';
}

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('fit_theme', 'dark');
        themeToggle.textContent = '☀️ Світла тема';
    } else {
        localStorage.setItem('fit_theme', 'light');
        themeToggle.textContent = '🌙 Темна тема';
    }
});

// 3. Робота з базою даних
function getMasterData() {
    return JSON.parse(localStorage.getItem('fit_master_history')) || {};
}

function saveMasterData(data) {
    localStorage.setItem('fit_master_history', JSON.stringify(data));
}

// 4. Оновлення візуального прогресу води
function updateWaterUI() {
    waterCountEl.textContent = currentWater;
    const percentage = Math.min((currentWater / WATER_TARGET) * 100, 100);
    waterProgressBar.style.width = `${percentage}%`;
}

// 5. Розрахунок ваги до цілі (85 кг)
function updateWeightTargetUI() {
    const currentWeight = parseFloat(weightInput.value);
    if (currentWeight && currentWeight > 85) {
        const left = (currentWeight - 85).toFixed(1);
        weightLeft.textContent = `🎯 Залишилося скинути: ${left} кг`;
    } else if (currentWeight && currentWeight <= 85) {
        weightLeft.textContent = `🎉 Ціль досягнута!`;
    } else {
        weightLeft.textContent = '';
    }
}
weightInput.addEventListener('input', updateWeightTargetUI);

// 6. Завантаження даних для обраної дати
function loadDayData() {
    const selectedDate = dateSelect.value;
    const masterData = getMasterData();
    const dayData = masterData[selectedDate] || null;

    if (dayData) {
        programDaySelect.value = dayData.programDay || 'Відпочинок';
        currentWater = dayData.water || 0;
        vitD3.checked = dayData.vitD3 || false;
        omega3.checked = dayData.omega3 || false;
        magnesium.checked = dayData.magnesium || false;
        ashwa.checked = dayData.ashwa || false;
        weightInput.value = dayData.weight || '';
        dayNotes.value = dayData.notes || '';
    } else {
        programDaySelect.value = 'Відпочинок';
        currentWater = 0;
        vitD3.checked = false;
        omega3.checked = false;
        magnesium.checked = false;
        ashwa.checked = false;
        dayNotes.value = '';

        const dates = Object.keys(masterData).sort();
        if (dates.length > 0) {
            weightInput.value =
                masterData[dates[dates.length - 1]].weight || '';
        } else {
            weightInput.value = '';
        }
    }
    updateWaterUI();
    updateWeightTargetUI();
    renderHistoryList();
}

dateSelect.addEventListener('change', loadDayData);

btnPlus.addEventListener('click', () => {
    currentWater++;
    updateWaterUI();
});
btnMinus.addEventListener('click', () => {
    if (currentWater > 0) {
        currentWater--;
        updateWaterUI();
    }
});

// 7. Збереження поточної дати
saveBtn.addEventListener('click', () => {
    const selectedDate = dateSelect.value;
    const masterData = getMasterData();

    masterData[selectedDate] = {
        programDay: programDaySelect.value,
        water: currentWater,
        vitD3: vitD3.checked,
        omega3: omega3.checked,
        magnesium: magnesium.checked,
        ashwa: ashwa.checked,
        weight: weightInput.value,
        notes: dayNotes.value,
    };

    saveMasterData(masterData);
    loadDayData();

    statusMsg.classList.remove('hidden');
    setTimeout(() => statusMsg.classList.add('hidden'), 2000);
});

// 8. Кнопка очищення
resetBtn.addEventListener('click', () => {
    if (confirm('Очистити всі записи за цей день?')) {
        const selectedDate = dateSelect.value;
        const masterData = getMasterData();
        delete masterData[selectedDate];
        saveMasterData(masterData);
        loadDayData();
    }
});

// 9. Генерація списку історії
function renderHistoryList() {
    const masterData = getMasterData();
    const sortedDates = Object.keys(masterData).sort().reverse();

    if (sortedDates.length === 0) {
        historyLog.innerHTML =
            '<p class="empty-history">Тут будуть твої збережені дні...</p>';
        return;
    }

    historyLog.innerHTML = '';
    sortedDates.forEach((date) => {
        const day = masterData[date];
        const formattedDate = new Date(date).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'long',
        });

        const item = document.createElement('div');
        item.className = 'history-item';

        // Формуємо список добавок безпечно
        let supplements = [];
        if (day.vitD3) supplements.push('D3');
        if (day.omega3) supplements.push('Омега-3');
        if (day.magnesium) supplements.push('Магній');
        if (day.ashwa) supplements.push('Ашваганда');
        let suppsText =
            supplements.length > 0 ? supplements.join(', ') : 'не відмічено';

        item.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div><strong>Заняття:</strong> ${day.programDay || 'Відпочинок'} | <strong>Вага:</strong> ${day.weight ? day.weight + ' кг' : 'не вказано'}</div>
            <div>💧 Вода: ${day.water || 0} скл. | 💊 Добавки: ${suppsText}</div>
            ${day.notes ? `<div>📝 <em>${day.notes}</em></div>` : ''}
        `;
        historyLog.appendChild(item);
    });
}

// Запуск
loadDayData();
