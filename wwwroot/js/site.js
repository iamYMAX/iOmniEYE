// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

    const words1 = ["Ваш", "Your"];
    const words2 = ["партнер", "partner"];

    let index1 = 0;
    let charIndex1 = 0;
    let index2 = 0;
    let charIndex2 = 0;

    const typingSpeed = 150; // Speed of typing (in ms)
    const erasingSpeed = 100; // Speed of erasing (in ms)
    const delayBetweenWords = 3000; // Delay before switching to the next word (in ms)

    const word1Element = document.getElementById("word1");
    const word2Element = document.getElementById("word2");

    function typeWord1() {
            if (charIndex1 < words1[index1].length) {
        word1Element.textContent += words1[index1].charAt(charIndex1);
    charIndex1++;
    setTimeout(typeWord1, typingSpeed);
            } else {
        setTimeout(eraseWord1, delayBetweenWords);
            }
        }

    function eraseWord1() {
            if (charIndex1 > 0) {
        word1Element.textContent = words1[index1].substring(0, charIndex1 - 1);
    charIndex1--;
    setTimeout(eraseWord1, erasingSpeed);
            } else {
        index1 = (index1 + 1) % words1.length;
    setTimeout(typeWord1, typingSpeed);
            }
        }

    function typeWord2() {
            if (charIndex2 < words2[index2].length) {
        word2Element.textContent += words2[index2].charAt(charIndex2);
    charIndex2++;
    setTimeout(typeWord2, typingSpeed);
            } else {
        setTimeout(eraseWord2, delayBetweenWords);
            }
        }

    function eraseWord2() {
            if (charIndex2 > 0) {
        word2Element.textContent = words2[index2].substring(0, charIndex2 - 1);
    charIndex2--;
    setTimeout(eraseWord2, erasingSpeed);
            } else {
        index2 = (index2 + 1) % words2.length;
    setTimeout(typeWord2, typingSpeed);
            }
        }
        

        document.addEventListener("DOMContentLoaded", () => {
        setTimeout(typeWord1, typingSpeed);
    setTimeout(typeWord2, delayBetweenWords / 2); // Start the second word slightly later
        });

document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll('.tag-cloud span');

    // Функция для расчета коэффициента масштабирования
    function calculateScaleFactor() {
        const screenWidth = window.innerWidth;

        // Настройки для разных разрешений
        if (screenWidth < 480) { // Мобильные устройства
            return 3.2;
        } else if (screenWidth < 768) { // Планшеты
            return 3.7;
        } else if (screenWidth > 1900) { // Планшеты
            return 8;
        } else { // Десктопы
            return 4;
        }
    }

    // Функция для обновления размера шрифта
    function updateTagSizes() {
        const scaleFactor = calculateScaleFactor();

        tags.forEach(tag => {
            const weight = tag.getAttribute('data-weight');
            tag.style.fontSize = `${weight * scaleFactor}px`;
        });
    }

    // Вызываем функцию при загрузке страницы
    updateTagSizes();

    // Обновляем размеры при изменении размера окна
    window.addEventListener('resize', updateTagSizes);
});
document.addEventListener("DOMContentLoaded", () => {
    const tags = document.querySelectorAll('.tag-cloud');

    // Функция для расчета коэффициента масштабирования
    function calculateScaleFactor() {
        const screenWidth = window.innerWidth;

        // Настройки для разных разрешений
        if (screenWidth < 480) { // Мобильные устройства
            return 3;
        } else if (screenWidth < 768) { // Планшеты
            return 3.7;
        } else if (screenWidth > 1900) { // Планшеты
            return 8;
        } else { // Десктопы
            return 4;
        }
    }

    // Функция для обновления размера шрифта
    function updateTagSizes() {
        const scaleFactor = calculateScaleFactor();

        tags.forEach(tag => {
            const weight = tag.getAttribute('margin-top');
            tag.style.fontSize = `${weight * scaleFactor}%`;
        });
    }

    // Вызываем функцию при загрузке страницы
    updateTagSizes();

    // Обновляем размеры при изменении размера окна
    window.addEventListener('resize', updateTagSizes);
});