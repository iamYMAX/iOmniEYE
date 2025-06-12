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

    // Ensure elements exist before trying to manipulate them
    if (!headlineElement || !subtextElement) return;

    headlineElement.classList.remove('banner-text'); // Used for CSS animation reset, if any
    subtextElement.classList.remove('banner-text');

    setTimeout(() => {
        // Check if translations object and current language are available for banner
        const currentLang = localStorage.getItem('languagePreference') || 'ru'; // Assume 'ru' if not set
        if (typeof translations !== 'undefined' && translations[currentLang] && translations[currentLang][bannerTexts[currentIndex].headline_key] && translations[currentLang][bannerTexts[currentIndex].subtext_key]) {
            headlineElement.textContent = translations[currentLang][bannerTexts[currentIndex].headline_key];
            subtextElement.textContent = translations[currentLang][bannerTexts[currentIndex].subtext_key];
        } else {
            // Fallback to original hardcoded texts if translation not found
            // This part needs to be adapted if bannerTexts itself should be multilingual via keys
            // For now, let's assume bannerTexts are dynamic based on some other mechanism or pre-translated
            // Or, if banner_title and banner_subtitle are static keys, those should be used.
            // The current banner implementation seems to be more complex than simple key lookup.
            // For now, let's stick to the original banner text update logic if translation keys for cycling texts are not yet defined.
             headlineElement.textContent = bannerTexts[currentIndex].headline; // Fallback
             subtextElement.textContent = bannerTexts[currentIndex].subtext; // Fallback
        }

        headlineElement.classList.add('banner-text');
        subtextElement.classList.add('banner-text');
    }, 200);

    currentIndex = (currentIndex + 1) % bannerTexts.length;
}

// Removing setInterval and initial call as banner text will be handled by translation logic or needs refactoring for multilingual cycling.
// setInterval(updateBannerText, 7000);
// updateBannerText();


// Typing animation settings
const typingSpeed = 60;
const erasingSpeed = 10;
const newTextDelay = 3000;

let typingInstance1;
let typingInstance2;

// Global functions for typing animation
function type(element, texts, index = 0, charIndex = 0) {
    if (charIndex < texts[index].length) {
        element.textContent += texts[index].charAt(charIndex);
        charIndex++;
        setTimeout(() => type(element, texts, index, charIndex), typingSpeed);
    } else {
        setTimeout(() => erase(element, texts, index, charIndex), newTextDelay);
    }
}

function erase(element, texts, index, charIndex) {
    if (charIndex > 0) {
        element.textContent = texts[index].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(() => erase(element, texts, index, charIndex), erasingSpeed);
    } else {
        index = Math.floor(Math.random() * texts.length);
        setTimeout(() => type(element, texts, index, 0), typingSpeed); // Start typing next text from charIndex 0
    }
}


function initTypingAnimation(currentLang) {
    if (typeof translations === 'undefined' || !currentLang || !translations[currentLang]) {
        console.error("Translations or current language not available for typing animation.");
        return;
    }

    const currentTranslations = translations[currentLang];

    const textBlocks1 = [
        currentTranslations.home_typing_part1 || "Default text 1 part 1...",
        currentTranslations.home_typing_part2 || "Default text 1 part 2...",
        currentTranslations.home_typing_part3 || "Default text 1 part 3...",
        currentTranslations.home_typing_part4 || "Default text 1 part 4..."
    ];

    const textBlocks2 = [
        currentTranslations.section2_typing_part1 || "Default text 2 part 1...",
        currentTranslations.section2_typing_part2 || "Default text 2 part 2..."
    ];

    const typingTextElement = document.getElementById('typing-text');
    const typingTextElement2 = document.getElementById('typing-text-2');

    if (typingTextElement) {
        typingTextElement.textContent = ''; // Clear previous animation content
        // Stop any ongoing timeouts for this element to prevent conflicts
        clearTimeout(typingInstance1); // Assuming typingInstance1 holds the timeout ID
        const randomIndex1 = Math.floor(Math.random() * textBlocks1.length);
        typingInstance1 = setTimeout(() => type(typingTextElement, textBlocks1, randomIndex1, 0), newTextDelay / 2); // Start typing
    }

    if (typingTextElement2) {
        typingTextElement2.textContent = ''; // Clear previous animation content
        clearTimeout(typingInstance2); // Assuming typingInstance2 holds the timeout ID
        const randomIndex2 = Math.floor(Math.random() * textBlocks2.length);
        typingInstance2 = setTimeout(() => type(typingTextElement2, textBlocks2, randomIndex2, 0), newTextDelay / 2); // Start typing
    }
}

// The original DOMContentLoaded listener that started the typing is removed.
// initTypingAnimation will be called from language_init.js when language is set/changed.

// Note: The banner text cycling (updateBannerText and setInterval) might need to be
// integrated with the translation system as well if its texts are static and keyed.
// For now, its direct translation is not handled here, assuming banner_title and banner_subtitle are static.
// If bannerTexts array needs to be dynamic:
// 1. Key each headline/subtext pair in translations.js.
// 2. Rebuild bannerTexts array inside applyTranslations or a dedicated function using currentLang.
// 3. Restart the setInterval for updateBannerText if language changes.
// This part is more complex and depends on how banner content is expected to behave with translations.
// The current `updateBannerText` function was simplified to highlight this dependency.
// A proper solution would involve making `bannerTexts` multilingual.
// For now, the original banner cycling is commented out to avoid conflicts with static translated title/subtitle.
// The main banner title/subtitle in HTML should have data-translate-key and will be translated by applyTranslations.
// The cycling text was an additional feature that needs its own translation strategy.
