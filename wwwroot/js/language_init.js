// language_init.js (Full proposed content)
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('banner');
    const bannerLangButtons = document.querySelectorAll('.banner-language-buttons .language-button');
    const headerLangSwitcher = document.getElementById('headerLanguageSwitcher'); // Get the container
    const languagePreferenceToken = 'languagePreference';
    const defaultLanguage = 'ru';

    if (typeof translations === 'undefined') {
        console.error('Translations object not found. Make sure translations.js is loaded before language_init.js.');
        return;
    }

    function updateHeaderLangButtonStates(currentLang) {
        if (headerLangSwitcher) { // Check if the header switcher exists on the page
            const buttons = headerLangSwitcher.querySelectorAll('.language-button-header');
            buttons.forEach(button => {
                if (button.getAttribute('data-lang') === currentLang) {
                    button.classList.add('active-lang');
                } else {
                    button.classList.remove('active-lang');
                }
            });
        }
    }

    function applyTranslations(lang) {
        const targetLang = translations[lang] ? lang : defaultLanguage;
        if (!translations[targetLang]) {
            console.error(`Translations for language "${targetLang}" not found.`);
            return;
        }

        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translatedText = translations[targetLang][key];
            if (translatedText !== undefined) {
                element.textContent = translatedText;
            } else {
                console.warn(`Translation key "${key}" not found for language "${targetLang}".`);
            }
        });
        updateHeaderLangButtonStates(targetLang);
        if (typeof initTypingAnimation === 'function') {
            initTypingAnimation(targetLang);
        }
    }

    function setLanguageAndApply(lang) {
        localStorage.setItem(languagePreferenceToken, lang);
        if (banner) {
            banner.classList.remove('banner-fullscreen');
            banner.classList.add('banner-language-selected');
        }
        applyTranslations(lang);
        console.log('Language selected:', lang);
    }

    // --- Initial Load Logic ---
    let currentSelectedLang = localStorage.getItem(languagePreferenceToken);
    if (!currentSelectedLang || !translations[currentSelectedLang]) { // Also check if saved lang is valid
        currentSelectedLang = defaultLanguage;
    }

    if (banner) { // Banner logic only if banner element exists
        const langIsInitiallySet = !!localStorage.getItem(languagePreferenceToken); // Check if it was explicitly set before
        if (langIsInitiallySet) {
            banner.classList.remove('banner-fullscreen');
            banner.classList.add('banner-language-selected');
        } else {
            banner.classList.add('banner-fullscreen');
            banner.classList.remove('banner-language-selected');
        }
    }
    applyTranslations(currentSelectedLang); // Apply translations on load

    // Event listeners for language buttons on the BANNER
    bannerLangButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguageAndApply(lang);
        });
    });

    // Event listeners for language buttons in the HEADER
    if (headerLangSwitcher) {
        const headerButtons = headerLangSwitcher.querySelectorAll('.language-button-header');
        headerButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const lang = event.currentTarget.getAttribute('data-lang');
                if (lang) {
                    localStorage.setItem(languagePreferenceToken, lang);
                    applyTranslations(lang); // This will also update button states
                }
            });
        });
    }
});
