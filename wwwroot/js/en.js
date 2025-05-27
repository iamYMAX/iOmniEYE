// Тексты для баннера
const bannerTexts = [
    {
        headline: "Your All-Seeing IT Partner",
        subtext: "At OmniEye, we provide comprehensive IT solutions tailored to your business needs."
    },
    {
        headline: "Empowering Your Vision",
        subtext: "We offer advanced IT services that enhance your business operations and security."
    },
    {
        headline: "Complete IT Solutions",
        subtext: "From software development to smart home integration, we cover all your IT needs."
    },
    {
        headline: "Your IT, Our Expertise",
        subtext: "Trust OmniEye for reliable and innovative IT solutions."
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
setInterval(updateBannerText, 5000);

// Инициализация первого текста
updateBannerText();

// Тексты для анимации печатающегося текста
const typingTexts = [
    "Seeing every IT challenge...",
    "Solving every IT problem...",
    "Connecting you with the future...",
    "Ensuring your digital security...",
];
let typingIndex = 0;
let charIndex = 0;
const typingSpeed = 50; // Скорость печатания (мс)
const erasingSpeed = 10; // Скорость стирания (мс)
const newTextDelay = 2000; // Задержка перед печатанием нового текста (мс)
const typingTextElement = document.getElementById("typing-text");

function type() {
    if (charIndex < typingTexts[typingIndex].length) {
        typingTextElement.textContent += typingTexts[typingIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingSpeed);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        typingTextElement.textContent = typingTexts[typingIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingSpeed);
    } else {
        typingIndex = (typingIndex + 1) % typingTexts.length;
        setTimeout(type, typingSpeed);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(type, newTextDelay);
});
const logo = document.querySelector('.logo');
const textElement = document.querySelector('.text');

logo.addEventListener('mouseenter', () => {
    textElement.classList.add('text-hidden'); // Скрываем текущий текст
    setTimeout(() => {
        textElement.textContent = 'Back'; // Меняем текст
        textElement.classList.remove('text-hidden');
        textElement.classList.add('text-transition'); // Анимация печатания
    }, 300);
});

logo.addEventListener('mouseleave', () => {
    textElement.classList.add('text-hidden'); // Скрываем текущий текст
    setTimeout(() => {
        textElement.textContent = 'OmniEye'; // Восстанавливаем оригинальный текст
        textElement.classList.remove('text-hidden');
        textElement.classList.add('text-transition'); // Анимация печатания
    }, 300);
});