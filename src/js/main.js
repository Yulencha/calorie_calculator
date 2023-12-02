const productNameInput = document.getElementById("product-name");
const productCaloriesInput = document.getElementById("product-calories");
const calorieLimitInput = document.getElementById("daily-calorie-limit");
const productsList = document.getElementById("products");
const addProductButton = document.getElementById("add-product");
const setGoalButton = document.getElementById("set-goal");
const clearDataButton = document.getElementById("clear-data");
const filterInput = document.getElementById("filter-input");
const sortButton = document.getElementById("sort-calories");

// Инициализация переменных для хранения данных продуктов и лимита калорий
let products = JSON.parse(localStorage.getItem("products")) || [];
let dailyCalorieLimit = JSON.parse(localStorage.getItem("dailyCalorieLimit")) || 0;

// Функция для добавления нового продукта
function addProduct() {
  // Получаем название и калорийность продукта
  const name = productNameInput.value.trim();
  const calories = parseInt(productCaloriesInput.value, 10);

  // Проверяем  корректность введенных данных
  if (name && !isNaN(calories)) {
    // Добавляем продукт в список и сохраняем его в локальном хранилище браузера
    products.push({ name, calories });
    localStorage.setItem("products", JSON.stringify(products));

    // Обновляем отображение списка продуктов и очищаем поля ввода
    renderProducts();
    productNameInput.value = "";
    productCaloriesInput.value = "";
  }
}

// Функция для установки дневной цели по калориям
function setGoal() {
  // Получаем новый лимит калорий
  dailyCalorieLimit = parseInt(calorieLimitInput.value, 10);
  // Проверяем  корректность введенных данных
  if (!isNaN(dailyCalorieLimit)) {
    // Сохраняем данные в localStorage
    localStorage.setItem("dailyCalorieLimit", JSON.stringify(dailyCalorieLimit));
    renderProducts(); // для обновления графика
  }
}

// Функция для удаления продукта из списка по индексу
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem("products", JSON.stringify(products));
  renderProducts();
}

// Функция для отображения списка продуктов и общей калорийности
function renderProducts() {
  productsList.innerHTML = "";
  let totalCalories = 0;

  // Фильтрация списка продуктов по введенному значению в поле поиска
  const filteredProducts = filterInput.value
    ? products.filter((product) =>
        product.name.toLowerCase().includes(filterInput.value.toLowerCase())
      )
    : products;

  // Перебор отфильтрованных продуктов для отображения их на странице
  filteredProducts.forEach((product, index) => {
    totalCalories += product.calories;
    const productElement = document.createElement("li");
    productElement.textContent = `${product.name} - ${product.calories} ккал `;

    // Создаем кнопку удаления продукта и привязываем обработчика события
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Удалить";
    deleteButton.onclick = () => deleteProduct(index);

    productElement.appendChild(deleteButton);
    productsList.appendChild(productElement);
  });

  // Обновление графика с общей калорийностью
  updateChart(totalCalories);
}

// Функция для очистки данных (списка продуктов и лимита калорий)
function clearData() {
  localStorage.removeItem("products");
  localStorage.removeItem("dailyCalorieLimit");
  products = [];
  dailyCalorieLimit = 0;
  renderProducts();
}

let ascendingOrder = true; // Переменная для отслеживания порядка сортировки

// Функция для сортировки продуктов по калориям
function sortProductsByCalories() {
  if (ascendingOrder) {
    products.sort((a, b) => a.calories - b.calories); // Сортировка по возрастанию
  } else {
    products.sort((a, b) => b.calories - a.calories); // Сортировка по убыванию
  }
  ascendingOrder = !ascendingOrder;
  renderProducts(); // Обновляем список продуктов на странице после сортировки
}

// Функция для обновления отображения графика калорий
function updateChart(totalCalories) {
  let chartContainer = document.querySelector(".calorie-calculator__chart");
  chartContainer.innerHTML = ""; // Очищаем предыдущий график

  const chart = document.createElement("div");
  chart.className = "chart-container";

  const progress = document.createElement("div");
  progress.className = `chart-progress ${
    totalCalories > dailyCalorieLimit ? "chart-progress--exceed" : "chart-progress--safe"
  }`;
  progress.style.width =
    dailyCalorieLimit > 0 ? `${Math.min((totalCalories / dailyCalorieLimit) * 100, 100)}%` : "0%";

  const progressText = document.createElement("span");
  progressText.className = "chart-progress__text";
  progressText.textContent = `${totalCalories}/${dailyCalorieLimit} ккал`;

  progress.appendChild(progressText);
  chart.appendChild(progress);
  chartContainer.appendChild(chart);
}

// Инициализация приложения: отображение списка продуктов при загрузке страницы
renderProducts();

// Обработчики событий для кнопок и полей ввода
addProductButton.addEventListener("click", addProduct);
setGoalButton.addEventListener("click", setGoal);
clearDataButton.addEventListener("click", clearData);
sortButton.addEventListener("click", sortProductsByCalories);
filterInput.addEventListener("input", renderProducts);
