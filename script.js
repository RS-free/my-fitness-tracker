// Зв'язуємо змінні елементів з HTML структурою
const waterCountEl = document.getElementById('waterCount');
const btnMinus = document.getElementById('btnMinus');
const btnPlus = document.getElementById('btnPlus');
const vitD3 = document.getElementById('vitD3');
const omega3 = document.getElementById('omega3');
const magnesium = document.getElementById('magnesium');
const ashwa = document.getElementById('ashwa');
const weightInput = document.getElementById('weightInput');
const dayNotes = document.getElementById('dayNotes');
const saveBtn = document.getElementById('saveBtn');
const statusMsg = document.getElementById('statusMsg');

let water = 0;

// Автоматичне завантаження даних, які користувач вводив раніше
function loadDataFromStorage() {
    const savedWater = localStorage.getItem('fit_water');
    if (savedWater) {
        water = parseInt(savedWater);
        waterCountEl.textContent = water;
    }

    vitD3.checked = localStorage.getItem('fit_vitD3') === 'true';
    omega3.checked = localStorage.getItem('fit_omega3') === 'true';
    magnesium.checked = localStorage.getItem('fit_magnesium') === 'true';
    ashwa.checked = localStorage.getItem('fit_ashwa') === 'true';

    weightInput.value = localStorage.getItem('fit_weight') || '';
    dayNotes.value = localStorage.getItem('fit_notes') || '';
}

// Логіка збільшення/зменшення склянок води
btnPlus.addEventListener('click', () => {
    water++;
    waterCountEl.textContent = water;
});

btnMinus.addEventListener('click', () => {
    if (water > 0) {
        water--;
        waterCountEl.textContent = water;
    }
});

// Логіка збереження всього прогресу за допомогою Local Storage
saveBtn.addEventListener('click', () => {
    localStorage.setItem('fit_water', water);
    localStorage.setItem('fit_vitD3', vitD3.checked);
    localStorage.setItem('fit_omega3', omega3.checked);
    localStorage.setItem('fit_magnesium', magnesium.checked);
    localStorage.setItem('fit_ashwa', ashwa.checked);
    localStorage.setItem('fit_weight', weightInput.value);
    localStorage.setItem('fit_notes', dayNotes.value);

    // Візуальне повідомлення про успішне збереження
    statusMsg.classList.remove('hidden');
    setTimeout(() => {
        statusMsg.classList.add('hidden');
    }, 2500);
});

// Запускаємо читання пам'яті при кожному старті сторінки
loadDataFromStorage();
