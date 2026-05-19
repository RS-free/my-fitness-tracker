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
    'Не зупиняйся, коли втомився.',
    'Кожне тяжке тренування — крок до здоров’я.',
    'Результат не прийде сам.',
    'Піт — це сльози твого жиру.',
];
const backgroundImages = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
];

function setRandomMotivation() {
    quoteText.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
    motivationCard.style.backgroundImage = `url('${backgroundImages[Math.floor(Math.random() * backgroundImages.length)]}')`;
}

// ЛОГІКА ЗВАЖУВАННЯ
function getWeeklyWeights() {
    return JSON.parse(localStorage.getItem('fit_weekly_weights')) || [];
}
function saveWeeklyWeights(data) {
    localStorage.setItem('fit_weekly_weights', JSON.stringify(data));
}

function updateBannerStats() {
    const weights = getWeeklyWeights();
    const goal = parseFloat(weightGoalInput.value);
    if (weights.length > 0) {
        weights.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latest = weights[0].weight;
        bannerWeight.textContent = latest;
        bannerGoal.textContent =
            !isNaN(goal) && goal > 0
                ? Math.abs(latest - goal).toFixed(1)
                : '--';
    }
}

function renderWeeklyWeights() {
    const weights = getWeeklyWeights();
    weeklyWeightTableBody.innerHTML = '';
    const goal = parseFloat(weightGoalInput.value);

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
            updateBannerStats();
        });
    });
    updateBannerStats();
}

addWeeklyWeightBtn.addEventListener('click', () => {
    const weights = getWeeklyWeights();
    const existing = weights.findIndex((w) => w.date === weeklyDateInput.value);
    if (existing !== -1)
        weights[existing].weight = parseFloat(weeklyWeightInput.value);
    else
        weights.push({
            date: weeklyDateInput.value,
            weight: parseFloat(weeklyWeightInput.value),
        });
    saveWeeklyWeights(weights);
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
    setRandomMotivation();
}

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
    clearTimeout(statusTimeout);
    statusMsg.classList.remove('hidden');
    statusTimeout = setTimeout(() => statusMsg.classList.add('hidden'), 2500);
});

// Ініціалізація
dateSelect.value = new Date().toISOString().split('T')[0];
weeklyDateInput.value = dateSelect.value;
loadDayData();
renderWeeklyWeights();
