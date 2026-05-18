// Селектори елементів
const dateSelect = document.getElementById('dateSelect');
const programDaySelect = document.getElementById('programDaySelect');
const waterCountEl = document.getElementById('waterCount');
const waterProgressBar = document.getElementById('waterProgress');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');

// Чекбокси добавок
const vitD3 = document.getElementById('vitD3');
const omega3 = document.getElementById('omega3');
const magnesium = document.getElementById('magnesium');
const ashwa = document.getElementById('ashwa');
const lcarnitine = document.getElementById('lcarnitine');
const vitB = document.getElementById('vitB');

const weightInput = document.getElementById('weightInput');
const weightLeft = document.getElementById('weightLeft');
const dayNotes = document.getElementById('dayNotes');
const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');
const historyLog = document.getElementById('historyLog');
const themeToggle = document.getElementById('themeToggle');
const motivationCard = document.getElementById('motivationCard');
const quoteText = document.getElementById('quoteText');

// Робочі змінні
let currentWater = 0;
const WATER_TARGET = 12;

// Масив спортивних мотиваційних картинок та цитат
const motivationData = [
    {
        quote: 'Тіло досягає того, у що вірить розум.',
        bg: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop',
    },
    {
        quote: 'Дисципліна — це міст між твоїми цілями та їх досягненням.',
        bg: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1000&auto=format&fit=crop',
    },
    {
        quote: 'Сьогоднішній біль — це твоя завтрашня сила.',
        bg: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1000&auto=format&fit=crop',
    },
    {
        quote: 'Не зупиняйся, коли втомився. Зупиняйся, коли закінчив.',
        bg: 'https://images.unsplash.com/photo-1571731956622-f1c840b71b1e?q=80&w=1000&auto=format&fit=crop',
    },
    {
        quote: "Кожне тяжке тренування — це крок до залізного здоров'я.",
        bg: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=1000&auto=format&fit=crop',
    },
];

// 1. Встановлення випадкової мотивації при старті сторінки
function setRandomMotivation() {
    const randomIndex = Math.floor(Math.random() * motivationData.length);
    const selected = motivationData[randomIndex];
    quoteText.textContent = `"${selected.quote}"`;
    motivationCard.style.backgroundImage = `url('${selected.bg}')`;
}

// 2. Налаштування поточної дати (сьогодні)
const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;

// 3. Логіка Темної Теми
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

// 4. Робота з базою даних localStorage
function getMasterData() {
    return JSON.parse(localStorage.getItem('fit_master_history')) || {};
}

function saveMasterData(data) {
    localStorage.setItem('fit_master_history', JSON.stringify(data));
}

// 5. Оновлення візуального прогресу води
function updateWaterUI() {
    waterCountEl.textContent = currentWater;
    const percentage = Math.min((currentWater / WATER_TARGET) * 100, 100);
    waterProgressBar.style.width = `${percentage}%`;
}

// 6. Розрахунок ваги до цілі (85 кг)
function updateWeightTargetUI() {
    const currentWeight = parseFloat(weightInput.value);
    if (currentWeight && currentWeight > 85) {
        const left = (currentWeight - 85).toFixed(1);
        weightLeft.textContent = `🎯 Залишилося скинути: ${left} кг`;
    } else if (currentWeight && currentWeight <= 85) {
        weightLeft.textContent = `🎉 Ціль досягнута! Ти в ідеальній формі!`;
    } else {
        weightLeft.textContent = '';
    }
}
weightInput.addEventListener('input', updateWeightTargetUI);

// 7. Завантаження даних для обраної дати
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

        // Нові добавки (з безпечною перевіркою)
        lcarnitine.checked = dayData.lcarnitine || false;
        vitB.checked = dayData.vitB || false;

        weightInput.value = dayData.weight || '';
        dayNotes.value = dayData.notes || '';
    } else {
        // Якщо день новий — обнуляємо все, окрім останньої ваги
        programDaySelect.value = 'Відпочинок';
        currentWater = 0;
        vitD3.checked = false;
        omega3.checked = false;
        magnesium.checked = false;
        ashwa.checked = false;
        lcarnitine.checked = false;
        vitB.checked = false;
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
    setRandomMotivation(); // Оновлюємо цитату при зміні дати
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

// 8. Збереження поточної дати
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
        lcarnitine: lcarnitine.checked,
        vitB: vitB.checked,
        weight: weightInput.value,
        notes: dayNotes.value,
    };

    saveMasterData(masterData);
    loadDayData();

    statusMsg.classList.remove('hidden');
    setTimeout(() => statusMsg.classList.add('hidden'), 2000);
});

// 9. Кнопка очищення дня
resetBtn.addEventListener('click', () => {
    if (confirm('Очистити всі записи за цей день?')) {
        const selectedDate = dateSelect.value;
        const masterData = getMasterData();
        delete masterData[selectedDate];
        saveMasterData(masterData);
        loadDayData();
    }
});

// 10. Генерація списку історії на екрані
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

        // Формуємо список добавок
        let supplements = [];
        if (day.vitD3) supplements.push('D3');
        if (day.omega3) supplements.push('Омега-3');
        if (day.magnesium) supplements.push('Магній');
        if (day.ashwa) supplements.push('Ашваганда');
        if (day.lcarnitine) supplements.push('L-карнітин');
        if (day.vitB) supplements.push('Вітамін B');
        let suppsText =
            supplements.length > 0 ? supplements.join(', ') : 'не відмічено';

        item.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div><strong>Заняття:</strong> ${day.programDay || 'Відпочинок'} | <strong>Вага:</strong> ${day.weight ? day.weight + ' кг' : 'не вказано'}</div>
            <div>💧 Вода: ${day.water || 0} скл. | 💊 Добавки: ${suppsText}</div>
            ${day.notes ? `<div style="margin-top: 5px;">📝 <em>${day.notes}</em></div>` : ''}
        `;
        historyLog.appendChild(item);
    });
}

// Старт додатку
loadDayData();
