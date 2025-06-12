// language_init.js (Modified)
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('banner');
    const bannerLangButtons = document.querySelectorAll('.banner-language-buttons .language-button');
    const headerLangButtons = document.querySelectorAll('#headerLanguageSwitcher .language-button'); // For header switcher
    const languagePreferenceToken = 'languagePreference';
    const defaultLanguage = 'ru'; // Default language if nothing is set

    // Ensure translations object is available
    if (typeof translations === 'undefined') {
        console.error('Translations object not found. Make sure translations.js is loaded before language_init.js.');
        return;
    }

    function applyTranslations(lang) {
        if (!translations[lang]) {
            console.warn(`Language ${lang} not found in translations. Defaulting to ${defaultLanguage}.`);
            lang = defaultLanguage;
        }
        if (!translations[lang]) { // Still no translations for default?
             console.error(`Default language ${defaultLanguage} also not found in translations.`);
             return;
        }

        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translatedText = translations[lang][key];
            if (translatedText !== undefined) {
                // Preserve child elements if only text nodes should be replaced (e.g. if a link is inside a p)
                // For simplicity now, using textContent. If HTML is needed in translations, use innerHTML carefully.
                element.textContent = translatedText;
            } else {
                console.warn(`Translation key "${key}" not found for language "${lang}".`);
            }
        });

        // Update text for language buttons on banner if they are part of translation
        // (already done by key if they have data-translate-key)

        // Update text for language buttons in header (if they also use keys)
        // Or update their active state
        updateHeaderLangButtonStates(lang);

        // Special handling for typing animation (trigger re-initialization or update)
        if (typeof initTypingAnimation === 'function') {
            initTypingAnimation(lang); // Pass current language to typing animation
        }
    }

    function updateHeaderLangButtonStates(currentLang) {
        headerLangButtons.forEach(button => {
            if (button.getAttribute('data-lang') === currentLang) {
                button.classList.add('active-lang'); // Add an 'active' class
            } else {
                button.classList.remove('active-lang');
            }
        });
    }

    function setLanguage(lang) {
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

    if (currentSelectedLang) {
        if (banner) { // If returning user, banner might not need to be fullscreen
            banner.classList.remove('banner-fullscreen');
            banner.classList.add('banner-language-selected');
        }
        applyTranslations(currentSelectedLang);
    } else {
        // Language not set, ensure banner is fullscreen (if banner exists)
        if (banner) {
            banner.classList.add('banner-fullscreen');
            banner.classList.remove('banner-language-selected'); // Ensure this is not present
        }
        // Apply default language text to the page even before selection on banner
        applyTranslations(defaultLanguage);
        currentSelectedLang = defaultLanguage; // Set for header button state
    }
    updateHeaderLangButtonStates(currentSelectedLang);


    // Event listeners for language buttons on the BANNER
    bannerLangButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            setLanguage(lang);
        });
    });

    // Event listeners for language buttons in the HEADER
    headerLangButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            // We don't need to change banner state here, just apply translations
            localStorage.setItem(languagePreferenceToken, lang);
            applyTranslations(lang);
        });
    });
});
