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

// БАЗА МОТИВАЦІЇ
const quotes = [
    'Тіло досягає того, у що вірить розум.',
    'Дисципліна — це міст між твоїми цілями та їх досягненням.',
    'Сьогоднішній біль — це твоя завтрашня сила.',
    'Не зупиняйся, коли втомився. Зупиняйся, коли закінчив.',
    "Кожне тяжке тренування — це крок до залізного здоров'я.",
    'Результат не прийде сам, за ним треба йти.',
    'Піт — це сльози твого жиру.',
    'Твоє тіло може все. Головне — переконати свій розум.',
    "Тиждень має 7 днів. І 'Колись' — не один із них.",
    'Жоден чемпіон не став таким без поту і болю.',
];

const backgroundImages = [
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571731956622-f1c840b71b1e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=1200&auto=format&fit=crop',
];

function setRandomMotivation() {
    try {
        if (!quoteText || !motivationCard) return;
        quoteText.textContent = `"${quotes[Math.floor(Math.random() * quotes.length)]}"`;
        motivationCard.style.backgroundImage = `url('${backgroundImages[Math.floor(Math.random() * backgroundImages.length)]}')`;
    } catch (e) {
        console.error('Помилка мотивації:', e);
    }
}

// БЕЗПЕЧНІ ФУНКЦІЇ ДЛЯ ПАМ'ЯТІ (Щоб дані точно зберігалися)
function getWeeklyWeights() {
    try {
        return JSON.parse(localStorage.getItem('fit_weekly_weights')) || [];
    } catch (e) {
        return [];
    }
}
function saveWeeklyWeights(data) {
    localStorage.setItem('fit_weekly_weights', JSON.stringify(data));
}

function getMasterData() {
    try {
        return JSON.parse(localStorage.getItem('fit_master_history')) || {};
    } catch (e) {
        return {};
    }
}
function saveMasterData(data) {
    localStorage.setItem('fit_master_history', JSON.stringify(data));
}

// ЛОГІКА ЗВАЖУВАННЯ
if (weightGoalInput) {
    weightGoalInput.value = localStorage.getItem('fit_weight_goal') || '';
    weightGoalInput.addEventListener('input', (e) => {
        localStorage.setItem('fit_weight_goal', e.target.value);
        renderWeeklyWeights();
    });
}

function updateBannerStats() {
    if (!bannerWeight || !bannerGoal) return;
    const weights = getWeeklyWeights();
    const goalStr = weightGoalInput ? weightGoalInput.value.trim() : '';
    const goal = goalStr !== '' ? parseFloat(goalStr) : NaN;

    if (weights.length > 0) {
        // Завжди показуємо найсвіжішу дату на банері
        const sortedForBanner = [...weights].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
        );
        const latest = sortedForBanner[0].weight;

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
    if (!weeklyWeightTableBody) return;
    const weights = getWeeklyWeights();
    weeklyWeightTableBody.innerHTML = '';
    const goalStr = weightGoalInput ? weightGoalInput.value.trim() : '';
    const goal = goalStr !== '' ? parseFloat(goalStr) : NaN;

    if (weights.length === 0) {
        weeklyWeightTableBody.innerHTML = `<tr><td colspan="3" style="text-align:center; color:var(--text-secondary); font-style:italic; padding:1.5rem 0;">Записів ще немає</td></tr>`;
        updateBannerStats();
        return;
    }

    // Хронологічний порядок (старі зверху, нові знизу) для розрахунку та виводу
    weights.sort((a, b) => new Date(a.date) - new Date(b.date));

    weights.forEach((item, index) => {
        let diffPrev =
            index > 0
                ? (item.weight - weights[index - 1].weight).toFixed(1)
                : null;
        let diffGoal =
            !isNaN(goal) && goal > 0
                ? Math.abs(item.weight - goal).toFixed(1)
                : null;

        const tr = document.createElement('tr');
        let diffHtml = '';
        if (diffPrev !== null) {
            const val = parseFloat(diffPrev);
            if (val > 0)
                diffHtml = `<span class="diff-up"> (+${diffPrev} ▲)</span>`;
            else if (val < 0)
                diffHtml = `<span class="diff-down"> (${diffPrev} ▼)</span>`;
            else diffHtml = `<span class="diff-goal"> (без змін)</span>`;
        }

        tr.innerHTML = `
            <td><strong>${new Date(item.date).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit' })}</strong></td>
            <td><span class="weight-record">${item.weight} кг</span>${diffHtml}${diffGoal ? `<br><span class="diff-goal">(до цілі: ${diffGoal} кг)</span>` : ''}</td>
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

if (addWeeklyWeightBtn) {
    addWeeklyWeightBtn.addEventListener('click', () => {
        const weights = getWeeklyWeights();
        const inputWeight = parseFloat(weeklyWeightInput.value);
        const selDate = weeklyDateInput.value;

        if (!inputWeight || inputWeight <= 0 || !selDate) {
            alert('Будь ласка, оберіть дату та введіть коректну вагу');
            return;
        }

        const existing = weights.findIndex((w) => w.date === selDate);
        if (existing !== -1) weights[existing].weight = inputWeight;
        else weights.push({ date: selDate, weight: inputWeight });

        saveWeeklyWeights(weights);
        weeklyWeightInput.value = '';
        renderWeeklyWeights();
    });
}

// ДЕННІ ЗАПИСИ
function updateWaterUI() {
    if (waterCountEl) waterCountEl.textContent = currentWater;
    if (waterProgressBar)
        waterProgressBar.style.width = `${Math.min((currentWater / WATER_TARGET) * 100, 100)}%`;
}

function loadDayData() {
    if (!dateSelect) return;
    const data = getMasterData();
    const d = data[dateSelect.value] || {};

    if (programDaySelect) programDaySelect.value = d.programDay || 'Відпочинок';
    currentWater = d.water || 0;
    if (vitD3) vitD3.checked = d.vitD3 || false;
    if (omega3) omega3.checked = d.omega3 || false;
    if (magnesium) magnesium.checked = d.magnesium || false;
    if (ashwa) ashwa.checked = d.ashwa || false;
    if (lcarnitine) lcarnitine.checked = d.lcarnitine || false;
    if (vitB) vitB.checked = d.vitB || false;
    if (dayNotes) dayNotes.value = d.notes || '';

    updateWaterUI();
    renderHistoryList();
    setRandomMotivation();
}

if (dateSelect) dateSelect.addEventListener('change', loadDayData);
if (btnPlus)
    btnPlus.addEventListener('click', () => {
        currentWater++;
        updateWaterUI();
    });
if (btnMinus)
    btnMinus.addEventListener('click', () => {
        if (currentWater > 0) {
            currentWater--;
            updateWaterUI();
        }
    });

if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const data = getMasterData();
        data[dateSelect.value] = {
            programDay: programDaySelect
                ? programDaySelect.value
                : 'Відпочинок',
            water: currentWater,
            vitD3: vitD3 ? vitD3.checked : false,
            omega3: omega3 ? omega3.checked : false,
            magnesium: magnesium ? magnesium.checked : false,
            ashwa: ashwa ? ashwa.checked : false,
            lcarnitine: lcarnitine ? lcarnitine.checked : false,
            vitB: vitB ? vitB.checked : false,
            notes: dayNotes ? dayNotes.value : '',
        };
        saveMasterData(data);
        loadDayData();

        clearTimeout(statusTimeout);
        if (statusMsg) {
            statusMsg.classList.remove('hidden');
            statusTimeout = setTimeout(
                () => statusMsg.classList.add('hidden'),
                2500,
            );
        }
    });
}

if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        if (confirm('Очистити всі записи за цей день?')) {
            const data = getMasterData();
            delete data[dateSelect.value];
            saveMasterData(data);
            loadDayData();
        }
    });
}

function renderHistoryList() {
    if (!historyLog) return;
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

// ІНІЦІАЛІЗАЦІЯ ПРИ ЗАПУСКУ
if (dateSelect) dateSelect.value = new Date().toISOString().split('T')[0];
if (weeklyDateInput)
    weeklyDateInput.value = dateSelect
        ? dateSelect.value
        : new Date().toISOString().split('T')[0];
loadDayData();
renderWeeklyWeights();
