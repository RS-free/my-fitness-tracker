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
const lcarnitine = document.getElementById('lcarnitine');
const vitB = document.getElementById('vitB');
const dayNotes = document.getElementById('dayNotes');

const saveBtn = document.getElementById('saveBtn');
const resetBtn = document.getElementById('resetBtn');
const statusMsg = document.getElementById('statusMsg');
const historyLog = document.getElementById('historyLog');
const motivationCard = document.getElementById('motivationCard');
const quoteText = document.getElementById('quoteText');

// Селектори таблиці зважувань
const weightGoalInput = document.getElementById('weightGoalInput');
const weeklyDateInput = document.getElementById('weeklyDateInput');
const weeklyWeightInput = document.getElementById('weeklyWeightInput');
const addWeeklyWeightBtn = document.getElementById('addWeeklyWeightBtn');
const weeklyWeightTableBody = document.querySelector(
    '#weeklyWeightTable tbody',
);

let currentWater = 0;
const WATER_TARGET = 12;
let statusTimeout; // Змінна для фіксу багу таймера збереження

// Селектори нової статистики на банері
const bannerWeight = document.getElementById('bannerWeight');
const bannerGoal = document.getElementById('bannerGoal');

// ==========================================
// ВЕЛИЧЕЗНА БАЗА МОТИВАЦІЇ ТА ФОТО (РОЗДІЛЬНО)
// ==========================================
const quotes = [
    'Тіло досягає того, у що вірить розум.',
    'Дисципліна — це міст між твоїми цілями та їх досягненням.',
    'Сьогоднішній біль — це твоя завтрашня сила.',
    'Не зупиняйся, коли втомився. Зупиняйся, коли закінчив.',
    "Кожне тяжке тренування — це крок до залізного здоров'я.",
    'Результат не прийде сам, за ним треба йти.',
    'Піт — це сльози твого жиру.',
    'Твоє тіло може все. Головне — переконати свій розум.',
    "Тижня має 7 днів. І 'Колись' — не один із них.",
    'Жоден чемпіон не став таким без поту і болю.',
    "Зроби сьогодні те, за що завтра скажеш собі 'дякую'.",
    'Успіх — це сума маленьких зусиль, що повторюються день у день.',
    'Біль тимчасовий, тріумф — вічний.',
    'Твоя головна конкуренція — це ти вчорашній.',
    'Слабкість — це вибір. Сила — це рішення.',
    'Чим важчий бій, тим солодша перемога.',
    'Неважливо, наскільки повільно ти прогресуєш, ти все одно обганяєш тих, хто лежить на дивані.',
    'Твій єдиний ліміт — це ти сам.',
    'Мотивація змушує почати. Дисципліна змушує продовжувати.',
    'Тренажерний зал — це місце, де слабкість перетворюється на силу.',
    'Роби те, що повинен, поки не зможеш робити те, що хочеш.',
    'Не жалій себе. Жалій тих, хто навіть не спробував.',
    'Щодня ставай на 1% кращим.',
    'Краще втомитися від тренування, ніж від слабкості.',
    'Твоє тіло — це відображення твого способу життя.',
    'Переможці фокусуються на перемозі, невдахи фокусуються на переможцях.',
    'Зміни починаються в кінці твоєї зони комфорту.',
    'Характер кується там, де закінчуються сили.',
    'Якщо хочеш мати те, чого ніколи не мав, доведеться робити те, чого ніколи не робив.',
    'Залізо ніколи не бреше. Воно завжди дає рівно те, що ти в нього вклав.',
];

const backgroundImages = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571731956622-f1c840b71b1e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1605296867304-46d5465a13f4?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1526506159807-1c6e091a8ffc?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534258936925-c58bed479fcb?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1584466977710-1ce99e5fa14a?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1200&auto=format&fit=crop',
];

function setRandomMotivation() {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const randomImg =
        backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
    quoteText.textContent = `"${randomQuote}"`;
    motivationCard.style.backgroundImage = `url('${randomImg}')`;
}

// Функція оновлення статистики на банері
function updateBannerStats() {
    const weights = getWeeklyWeights();
    const goal = parseFloat(weightGoalInput.value);

    if (weights.length > 0) {
        // Сортуємо так, щоб зверху була остання (найнововіша) дата
        weights.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestWeight = weights[0].weight;

        bannerWeight.textContent = latestWeight;

        if (!isNaN(goal) && goal > 0) {
            const diff = Math.abs(latestWeight - goal).toFixed(1);
            bannerGoal.textContent = diff;
        } else {
            bannerGoal.textContent = '--';
        }
    } else {
        bannerWeight.textContent = '--';
        bannerGoal.textContent = '--';
    }
}

const today = new Date().toISOString().split('T')[0];
dateSelect.value = today;
weeklyDateInput.value = today;

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

// ==========================================
// ЛОГІКА КОНТРОЛЬНИХ ЗВАЖУВАНЬ ТА ЦІЛІ
// ==========================================
weightGoalInput.value = localStorage.getItem('fit_weight_goal') || '';
weightGoalInput.addEventListener('input', (e) => {
    localStorage.setItem('fit_weight_goal', e.target.value);
    renderWeeklyWeights();
});

function getWeeklyWeights() {
    return JSON.parse(localStorage.getItem('fit_weekly_weights')) || [];
}
function saveWeeklyWeights(data) {
    localStorage.setItem('fit_weekly_weights', JSON.stringify(data));
}

function renderWeeklyWeights() {
    const weights = getWeeklyWeights();
    weeklyWeightTableBody.innerHTML = '';
    const goal = parseFloat(weightGoalInput.value);

    if (weights.length === 0) {
        weeklyWeightTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); font-style:italic; padding:1.5rem 0;">Записів ще немає</td></tr>`;
        return;
    }

    // Сортуємо для розрахунку різниці (старі -> нові)
    weights.sort((a, b) => new Date(a.date) - new Date(b.date));

    // Прораховуємо дані
    const renderData = weights.map((item, index) => {
        let diffPrev = null;
        if (index > 0) {
            diffPrev = (item.weight - weights[index - 1].weight).toFixed(1);
        }
        let diffGoal = null;
        if (!isNaN(goal) && goal > 0) {
            diffGoal = Math.abs(item.weight - goal).toFixed(1);
        }
        return { ...item, diffPrev, diffGoal };
    });

    // Сортуємо для відображення (нові -> старі)
    renderData.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderData.forEach((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' });
        const tr = document.createElement('tr');
        
        let diffHtml = '';
        if (item.diffPrev !== null) {
            const diffNum = parseFloat(item.diffPrev);
            if (diffNum > 0) {
                // Стрілка вгору (приріст)
                diffHtml = `<span class="diff-up"> (+${item.diffPrev} ⭡)</span>`;
            } else if (diffNum < 0) {
                // Стрілка вниз (спад)
                diffHtml = `<span class="diff-down"> (${item.diffPrev} ⭣)</span>`;
            } else {
                diffHtml = `<span class="diff-goal"> (без змін)</span>`;
            }
        }

        tr.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>
                <span class="weight-record">${item.weight} кг</span> ${diffHtml}
                ${item.diffGoal ? `<br><span class="diff-goal">(до цілі: ${item.diffGoal} кг)</span>` : ''}
            </td>
            <td><button class="delete-w-btn" data-id="${item.id}">❌</button></td>
        `;
        weeklyWeightTableBody.appendChild(tr);
    });

    // Фінальне видалення через ID
    document.querySelectorAll('.delete-w-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idToDelete = parseInt(e.currentTarget.getAttribute('data-id'));
            let currentWeights = getWeeklyWeights();
            currentWeights = currentWeights.filter(w => w.id !== idToDelete); // Фільтруємо за ID
            saveWeeklyWeights(currentWeights);
            renderWeeklyWeights();
            updateBannerStats(); // Оновлюємо банер після видалення
        });
    });
}

    renderData.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderData.forEach((item) => {
        const formattedDate = new Date(item.date).toLocaleDateString('uk-UA', {
            day: '2-digit',
            month: '2-digit',
        });
        const tr = document.createElement('tr');

        let diffHtml = '';
        if (item.diffPrev !== null) {
            const diffNum = parseFloat(item.diffPrev); // Конвертуємо в число для точного порівняння
            if (diffNum > 0) {
                diffHtml = `<span class="diff-up"> (+${item.diffPrev})</span>`;
            } else if (diffNum < 0) {
                diffHtml = `<span class="diff-down"> (${item.diffPrev})</span>`;
            } else {
                diffHtml = `<span class="diff-goal"> (без змін)</span>`;
            }
        }

        let goalHtml =
            item.diffGoal !== null
                ? `<br><span class="diff-goal">(до цілі: ${item.diffGoal} кг)</span>`
                : '';

        tr.innerHTML = `
            <td><strong>${formattedDate}</strong></td>
            <td>
                <span class="weight-record">${item.weight} кг</span> ${diffHtml} ${goalHtml}
            </td>
            <td><button class="delete-w-btn" data-index="${item.originalIndex}">❌</button></td>
        `;
        weeklyWeightTableBody.appendChild(tr);
    });

    // Фікс багу видалення (використовуємо currentTarget)
    document.querySelectorAll('.delete-w-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            const currentWeights = getWeeklyWeights();
            currentWeights.sort((a, b) => new Date(a.date) - new Date(b.date));
            currentWeights.splice(idx, 1);
            saveWeeklyWeights(currentWeights);
            renderWeeklyWeights();
        });
    });
}

addWeeklyWeightBtn.addEventListener('click', () => {
    const weight = parseFloat(weeklyWeightInput.value);
    const selectedDate = weeklyDateInput.value;
    if (!weight || weight <= 0 || !selectedDate) {
        alert('Будь ласка, оберіть дату та введіть коректну вагу');
        return;
    }

    const currentWeights = getWeeklyWeights();

    // Фікс багу дублювання дат: якщо дата вже є, ми оновлюємо вагу, а не створюємо дублікат
    const existingIndex = currentWeights.findIndex(
        (item) => item.date === selectedDate,
    );
    if (existingIndex !== -1) {
        currentWeights[existingIndex].weight = weight;
    } else {
        currentWeights.push({ date: selectedDate, weight: weight });
    }

    saveWeeklyWeights(currentWeights);
    weeklyWeightInput.value = '';
    renderWeeklyWeights();
});

// ==========================================
// ЛОГІКА ДЕННИХ ЗАПИСІВ
// ==========================================
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
    }
    updateWaterUI();
    renderHistoryList();
    setRandomMotivation();
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
        notes: dayNotes.value,
    };

    saveMasterData(masterData);
    loadDayData();

    // Фікс багу повідомлення при швидкому подвійному кліку
    clearTimeout(statusTimeout);
    statusMsg.classList.remove('hidden');
    statusTimeout = setTimeout(() => statusMsg.classList.add('hidden'), 2500);
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

        // Фікс багу злиття тексту: зберігаємо абзаци в нотатках
        const formattedNotes = day.notes
            ? day.notes.replace(/\n/g, '<br>')
            : '';

        item.innerHTML = `
            <div class="history-date">${formattedDate}</div>
            <div><strong>Заняття:</strong> ${day.programDay || 'Відпочинок'}</div>
            <div>💧 Вода: ${day.water || 0} скл. | 💊 Добавки: ${suppsText}</div>
            ${formattedNotes ? `<div style="margin-top: 8px;">📝 <em>${formattedNotes}</em></div>` : ''}
        `;
        historyLog.appendChild(item);
    });
}

loadDayData();
renderWeeklyWeights();
