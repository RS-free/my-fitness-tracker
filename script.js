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

// Селектори нової таблиці
const weeklyWeightInput = document.getElementById('weeklyWeightInput');
const addWeeklyWeightBtn = document.getElementById('addWeeklyWeightBtn');
const weeklyWeightTableBody = document.querySelector(
    '#weeklyWeightTable tbody',
);

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

function setRandomMotivation() {
    const randomIndex = Math.floor(Math.random() * motivationData.length);
    const selected = motivationData[randomIndex];
    quoteText.textContent = `"${selected.quote}"`;
    motivationCard.style.backgroundImage = `url('${selected.bg}')`;
}

const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;

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

function getMasterData() {
    return JSON.parse(localStorage.getItem('fit_master_history')) || {};
}

function saveMasterData(data) {
    localStorage.setItem('fit_master_history', JSON.stringify(data));
}

function updateWaterUI() {
    waterCountEl.textContent = currentWater;
    const percentage = Math.min((currentWater / WATER_TARGET) * 100, 100);
    waterProgressBar.style.width = `${percentage}%`;
}

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

// ЛОГІКА ЩОТИЖНЕВИХ ЗВАЖУВАНЬ (ТАБЛИЦЯ)
function getWeeklyWeights() {
    return JSON.parse(localStorage.getItem('fit_weekly_weights')) || [];
}

function saveWeeklyWeights(data) {
    localStorage.setItem('fit_weekly_weights', JSON.stringify(data));
}

function renderWeeklyWeights() {
    const weights = getWeeklyWeights();
    weeklyWeightTableBody.innerHTML = '';

    // Сортуємо: свіжі зважування зверху
    weights.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (weights.length === 0) {
        weeklyWeightTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); font-style:italic; padding:1.5rem 0;">Немає записів</td></tr>`;
        return;
    }

    weights.forEach((item, index) => {
        const formattedDate = new Date(item.date).toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'numeric',
        });
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>${item.weight} кг</td>
            <td><button class="delete-w-btn" data-index="${index}">❌</button></td>
        `;
        weeklyWeightTableBody.appendChild(tr);
    });

    // Навішуємо видалення на хрестики
    document.querySelectorAll('.delete-w-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            const currentWeights = getWeeklyWeights();
            currentWeights.sort((a, b) => new Date(b.date) - new Date(a.date));
            currentWeights.splice(idx, 1);
            saveWeeklyWeights(currentWeights);
            renderWeeklyWeights();
        });
    });
}

addWeeklyWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(weeklyWeightInput.value);
    if (!weight || weight <= 0) {
        alert('Будь ласка, введіть коректну вагу');
        return;
    }

    const currentWeights = getWeeklyWeights();
    currentWeights.push({
        date: new Date().toISOString().split('T')[0], // Зберігаємо поточну дату
        weight: weight,
    });

    saveWeeklyWeights(currentWeights);
    weeklyWeightInput.value = '';
    renderWeeklyWeights();
});

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
        lcarnitine.checked = dayData.lcarnitine || false;
        vitB.checked = dayData.vitB || false;
        weightInput.value = dayData.weight || '';
        dayNotes.value = dayData.notes || '';
    } else {
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
    setRandomMotivation();
}

dateSelect.value = today;
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

resetBtn.addEventListener('click', () => {
    if (confirm('Очистити всі записи за цей день?')) {
        const selectedDate = dateSelect.value;
        const masterData = getMasterData();
        delete masterData[selectedDate];
        saveMasterData(masterData);
        loadDayData();
    }
});

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

// Запуск при першому старті сторінки
loadDayData();
renderWeeklyWeights();
