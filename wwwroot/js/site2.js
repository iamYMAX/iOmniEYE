// Тексты для баннера
const bannerTexts = [
    {
        headline: "Ваш сильный IT-партнер",
        subtext: "Мы предоставляем комплексные IT-решения, адаптированные под потребности вашего бизнеса."
    },
    {
        headline: "Раскрытие вашего взгляда, на сложные вещи.",
        subtext: "Мы предлагаем передовые IT-услуги, которые улучшают операции вашего бизнеса и повышают безопасность."
    },
    {
        headline: "Полнота IT-решений",
        subtext: "От разработки программного обеспечения до интеграции умного дома — мы охватываем все ваши IT-потребности."
    },
    {
        headline: "Ваш запрос в сфере IT, наш опыт",
        subtext: "Доверьтесь OmniEye для надежных и инновационных IT-решений."
    }
];


let currentIndex = 0;

function updateBannerText() {
    const headlineElement = document.getElementById('banner-text');
    const subtextElement = document.getElementById('banner-subtext');

    headlineElement.classList.remove('banner-text');
    subtextElement.classList.remove('banner-text');

    setTimeout(() => {
        headlineElement.textContent = bannerTexts[currentIndex].headline;
        subtextElement.textContent = bannerTexts[currentIndex].subtext;

        headlineElement.classList.add('banner-text');
        subtextElement.classList.add('banner-text');
    }, 200); // Задержка перед изменением текста

    currentIndex = (currentIndex + 1) % bannerTexts.length;
}

// Меняем текст каждые 5 секунд
setInterval(updateBannerText, 7000);

// Инициализация первого текста
updateBannerText();

// Тексты для анимации печатающегося текста
const typingTexts1 = [
    "Мы создаем инновационные решения для вашего бизнеса...",
    "Автоматизируем ваши процессы для повышения эффективности...",
    "Разрабатываем современные веб- и мобильные приложения...",    
    "Оптимизируем ваши бизнес-процессы, предоставляем индивидуальные решения..."
    
    
];

const typingTexts2 = [
    "Обеспечиваем бесперебойную работу ваших систем...",
    "Предоставляем круглосуточную техническую поддержку...",
    "Помогаем вам оставаться на шаг впереди конкурентов...",
    "Реализуем сложные IT-проекты под ключ...",
    "Предоставляем экспертные консультации по IT-стратегии...",
    "Обеспечиваем вашу цифровую безопасность...",
    "Обеспечиваем безопасность ваших облачных решений..."
];

// Настройки анимации
const typingSpeed = 60; // Скорость печатания (мс)
const erasingSpeed = 10; // Скорость стирания (мс)
const newTextDelay = 3000; // Задержка перед печатанием нового текста (мс)

// Функция для анимации печатания текста
function type(element, texts, index = 0, charIndex = 0) {
    if (charIndex < texts[index].length) {
        element.textContent += texts[index].charAt(charIndex);
        charIndex++;
        setTimeout(() => type(element, texts, index, charIndex), typingSpeed);
    } else {
        setTimeout(() => erase(element, texts, index, charIndex), newTextDelay);
    }
}

// Функция для анимации стирания текста
function erase(element, texts, index, charIndex) {
    if (charIndex > 0) {
        element.textContent = texts[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(() => erase(element, texts, index, charIndex), erasingSpeed);
    } else {
        index = Math.floor(Math.random() * texts.length); // Случайный выбор следующего текста
        setTimeout(() => type(element, texts, index, charIndex), typingSpeed);
    }
}

// Запуск анимации для всех элементов
document.addEventListener("DOMContentLoaded", () => {
    const typingTextElement = document.getElementById("typing-text");
    const typingTextElement2 = document.getElementById("typing-text-2");

    if (typingTextElement) {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * typingTexts1.length); // Случайный стартовый текст
            type(typingTextElement, typingTexts1, randomIndex);
        }, newTextDelay);
    }

    if (typingTextElement2) {
        setTimeout(() => {
            const randomIndex = Math.floor(Math.random() * typingTexts2.length); // Случайный стартовый текст
            type(typingTextElement2, typingTexts2, randomIndex);
        }, newTextDelay);
    }
});
