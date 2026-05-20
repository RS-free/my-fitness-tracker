// Селектори
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
const bannerWeight = document.getElementById('bannerWeight');
const bannerGoal = document.getElementById('bannerGoal');

// Селектори таблиці
const weightGoalInput = document.getElementById('weightGoalInput');
const weeklyDateInput = document.getElementById('weeklyDateInput');
const weeklyWeightInput = document.getElementById('weeklyWeightInput');
const addWeeklyWeightBtn = document.getElementById('addWeeklyWeightBtn');
const weeklyWeightTableBody = document.querySelector(
    '#weeklyWeightTable tbody',
);

let currentWater = 0;
const WATER_TARGET = 12;
let statusTimeout;

// Мотивація
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
    'Успіх — це сума маленьких зусиль.',
    'Біль тимчасовий, тріумф — вічний.',
    'Твоя головна конкуренція — це ти вчорашній.',
    'Слабкість — це вибір. Сила — це рішення.',
    'Чим важчий бій, тим солодша перемога.',
    'Твій єдиний ліміт — це ти сам.',
    'Мотивація змушує почати. Дисципліна змушує продовжувати.',
    'Роби те, що повинен, поки не зможеш робити те, що хочеш.',
    'Не жалій себе. Жалій тих, хто навіть не спробував.',
    'Щодня ставай на 1% кращим.',
    'Краще втомитися від тренування, ніж від слабкості.',
    'Твоє тіло — це відображення твого способу життя.',
    'Переможці фокусуються на перемозі.',
    'Зміни починаються в кінці твоєї зони комфорту.',
    'Характер кується там, де закінчуються сили.',
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
    quoteText.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    motivationCard.style.backgroundImage = `url('${backgroundImages[Math.floor(Math.random() * backgroundImages.length)]}')`;
}

// ЛОГІКА ЗВАЖУВАННЯ
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

function updateBannerStats() {
    const weights = getWeeklyWeights();
    const goalStr = weightGoalInput.value.trim();
    const goal = goalStr !== '' ? parseFloat(goalStr) : NaN;

    if (weights.length > 0) {
        weights.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = weights[0].weight;
        bannerWeight.textContent = latest;
        bannerGoal.textContent =
            !isNaN(goal) && goal > 0
                ? Math.abs(latest - goal).toFixed(1)
                : '--';
    } else {
        bannerWeight.textContent = '--';
        bannerGoal.textContent = '--';
    }
}

function renderWeeklyWeights() {
    const weights = getWeeklyWeights();
    weeklyWeightTableBody.innerHTML = '';
    const goalStr = weightGoalInput.value.trim();
    const goal = goalStr !== '' ? parseFloat(goalStr) : NaN;

    if (weights.length === 0) {
        weeklyWeightTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); font-style:italic; padding:1.5rem 0;">Записів ще немає</td></tr>`;
        updateBannerStats();
        return;
    }

    weights.sort((a, b) => new Date(a.date) - new Date(b.date));

    const renderData = weights.map((item, index) => {
        let diffPrev =
            index > 0
                ? (item.weight - weights[index - 1].weight).toFixed(1)
                : null;
        let diffGoal =
            !isNaN(goal) && goal > 0
                ? Math.abs(item.weight - goal).toFixed(1)
                : null;
        return { ...item, diffPrev, diffGoal };
    });

    renderData.sort((a, b) => new Date(b.date) - new Date(a.date));

    renderData.forEach((item) => {
        const tr = document.createElement('tr');
        let diffHtml = '';
        if (item.diffPrev !== null) {
            const val = parseFloat(item.diffPrev);
            if (val > 0)
                diffHtml = `<span class="diff-up"> (+${item.diffPrev} ▲)</span>`;
            else if (val < 0)
                diffHtml = `<span class="diff-down"> (${item.diffPrev} ▼)</span>`;
            else diffHtml = `<span class="diff-goal"> (без змін)</span>`;
        }

        tr.innerHTML = `
            <td><strong>${new Date(item.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}</strong></td>
            <td><span class="weight-record">${item.weight} кг</span>${diffHtml}${item.diffGoal ? `<br><span class="diff-goal">(до цілі: ${item.diffGoal} кг)</span>` : ''}</td>
            <td><button class="delete-w-btn" data-date="${item.date}">❌</button></td>
        `;
        weeklyWeightTableBody.appendChild(tr);
    });

    document.querySelectorAll('.delete-w-btn').forEach((btn) => {
        btn.addEventListener('click', (e) => {
            const dateToDelete = e.currentTarget.getAttribute('data-date');
            saveWeeklyWeights(
                getWeeklyWeights().filter((w) => w.date !== dateToDelete),
            );
            renderWeeklyWeights();
        });
    });

    updateBannerStats();
}

addWeeklyWeightBtn.addEventListener('click', () => {
    const weights = getWeeklyWeights();
    const inputWeight = parseFloat(weeklyWeightInput.value);
    if (!inputWeight || inputWeight <= 0 || !weeklyDateInput.value) {
        alert('Будь ласка, оберіть дату та введіть коректну вагу');
        return;
    }
    const existing = weights.findIndex((w) => w.date === weeklyDateInput.value);
    if (existing !== -1) weights[existing].weight = inputWeight;
    else weights.push({ date: weeklyDateInput.value, weight: inputWeight });

    saveWeeklyWeights(weights);
    weeklyWeightInput.value = '';
    renderWeeklyWeights();
});

// ДЕННІ ЗАПИСИ
function loadDayData() {
    const data = JSON.parse(localStorage.getItem('fit_master_history')) || {};
    const d = data[dateSelect.value] || {};

    programDaySelect.value = d.programDay || 'Відпочинок';
    currentWater = d.water || 0;
    vitD3.checked = d.vitD3 || false;
    omega3.checked = d.omega3 || false;
    magnesium.checked = d.magnesium || false;
    ashwa.checked = d.ashwa || false;
    lcarnitine.checked = d.lcarnitine || false;
    vitB.checked = d.vitB || false;
    dayNotes.value = d.notes || '';

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
    const data = JSON.parse(localStorage.getItem('fit_master_history')) || {};
    data[dateSelect.value] = {
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
    localStorage.setItem('fit_master_history', JSON.stringify(data));

    loadDayData(); // Оновлює історію

    clearTimeout(statusTimeout);
    statusMsg.classList.remove('hidden');
    statusTimeout = setTimeout(() => statusMsg.classList.add('hidden'), 2500);
});

resetBtn.addEventListener('click', () => {
    if (confirm('Очистити всі записи за цей день?')) {
        const data =
            JSON.parse(localStorage.getItem('fit_master_history')) || {};
        delete data[dateSelect.value];
        localStorage.setItem('fit_master_history', JSON.stringify(data));
        loadDayData(); // Миттєво скидає всі галочки і форму на екрані
    }
});

function renderHistoryList() {
    const masterData =
        JSON.parse(localStorage.getItem('fit_master_history')) || {};
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

// Ініціалізація
dateSelect.value = new Date().toISOString().split('T')[0];
weeklyDateInput.value = dateSelect.value;
loadDayData();
renderWeeklyWeights();
