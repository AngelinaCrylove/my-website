// 🎲 Функция для выбора случайного сообщения
function getRandomMessage(count) {
  const list = messages[count];
  return list[Math.floor(Math.random() * list.length)];
}

// 🔄 Функция сокращения числа до номера аркана (0-21)
function reduceToArcanum(num) {
  num = Number(num);
  if (num === 22) return 0;
  if (num <= 21) return num;
  let sum = num;
  while (sum > 21) {
    let temp = 0;
    for (let char of sum.toString()) {
      temp += parseInt(char);
    }
    sum = temp;
  }
  return sum;
}

// 📅 Функция проверки валидности даты
function isValidDate(day, month, year) {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
}

// 🔍 Функция определения усиленных/ультра-арканов
function getAmplifiedArcana(day, month, year) {
  const a1 = reduceToArcanum(day);
  const a2 = reduceToArcanum(month);
  const yearSum = String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const a3 = reduceToArcanum(yearSum);
  const counts = {};
  [a1, a2, a3].forEach(num => {
    counts[num] = (counts[num] || 0) + 1;
  });
  let amplified = null;
  let isUltra = false;
  for (let num in counts) {
    if (counts[num] >= 2) {
      amplified = parseInt(num);
      isUltra = counts[num] === 3;
      break;
    }
  }
  return { amplified, isUltra };
}

// 🖥️ Функция генерации карт для ОДНОГО человека (исправленная)
function generateSingleCards() {
  const day = parseInt(document.getElementById("day").value);
  const month = parseInt(document.getElementById("month").value);
  const year = parseInt(document.getElementById("year").value);
  if (!day || !month || !year) {
    alert("🌙 Пожалуйста, выбери полную дату рождения!");
    return;
  }
  if (!isValidDate(day, month, year)) {
    alert("✨ Некорректная дата!");
    return;
  }
  if (year < 1925 || year > 2025) {
    alert("✨ Пожалуйста, выбери год от 1925 до 2025!");
    return;
  }

  // 🔥 Правильная обработка года: сначала сумма цифр!
  const yearSum = String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const arcana1 = reduceToArcanum(day);
  const arcana2 = reduceToArcanum(month);
  const arcana3 = reduceToArcanum(yearSum);

  const card1 = arcana[arcana1];
  const card2 = arcana[arcana2];
  const card3 = arcana[arcana3];
  const uniqueCardsMap = new Map();
  [card1, card2, card3].forEach(card => uniqueCardsMap.set(card.name, card));
  const cardsToShow = Array.from(uniqueCardsMap.values());
  const uniqueCount = cardsToShow.length;
  const randomMessage = getRandomMessage(uniqueCount);

  let html = `<h3>✨ Ваши сигнификаторы:</h3>`;
  html += `<p style="font-size: 18px; font-weight: 500; color: #8b5a7d; margin: 20px 0; text-align: center;">${randomMessage}</p>`;
  html += `<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin: 40px auto; max-width: 1200px;">`;

  cardsToShow.forEach((card, index) => {
    let emoji, color, borderColor, bgColor;
    switch (index) {
      case 0:
        emoji = "🌙";
        color = "#5a9bd5";
        borderColor = "#d0e7ff";
        bgColor = "#f0f9ff";
        break;
      case 1:
        emoji = "🌸";
        color = "#d87093";
        borderColor = "#ffd6e7";
        bgColor = "#fff0f6";
        break;
      case 2:
      default:
        emoji = "🌿";
        color = "#7cb342";
        borderColor = "#d0f0d0";
        bgColor = "#f0fff0";
        break;
    }
    html += `
      <div class="card-container" style="width: 300px; max-width: 300px; box-sizing: border-box; padding: 20px; background: ${bgColor}; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: center;">
        <h4 style="color: ${color};">${emoji} ${card.name}</h4>
        <img src="${card.image}" alt="${card.name}" style="width: 100%; max-width: 180px; border-radius: 10px; margin: 15px 0; border: 3px solid ${borderColor};">
      </div>
    `;
  });

  html += `</div>`;

  // === БЛОК УСИЛЕННОГО / УЛЬТРА АРКАНА === (как на скриншоте)
  const amplification = getAmplifiedArcana(day, month, year);
  if (amplification.amplified !== null) {
    const cardName = arcana[amplification.amplified].name;
    const level = amplification.isUltra ? "УЛЬТРА" : "усиленный";
    html += `
      <div style="background: #fff0f0; padding: 15px; border-radius: 12px; margin: 20px auto; max-width: 800px; text-align: center;">
        <p style="margin: 0; font-size: 18px; color: #d93025; font-weight: 600;">
          У тебя ${level} аркан <strong>${cardName}</strong>
        </p>
      </div>
    `;
  }

  // === ВЫВОД ЗНАЧЕНИЙ КАРТ (только один раз!) ===
  cardsToShow.forEach(card => {
    html += `
      <div style="margin: 40px auto; max-width: 800px; text-align: left; padding: 0 20px;">
        <h2 style="color: #5a4a5d; margin-bottom: 10px; font-family: 'Playfair Display', serif;">${card.name}</h2>
        <p style="white-space: pre-line; font-size: 16px; line-height: 1.7; color: #333; text-align: left; margin: 0 auto;">${card.meaning}</p>
      </div>
    `;
  });

  // 🔥 === ПРОВЕРКА КОНКУРИРУЮЩИХ АРКАНОВ === (теперь ПОСЛЕ трактовок!)
  const userSet = new Set([arcana1, arcana2, arcana3]);
  const hasCompetingPair = competingPairs.some(([a, b]) => userSet.has(a) && userSet.has(b));

  if (hasCompetingPair) {
    const randomCompetingMessage = COMPETING_ARCANA_MESSAGES[
      Math.floor(Math.random() * COMPETING_ARCANA_MESSAGES.length)
    ];
    html += `
      <div style="background: #fff9c4; padding: 25px; border-radius: 15px; margin: 40px auto; max-width: 800px; text-align: center; border: 1px solid #ffd54f; color: #5d4037; font-weight: 500; font-family: 'Raleway', sans-serif; line-height: 1.6; font-size: 17px;">
        ${randomCompetingMessage}
      </div>
    `;
  }

  // === ФИНАЛЬНЫЙ БЛОК С ПРИЗЫВОМ К ПАРЕ ===
  let introspectionText = "";
  if (uniqueCount === 1) {
    introspectionText = "Несмотря на то, что у тебя один ультра-аркан, в котором сконцентрирована вся твоя энергия — и светлая, и тёмная,";
  } else if (uniqueCount === 2) {
    introspectionText = "Два аркана, олицетворяющие две стороны твоей личности — лишь проблеск твоей истинной сущности, ведь";
  } else {
    introspectionText = "Трех арканов достаточно, чтобы увидеть глубину твоей души, но не предел, ведь";
  }

  html += `
    <div style="background: #f8fdfa; padding: 40px; border-radius: 15px; margin: 60px auto; max-width: 900px; box-shadow: 0 4px 20px rgba(46, 90, 74, 0.1);">
      <h3 style="color: #2e5a4a; font-family: 'Playfair Display', serif; margin-bottom: 30px; line-height: 1.6;">
        ${introspectionText} ты не застывший образ.<br>
        Ты меняешься во времени, в пространстве, на разных этапах пути и в зависимости от того, кто рядом.<br>
        По отдельности каждый расклад говорит о моменте.<br>
        Но когда карты двух людей ложатся рядом, начинается настоящий разговор.<br><br>
        <a href="couple.html" style="color: #2e5a4a; text-decoration: none; font-weight: bold; border-bottom: 1px solid #2e5a4a; padding-bottom: 2px;">
          Хочешь услышать, что они скажут о вас?
        </a>
      </h3>
    </div>
  `;

  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = html;
  resultDiv.style.opacity = "1";
  smoothScrollToResult();
}

// 🧩 Хелпер: генерация компактного блока для одного человека
function generateCompactPersonBlock(day, month, year, title, emojiSet = ["🌙", "🌸", "🌿"]) {
  const arcana1 = reduceToArcanum(day);
  const arcana2 = reduceToArcanum(month);
  const yearSum = String(year).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  const arcana3 = reduceToArcanum(yearSum);
  
  const card1 = arcana[arcana1];
  const card2 = arcana[arcana2];
  const card3 = arcana[arcana3];
  const uniqueCardsMap = new Map();
  [card1, card2, card3].forEach(card => uniqueCardsMap.set(card.name, card));
  const cardsToShow = Array.from(uniqueCardsMap.values());
  const uniqueCount = cardsToShow.length;
  const randomMessage = getRandomMessage(uniqueCount);

  let html = `<div style="background: #fff9f7; padding: 30px; border-radius: 15px; margin: 40px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">`;
  html += `<h2 style="color: #8b5a7d; font-family: 'Playfair Display', serif; text-align: center; margin-top: 0; margin-bottom: 20px;">${title}</h2>`;
  html += `<p style="font-size: 18px; font-weight: 500; color: #8b5a7d; margin: 20px 0; text-align: center;">${randomMessage}</p>`;
  html += `<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin: 30px auto; max-width: 1200px;">`;
  cardsToShow.forEach((card, index) => {
    let emoji, color, borderColor, bgColor;
    switch (index) {
      case 0:
        emoji = emojiSet[0];
        color = "#5a9bd5";
        borderColor = "#d0e7ff";
        bgColor = "#f0f9ff";
        break;
      case 1:
        emoji = emojiSet[1];
        color = "#d87093";
        borderColor = "#ffd6e7";
        bgColor = "#fff0f6";
        break;
      case 2:
      default:
        emoji = emojiSet[2];
        color = "#7cb342";
        borderColor = "#d0f0d0";
        bgColor = "#f0fff0";
        break;
    }
    html += `
      <div class="card-container" style="width: 260px; max-width: 260px; box-sizing: border-box; padding: 15px; background: ${bgColor}; border-radius: 12px; box-shadow: 0 3px 10px rgba(0,0,0,0.08); text-align: center;">
        <h4 style="color: ${color}; margin: 10px 0;">${emoji} ${card.name}</h4>
        <img src="${card.image}" alt="${card.name}" style="width: 150%; max-width: 150px; border-radius: 8px; margin: 10px 0; border: 2px solid ${borderColor};">
      </div>
    `;
  });
  html += `</div>`;
  html += `</div>`;
  return {
    html,
    arcanaList: [arcana1, arcana2, arcana3]
  };
}

// 💞 Функция генерации карт для ПАРЫ
function generateCoupleCards() {
  const day1 = parseInt(document.getElementById("day1").value);
  const month1 = parseInt(document.getElementById("month1").value);
  const year1 = parseInt(document.getElementById("year1").value);
  const day2 = parseInt(document.getElementById("day2").value);
  const month2 = parseInt(document.getElementById("month2").value);
  const year2 = parseInt(document.getElementById("year2").value);
  if (!day1 || !month1 || !year1 || !day2 || !month2 || !year2) {
    alert("🌙 Пожалуйста, выбери полные даты рождения для обоих!");
    return; 
  }
  if (!isValidDate(day1, month1, year1)) {
    alert("✨ Пожалуйста, проверь свою дату!");
    return;
  }
  if (!isValidDate(day2, month2, year2)) {
    alert("✨ Пожалуйста, проверь дату партнера!");
    return;
  }
  if (year1 < 1925 || year1 > 2025 || year2 < 1925 || year2 > 2025) {
    alert("✨ Пожалуйста, выбери годы от 1925 до 2025!");
    return;
  }
  const person1 = generateCompactPersonBlock(day1, month1, year1, "Ты", ["🌙", "🌸", "🌿"]);
  const person2 = generateCompactPersonBlock(day2, month2, year2, "Твой Партнер", ["⭐", "💖", "🍀"]);
  let html = `<h3>💞 Арканы вашей пары</h3>`;
  html += `<div style="width: 1200px; margin: 0 auto; text-align: left;">${person1.html}${person2.html}`;
  const compatibilityText = generateCompatibilityAnalysis(person1.arcanaList, person2.arcanaList);
  html += `
    <div style="background: #fff0f8; padding: 30px; border-radius: 15px; margin: 60px 0; box-shadow: 0 3px 10px rgba(0,0,0,0.05);">
      <h2 style="color: #8b5a7d; font-family: 'Playfair Display', serif; margin-bottom: 30px; text-align: center;">💞 Анализ вашей совместимости</h2>
      <div style="text-align: left; font-size: 16px; line-height: 1.8; color: #333; margin-top: 20px;">${compatibilityText}</div>
    </div>
  `;
  html += `</div>`;
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = html;
  smoothScrollToResult();
}

// Умная навигация по Enter
function handleEnter(event, nextFieldId, isLast = false) {
  if (event.key === "Enter") {
    event.preventDefault();
    if (isLast) {
      if (document.getElementById("generateSingleBtn")) {
        document.getElementById("generateSingleBtn").click();
      } else if (document.getElementById("generateCoupleBtn")) {
        document.getElementById("generateCoupleBtn").click();
      }
    } else {
      const nextField = document.getElementById(nextFieldId);
      if (nextField) {
        nextField.focus();
      }
    }
  }
}


// Плавная прокрутка
function smoothScrollToResult() {
  const resultElement = document.getElementById("result");
  if (resultElement) {
    const elementPosition = resultElement.getBoundingClientRect().top + window.scrollY;
    const offset = window.innerHeight * 0.05;
    window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    setTimeout(() => { resultElement.style.opacity = "1"; }, 100);
  }
}

// 💞 Анализ совместимости с поддержкой триплетов и доп-текстов
function generateCompatibilityAnalysis(person1Arcana, person2Arcana) {
  // Собираем все уникальные арканы каждого
  const set1 = new Set(person1Arcana);
  const set2 = new Set(person2Arcana);

  const allPairs = [];
  const interpretationKeys = new Set();
  const extraMessagesToRender = new Set();

  for (const a of set1) {
    for (const b of set2) {
      if (a === b) {
        const key = `${a}-${a}`;
        if (TAROT_PAIR_INTERPRETATIONS[key]) {
          allPairs.push({ type: 'same', key, a, b });
          interpretationKeys.add(key);
        }
      } else {
        const key = a < b ? `${a}-${b}` : `${b}-${a}`;
        if (TAROT_PAIR_INTERPRETATIONS[key]) {
          allPairs.push({ type: 'cross', key, a, b });
          interpretationKeys.add(key);
        }
      }
    }
  }

  // 🔑 Обязательно: копия для модификации
  const keysToRender = new Set(interpretationKeys);

  // Проверяем, какие триплеты у нас есть
  const has00 = interpretationKeys.has('0-0');
  const has11 = interpretationKeys.has('1-1');
  const has22 = interpretationKeys.has('2-2');
  const has33 = interpretationKeys.has('3-3');
  const has44 = interpretationKeys.has('4-4');
  const has12 = interpretationKeys.has('1-2');
  const has01 = interpretationKeys.has('0-1');
  const has04 = interpretationKeys.has('0-4');
  const has29 = interpretationKeys.has('2-9');
  const has615 = interpretationKeys.has('6-15');
  const has912 = interpretationKeys.has('9-12');
  const has1819 = interpretationKeys.has('18-19');

  // Триплет: 2-2 + 9-9 + 2-9 → убираем зеркала, оставляем только перекрёстную
  if (interpretationKeys.has('2-2') && interpretationKeys.has('9-9') && interpretationKeys.has('2-9')) {
    keysToRender.delete('2-2');
    keysToRender.delete('9-9');
    extraMessagesToRender.add('2-9-deep');
  }

  // Триплет: 3-3 + 4-4 + 3-4 → оставляем всё, добавляем доп-текст
  if (interpretationKeys.has('3-3') && interpretationKeys.has('4-4') && interpretationKeys.has('3-4')) {
    extraMessagesToRender.add('3-4-full');
  }

  // Триплет: 6-6 + 15-15 + 6-15
  if (interpretationKeys.has('6-6') && interpretationKeys.has('15-15') && interpretationKeys.has('6-15')) {
    keysToRender.delete('6-6');
    keysToRender.delete('15-15');
    extraMessagesToRender.add('6-15-deep');
  }

  // Триплет: 9-9 + 12-12 + 9-12
  if (interpretationKeys.has('9-9') && interpretationKeys.has('12-12') && interpretationKeys.has('9-12')) {
    keysToRender.delete('9-9');
    keysToRender.delete('12-12');
    extraMessagesToRender.add('9-12-deep');
  }

  // Триплет: 18-18 + 19-19 + 18-19
  if (interpretationKeys.has('18-18') && interpretationKeys.has('19-19') && interpretationKeys.has('18-19')) {
    keysToRender.delete('18-18');
    keysToRender.delete('19-19');
    extraMessagesToRender.add('18-19-deep');
  }

  // Триплет: 0-0 + 4-4 + 0-4
  if (interpretationKeys.has('0-0') && interpretationKeys.has('4-4') && interpretationKeys.has('0-4')) {
    keysToRender.delete('0-0');
    keysToRender.delete('4-4');
    extraMessagesToRender.add('0-4-deep');
  }

  // Триплет: 0-0 + 1-1 + 0-1 → оставляем всё
  if (interpretationKeys.has('0-0') && interpretationKeys.has('1-1') && interpretationKeys.has('0-1')) {
    extraMessagesToRender.add('0-1-full');
  }

  // Триплет: 1-1 + 2-2 + 1-2
  if (interpretationKeys.has('1-1') && interpretationKeys.has('2-2') && interpretationKeys.has('1-2')) {
    keysToRender.delete('2-2'); // убираем дублирующее зеркало
    extraMessagesToRender.add('1-1-and-1-2');
  }

  // === НОВАЯ ЛОГИКА ВЫВОДА ===
  const rendered = new Set();
  let html = '';

  // Карта: ключ → имя доп-сообщения
  const pairToExtra = {
    '3-4': '3-4-full',
    '1-1': '1-1-and-1-2',
    '0-1': '0-1-full',
    '2-9': '2-9-deep',
    '6-15': '6-15-deep',
    '9-12': '9-12-deep',
    '18-19': '18-19-deep',
    '0-4': '0-4-deep'
  };

  // Группы
  const mirrorPairs = [];
  const regularPairs = [];
  const specialPairs = [];

  for (const key of keysToRender) {
    if (key.split('-')[0] === key.split('-')[1]) {
      // Зеркало
      if (extraMessagesToRender.has(pairToExtra[key])) {
        specialPairs.push(key);
      } else {
        mirrorPairs.push(key);
      }
    } else {
      // Перекрёстная
      if (extraMessagesToRender.has(pairToExtra[key])) {
        specialPairs.push(key);
      } else {
        regularPairs.push(key);
      }
    }
  }

  // Вспомогательная функция для рендеринга пары + доп-текста
  function renderPair(key) {
    if (rendered.has(key)) return '';
    rendered.add(key);
    const text = TAROT_PAIR_INTERPRETATIONS[key];
    if (!text) return '';

    let block = '';
    if (key.split('-')[0] === key.split('-')[1]) {
      const num = parseInt(key);
      block = `<h3>${arcana[num].name} 💠 ${arcana[num].name}</h3><p>${text}</p>`;
    } else {
      const [a, b] = key.split('-').map(Number);
      let title;
      if (key === '17-19') title = `${arcana[a].name} ✨ ${arcana[b].name}`;
      else if (key === '2-9') title = `${arcana[a].name} 🕊️ ${arcana[b].name}`;
      else if (key === '18-19') title = `${arcana[a].name} 🌑 ${arcana[b].name}`;
      else title = `${arcana[a].name} 💫 ${arcana[b].name}`;
      block = `<h3>${title}</h3><p>${text}</p>`;
    }

    // Доп-текст сразу под парой
    const extraKey = pairToExtra[key];
    if (extraKey && extraMessagesToRender.has(extraKey)) {
      const extraText = TAROT_PAIR_EXTRA_MESSAGES[extraKey];
      let bgColor = "#f0f9ff", borderColor = "#5a9bd5", textColor = "#2e5a9d";
      if (extraKey === '3-4-full' || extraKey === '9-12-deep') {
        bgColor = "#f8fdfa"; borderColor = "#7cb342"; textColor = "#2e5a4a";
      } else if (extraKey === '0-1-full' || extraKey === '6-15-deep') {
        bgColor = "#fff5f8"; borderColor = "#d87093"; textColor = "#9a2d5a";
      } else if (extraKey === '18-19-deep') {
        bgColor = "#f0f0ff"; borderColor = "#7a5ca0"; textColor = "#4a3a6a";
      } else if (extraKey === '0-4-deep') {
        bgColor = "#fff8f0"; borderColor = "#bc7a3f"; textColor = "#8a5a2d";
      }
      block += `<div style="background: ${bgColor}; padding: 20px; border-radius: 12px; margin: 20px 0; border-left: 4px solid ${borderColor};">
        <p style="margin: 0; font-style: italic; color: ${textColor};">${extraText}</p>
      </div>`;
    }

    return block;
  }

  // Выводим в порядке: зеркала → обычные → особые
  for (const key of mirrorPairs) html += renderPair(key);
  for (const key of regularPairs) html += renderPair(key);
  for (const key of specialPairs) html += renderPair(key);

  return html || `<h3>Ваши энергии пока не нашли чёткого отражения в картах… Но это вовсе не значит, что связи нет — просто она уникальна. И, возможно, именно от вас самих зависит чуть больше, чем от карт.</h3>`;
}

// === ЗАПОЛНЕНИЕ <select> И НАВЕШИВАНИЕ ОБРАБОТЧИКОВ ===
document.addEventListener('DOMContentLoaded', () => {
  const months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  function fillSelect(id, values) {
    const sel = document.getElementById(id);
    if (!sel) return;
    values.forEach(val => {
      const opt = document.createElement('option');
      if (typeof val === 'object') {
        opt.value = val.value;
        opt.textContent = val.text;
      } else {
        opt.value = val;
        opt.textContent = val;
      }
      sel.appendChild(opt);
    });
  }

  if (document.getElementById('day')) {
    fillSelect('day', Array.from({length: 31}, (_, i) => i + 1));
    fillSelect('month', months.map((name, i) => ({ value: i + 1, text: name })));
    fillSelect('year', Array.from({length: 101}, (_, i) => 2025 - i));
  }

  if (document.getElementById('day1')) {
    fillSelect('day1', Array.from({length: 31}, (_, i) => i + 1));
    fillSelect('month1', months.map((name, i) => ({ value: i + 1, text: name })));
    fillSelect('year1', Array.from({length: 101}, (_, i) => 2025 - i));
    fillSelect('day2', Array.from({length: 31}, (_, i) => i + 1));
    fillSelect('month2', months.map((name, i) => ({ value: i + 1, text: name })));
    fillSelect('year2', Array.from({length: 101}, (_, i) => 2025 - i));
  }

  if (document.getElementById("day")) {
    document.getElementById("day").addEventListener("keydown", e => handleEnter(e, "month"));
    document.getElementById("month").addEventListener("keydown", e => handleEnter(e, "year"));
    document.getElementById("year").addEventListener("keydown", e => handleEnter(e, null, true));
    document.getElementById("day").focus();
  }
  if (document.getElementById("day1")) {
    document.getElementById("day1").addEventListener("keydown", e => handleEnter(e, "month1"));
    document.getElementById("month1").addEventListener("keydown", e => handleEnter(e, "year1"));
    document.getElementById("year1").addEventListener("keydown", e => handleEnter(e, "day2"));
    document.getElementById("day2").addEventListener("keydown", e => handleEnter(e, "month2"));
    document.getElementById("month2").addEventListener("keydown", e => handleEnter(e, "year2"));
    document.getElementById("year2").addEventListener("keydown", e => handleEnter(e, null, true));
    document.getElementById("day1").focus();
  }
});

function getRandomCardsFromAllDecks(count = 10) {
  // Копируем массив, чтобы не мутировать оригинал
  const cards = [...allTarotCards];
  // Перемешиваем по Фишеру–Йетсу
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards.slice(0, count);
}

// 🖼️ Генерация HTML для расклада Кельтский крест (10 карт)
function renderPlusAndColumnLayout() {
  const cards = getRandomCardsFromAllDecks(10);
  if (cards.length < 10) {
    return "<p>Недостаточно карт в колодах!</p>";
  }

  let html = ``;
  html += `<div class="layout-container">`;

  // === ЛЕВАЯ ЧАСТЬ: ПЛЮС ===
  html += `<div class="plus-layout">`;

  // Позиция 3
  html += `<div class="card-box" data-pos="3">
    <img src="${cards[2].image}" alt="${cards[2].name}">
    <h4>${cards[2].name}</h4>
  </div>`;

  // Средний ряд: 5 — 1 — 6
  html += `<div class="plus-row">`;

  // Позиция 5
  html += `<div class="card-box" data-pos="5">
    <img src="${cards[4].image}" alt="${cards[4].name}">
    <h4>${cards[4].name}</h4>
  </div>`;

// Позиция 1 — ДВЕ КАРТЫ (основная + наложенная)
html += `<div class="card-box" data-pos="1" style="position: relative; width: 280px;">
  <!-- Основная карта -->
  <img src="${cards[0].image}" alt="${cards[0].name}" style="width: 200px; height: auto; max-height: 200px; object-fit: contain; object-position: center; border-radius: 8px;">

  <!-- Контейнер для наложенной карты -->
  <div style="position: absolute; top: 0; left: 0; width: 200px; height: 200px; pointer-events: none; z-index: 2;">

    <!-- КАРТА 2 -->
    <img src="${cards[1].image}" alt="${cards[1].name}" 
         style="position: absolute; top: 55%; left: 68%; transform: translate(-50%, -50%) rotate(-90deg); width: 90%; max-height: 100%; height: auto; object-fit: contain; opacity: 0.95; border-radius: 6px;">

    <!-- 🔵 КРУЖОК С ЦИФРОЙ 2 (слева от карты 2) -->
    <div style="position: absolute; top: 55%; left: 70%; 
                transform: translate(-50%, -50%) translateX(-105px) rotate(-90deg);
                background: #c98a5e; color: white; font-weight: bold; font-size: 16px;
                width: 30px; height: 30px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                z-index: 3;">
      2
    </div>

    <!-- 📛 НАЗВАНИЕ КАРТЫ 2 (справа от карты 2) -->
    <div style="position: absolute; top: 55%; left: 70%;
                transform: translate(-50%, -50%) translateX(110px) rotate(-90deg);
                white-space: nowrap;
                font-size: 16px; font-weight: 600; color: #5a4a5d;
                text-align: center;
                max-width: 180px;
                overflow: hidden;
                text-overflow: ellipsis;
                z-index: 3;"
         title="${cards[1].name}">
      ${cards[1].name}
    </div>

  </div>

  <!-- Название основной карты -->
  <h4 style="position: relative; z-index: 3;">${cards[0].name}</h4>
</div>`;

  // Позиция 6
  html += `<div class="card-box" data-pos="6">
    <img src="${cards[5].image}" alt="${cards[5].name}">
    <h4>${cards[5].name}</h4>
  </div>`;

  html += `</div>`; // конец plus-row

  // Позиция 4
  html += `<div class="card-box" data-pos="4">
    <img src="${cards[3].image}" alt="${cards[3].name}">
    <h4>${cards[3].name}</h4>
  </div>`;

  html += `</div>`; // конец plus-layout

  // === ПРАВАЯ ЧАСТЬ: СТОЛБЕЦ (10, 9, 8, 7)
  html += `<div class="column-layout">`;

  // Позиция 10 — карта cards[9] отдельно в столбце
  html += `<div class="card-box" data-pos="10">
    <img src="${cards[9].image}" alt="${cards[9].name}">
    <h4>${cards[9].name}</h4>
  </div>`;

  html += `<div class="card-box" data-pos="9">
    <img src="${cards[8].image}" alt="${cards[8].name}">
    <h4>${cards[8].name}</h4>
  </div>`;

  html += `<div class="card-box" data-pos="8">
    <img src="${cards[7].image}" alt="${cards[7].name}">
    <h4>${cards[7].name}</h4>
  </div>`;

  html += `<div class="card-box" data-pos="7">
    <img src="${cards[6].image}" alt="${cards[6].name}">
    <h4>${cards[6].name}</h4>
  </div>`;

  html += `</div>`; // конец column-layout

  html += `</div>`; // конец layout-container

// === ТРАКТОВКИ (в правильном порядке: позиция 1 → cards[0], ..., позиция 10 → cards[9]) ===
html += `<div style="margin: 50px auto; max-width: 800px; text-align: left; padding: 0 20px;">`;
for (let i = 0; i < 10; i++) {
  const position = i + 1; // позиция от 1 до 10
  const card = cards[i];
  html += `
    <div style="margin: 25px 0; padding: 15px; background: #fff; border-radius: 10px; border-left: 4px solid #8b5a7d;">
      <h3 style="color: #8b5a7d; margin: 5px 0;">${position}. ${card.name}</h3>
<p style="white-space: pre-line; font-size: 16px; line-height: 1.7; color: #333;">${
  positionTemplates[position]
    ? positionTemplates[position](card, false) // пока без переворотов → isReversed = false
    : 'Трактовка недоступна'
}</p>
    </div>
  `;
}
html += `</div>`;

  return html;
}

// ▶️ Функция запуска расклада (вызывается из HTML)
function generatePlusAndColumn() {
  const html = renderPlusAndColumnLayout();
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = html;
  resultDiv.style.opacity = "1";
  if (typeof smoothScrollToResult === 'function') {
    smoothScrollToResult();
  }
} 