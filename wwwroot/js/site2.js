// Banner text cycling logic - This section needs to be reviewed for multilingual compatibility.
// For now, the original banner cycling is commented out as static banner title/subtitle are translated
// via data-translate-key by language_init.js. If cycling different messages is still desired,
// bannerTexts needs to be populated from translations[currentLang] and this logic possibly moved
// or called from language_init.js after language selection.

/*
const bannerTexts = [
    {
        headline_key: "banner_cycle_headline1", // Example key
        subtext_key: "banner_cycle_subtext1"    // Example key
    },
    // Add more keyed objects if cycling is desired
];
let currentIndex = 0;
function updateBannerText() {
    const headlineElement = document.getElementById('banner-text');
    const subtextElement = document.getElementById('banner-subtext');
    if (!headlineElement || !subtextElement) return;

    const currentLang = localStorage.getItem('languagePreference') || 'ru';
    if (typeof translations !== 'undefined' && translations[currentLang]) {
        const currentTranslations = translations[currentLang];
        const headline = currentTranslations[bannerTexts[currentIndex].headline_key] || "Default Headline";
        const subtext = currentTranslations[bannerTexts[currentIndex].subtext_key] || "Default Subtext";

        headlineElement.style.opacity = 0;
        subtextElement.style.opacity = 0;

        setTimeout(() => {
            headlineElement.textContent = headline;
            subtextElement.textContent = subtext;
            headlineElement.style.opacity = 1;
            subtextElement.style.opacity = 1;
        }, 500); // Match CSS transition for opacity if any
    }
    currentIndex = (currentIndex + 1) % bannerTexts.length;
}
// if (bannerTexts.length > 0) {
//     setInterval(updateBannerText, 7000);
//     updateBannerText(); // Initial call
// }
*/

// Typing animation settings
const typingSpeed = 60;
const erasingSpeed = 10;
const newTextDelay = 3000;

// Store timeout IDs globally to clear them on re-initialization
let typingTimeout1;
let erasingTimeout1;
let typingTimeout2;
let erasingTimeout2;

let currentTypewriterInstance1 = null;
let currentTypewriterInstance2 = null;


// Global functions for typing animation (if not using Typewriter.js)
function type(element, texts, index = 0, charIndex = 0, timeoutVar) {
    if (charIndex < texts[index].length) {
        element.textContent += texts[index].charAt(charIndex);
        charIndex++;
        // Store timeout ID
        if (element.id === 'typing-text') typingTimeout1 = setTimeout(() => type(element, texts, index, charIndex, typingTimeout1), typingSpeed);
        else if (element.id === 'typing-text-2') typingTimeout2 = setTimeout(() => type(element, texts, index, charIndex, typingTimeout2), typingSpeed);
    } else {
        // Store timeout ID
        if (element.id === 'typing-text') erasingTimeout1 = setTimeout(() => erase(element, texts, index, charIndex, erasingTimeout1), newTextDelay);
        else if (element.id === 'typing-text-2') erasingTimeout2 = setTimeout(() => erase(element, texts, index, charIndex, erasingTimeout2), newTextDelay);
    }
}

function erase(element, texts, index, charIndex, timeoutVar) {
    if (charIndex > 0) {
        element.textContent = texts[index].substring(0, charIndex - 1);
        charIndex--;
        // Store timeout ID
        if (element.id === 'typing-text') erasingTimeout1 = setTimeout(() => erase(element, texts, index, charIndex, erasingTimeout1), erasingSpeed);
        else if (element.id === 'typing-text-2') erasingTimeout2 = setTimeout(() => erase(element, texts, index, charIndex, erasingTimeout2), erasingSpeed);
    } else {
        index = Math.floor(Math.random() * texts.length);
        // Store timeout ID
        if (element.id === 'typing-text') typingTimeout1 = setTimeout(() => type(element, texts, index, 0, typingTimeout1), typingSpeed);
        else if (element.id === 'typing-text-2') typingTimeout2 = setTimeout(() => type(element, texts, index, 0, typingTimeout2), typingSpeed);
    }
}

function initTypingAnimation(currentLang) {
    if (typeof translations === 'undefined' || !currentLang || !translations[currentLang]) {
        console.error("Translations or current language not available for typing animation. currentLang:", currentLang);
        return;
    }

    const currentTranslations = translations[currentLang];

    const textBlocks1_keys = ['home_typing_part1', 'home_typing_part2', 'home_typing_part3', 'home_typing_part4'];
    const textBlocks2_keys = ['section2_typing_part1', 'section2_typing_part2'];

    const textBlocks1 = textBlocks1_keys.map(key => currentTranslations[key] || `Missing: ${key}`).filter(text => text && text !== `Missing: ${key}`);
    const textBlocks2 = textBlocks2_keys.map(key => currentTranslations[key] || `Missing: ${key}`).filter(text => text && text !== `Missing: ${key}`);

    const typingTextElement1 = document.getElementById('typing-text');
    const typingTextElement2 = document.getElementById('typing-text-2');

    // Stop and clear previous animation for #typing-text
    clearTimeout(typingTimeout1);
    clearTimeout(erasingTimeout1);
    if (currentTypewriterInstance1 && typeof currentTypewriterInstance1.stop === 'function') {
        currentTypewriterInstance1.stop();
    }
    if (typingTextElement1) {
        typingTextElement1.innerHTML = '';
    }

    if (textBlocks1.length > 0 && typingTextElement1) {
        if (typeof Typewriter !== 'undefined') {
            currentTypewriterInstance1 = new Typewriter(typingTextElement1, {
                strings: textBlocks1,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50
            });
        } else {
            console.warn("Typewriter library not found, using fallback startTypingEffect for #typing-text.");
            const randomIndex1 = Math.floor(Math.random() * textBlocks1.length);
            typingTimeout1 = setTimeout(() => type(typingTextElement1, textBlocks1, randomIndex1, 0, typingTimeout1), newTextDelay / 2);
        }
    }

    // Stop and clear previous animation for #typing-text-2
    clearTimeout(typingTimeout2);
    clearTimeout(erasingTimeout2);
    if (currentTypewriterInstance2 && typeof currentTypewriterInstance2.stop === 'function') {
        currentTypewriterInstance2.stop();
    }
    if (typingTextElement2) {
        typingTextElement2.innerHTML = '';
    }

    if (textBlocks2.length > 0 && typingTextElement2) {
        if (typeof Typewriter !== 'undefined') {
            currentTypewriterInstance2 = new Typewriter(typingTextElement2, {
                strings: textBlocks2,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50
            });
        } else {
            console.warn("Typewriter library not found, using fallback startTypingEffect for #typing-text-2.");
            const randomIndex2 = Math.floor(Math.random() * textBlocks2.length);
            typingTimeout2 = setTimeout(() => type(typingTextElement2, textBlocks2, randomIndex2, 0, typingTimeout2), newTextDelay / 2);
        }
    }
}
// The original DOMContentLoaded listener that started the typing is removed.
// initTypingAnimation will be called from language_init.js when language is set/changed.
