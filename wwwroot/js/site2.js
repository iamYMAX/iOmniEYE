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
    if (index >= texts.length) { // Safety check
        console.warn("[SITE2_TYPING] Fallback 'type': index out of bounds for texts array. Texts:", texts);
        return;
    }
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
    console.log(`[SITE2_TYPING] initTypingAnimation called with currentLang: ${currentLang}`);

    if (typeof translations === 'undefined' || !currentLang || !translations[currentLang]) {
        console.error(`[SITE2_TYPING] CRITICAL: Translations or current language not available. currentLang: ${currentLang}, translations available: ${typeof translations !== 'undefined'}`);
        return;
    }
    console.log(`[SITE2_TYPING] Translations object seems available for lang: ${currentLang}`);

    const currentTranslations = translations[currentLang];

    const textBlocks1_keys = ['home_typing_part1', 'home_typing_part2', 'home_typing_part3', 'home_typing_part4'];
    const textBlocks2_keys = ['section2_typing_part1', 'section2_typing_part2'];

    const textBlocks1 = textBlocks1_keys.map(key => currentTranslations[key] || `[${key} MISSING]`).filter(text => text && !text.includes("MISSING"));
    const textBlocks2 = textBlocks2_keys.map(key => currentTranslations[key] || `[${key} MISSING]`).filter(text => text && !text.includes("MISSING"));

    console.log('[SITE2_TYPING] textBlocks1 (for #typing-text):', JSON.stringify(textBlocks1));
    console.log('[SITE2_TYPING] textBlocks2 (for #typing-text-2):', JSON.stringify(textBlocks2));

    const typingTextElement1 = document.getElementById('typing-text');
    const typingTextElement2 = document.getElementById('typing-text-2');

    console.log('[SITE2_TYPING] typingTextElement1 (for #typing-text):', typingTextElement1);
    console.log('[SITE2_TYPING] typingTextElement2 (for #typing-text-2):', typingTextElement2);

    // --- Stop and clear previous animation for #typing-text ---
    console.log('[SITE2_TYPING] Clearing previous animation for #typing-text.');
    if (typingTimeout1) clearTimeout(typingTimeout1);
    if (erasingTimeout1) clearTimeout(erasingTimeout1);
    if (currentTypewriterInstance1 && typeof currentTypewriterInstance1.stop === 'function') {
        console.log('[SITE2_TYPING] Stopping currentTypewriterInstance1.');
        currentTypewriterInstance1.stop();
    }
    if (typingTextElement1) {
        typingTextElement1.innerHTML = '';
        console.log('[SITE2_TYPING] #typing-text innerHTML cleared.');
    }

    if (textBlocks1.length > 0 && typingTextElement1) {
        console.log('[SITE2_TYPING] Attempting to start animation for #typing-text.');
        if (typeof Typewriter !== 'undefined') {
            console.log('[SITE2_TYPING] Using Typewriter.js for #typing-text.');
            currentTypewriterInstance1 = new Typewriter(typingTextElement1, {
                strings: textBlocks1,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50
            });
        } else if (typeof type === 'function' && typeof erase === 'function') { // Check if custom functions are defined
            console.warn("[SITE2_TYPING] Typewriter library not found. Using fallback custom typing effect for #typing-text.");
            const randomIndex1 = Math.floor(Math.random() * textBlocks1.length);
            // Pass timeout variable names as strings to be managed globally if necessary, or manage them internally
            typingTimeout1 = setTimeout(() => type(typingTextElement1, textBlocks1, randomIndex1, 0, 'typingTimeout1'), newTextDelay / 2);
        } else {
            console.error('[SITE2_TYPING] No typing animation method found for #typing-text.');
        }
    } else {
        console.warn('[SITE2_TYPING] No textBlocks or element for #typing-text animation.');
        if (typingTextElement1) typingTextElement1.innerHTML = ''; // Ensure it's cleared if no text
    }

    // --- Stop and clear previous animation for #typing-text-2 ---
    console.log('[SITE2_TYPING] Clearing previous animation for #typing-text-2.');
    if (typingTimeout2) clearTimeout(typingTimeout2);
    if (erasingTimeout2) clearTimeout(erasingTimeout2);
    if (currentTypewriterInstance2 && typeof currentTypewriterInstance2.stop === 'function') {
        console.log('[SITE2_TYPING] Stopping currentTypewriterInstance2.');
        currentTypewriterInstance2.stop();
    }
    if (typingTextElement2) {
        typingTextElement2.innerHTML = '';
        console.log('[SITE2_TYPING] #typing-text-2 innerHTML cleared.');
    }

    if (textBlocks2.length > 0 && typingTextElement2) {
        console.log('[SITE2_TYPING] Attempting to start animation for #typing-text-2.');
        if (typeof Typewriter !== 'undefined') {
            console.log('[SITE2_TYPING] Using Typewriter.js for #typing-text-2.');
            currentTypewriterInstance2 = new Typewriter(typingTextElement2, {
                strings: textBlocks2,
                autoStart: true,
                loop: true,
                delay: 75,
                deleteSpeed: 50
            });
        } else if (typeof type === 'function' && typeof erase === 'function') { // Check if custom functions are defined
            console.warn("[SITE2_TYPING] Typewriter library not found. Using fallback custom typing effect for #typing-text-2.");
            const randomIndex2 = Math.floor(Math.random() * textBlocks2.length);
            typingTimeout2 = setTimeout(() => type(typingTextElement2, textBlocks2, randomIndex2, 0, 'typingTimeout2'), newTextDelay / 2);
        } else {
            console.error('[SITE2_TYPING] No typing animation method found for #typing-text-2.');
        }
    } else {
        console.warn('[SITE2_TYPING] No textBlocks or element for #typing-text-2 animation.');
        if (typingTextElement2) typingTextElement2.innerHTML = ''; // Ensure it's cleared if no text
    }
}
// The original DOMContentLoaded listener that started the typing is removed.
// initTypingAnimation will be called from language_init.js when language is set/changed.
