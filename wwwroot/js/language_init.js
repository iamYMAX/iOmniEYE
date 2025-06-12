// language_init.js (with console.log statements)
document.addEventListener('DOMContentLoaded', () => {
    console.log('[LANG_INIT] DOMContentLoaded');

    const banner = document.getElementById('banner');
    const bannerLangButtons = document.querySelectorAll('.banner-language-buttons .language-button');
    const headerLangSwitcher = document.getElementById('headerLanguageSwitcher');
    const languagePreferenceToken = 'languagePreference';
    const defaultLanguage = 'ru';

    console.log('[LANG_INIT] Banner element:', banner);
    console.log('[LANG_INIT] Banner lang buttons:', bannerLangButtons.length);
    console.log('[LANG_INIT] Header lang switcher:', headerLangSwitcher);

    if (typeof translations === 'undefined') {
        console.error('[LANG_INIT] CRITICAL: Translations object not found. Make sure translations.js is loaded before language_init.js.');
        return;
    } else {
        console.log('[LANG_INIT] Translations object found.');
    }

    function updateHeaderLangButtonStates(currentLang) {
        console.log(`[LANG_INIT] updateHeaderLangButtonStates called with: ${currentLang}`);
        if (headerLangSwitcher) {
            const buttons = headerLangSwitcher.querySelectorAll('.language-button-header');
            buttons.forEach(button => {
                if (button.getAttribute('data-lang') === currentLang) {
                    button.classList.add('active-lang');
                } else {
                    button.classList.remove('active-lang');
                }
            });
        } else {
            console.warn('[LANG_INIT] Header language switcher not found for updating button states.');
        }
    }

    function applyTranslations(lang) {
        console.log(`[LANG_INIT] applyTranslations called with: ${lang}`);
        const targetLang = translations[lang] ? lang : defaultLanguage;
        if (lang !== targetLang) {
            console.warn(`[LANG_INIT] Language "${lang}" not found in translations, falling back to default "${targetLang}".`);
        }

        if (!translations[targetLang]) {
            console.error(`[LANG_INIT] CRITICAL: Translations for language "${targetLang}" (resolved) not found.`);
            return;
        }

        console.log(`[LANG_INIT] Applying translations for language: ${targetLang}`);
        let translatedCount = 0;
        document.querySelectorAll('[data-translate-key]').forEach(element => {
            const key = element.getAttribute('data-translate-key');
            const translatedText = translations[targetLang][key];
            if (translatedText !== undefined) {
                element.textContent = translatedText;
                translatedCount++;
                // console.log(`[LANG_INIT] Translated key "${key}" to: "${translatedText.substring(0, 30)}..."`);
            } else {
                console.warn(`[LANG_INIT] Translation key "${key}" not found for language "${targetLang}". Element content: "${element.textContent.trim().substring(0,30)}..."`);
            }
        });
        console.log(`[LANG_INIT] Total elements processed for translation: ${translatedCount}`);

        updateHeaderLangButtonStates(targetLang);

        console.log('[LANG_INIT] Attempting to call initTypingAnimation...');
        if (typeof initTypingAnimation === 'function') {
            initTypingAnimation(targetLang);
            console.log(`[LANG_INIT] initTypingAnimation called with: ${targetLang}`);
        } else {
            console.warn('[LANG_INIT] initTypingAnimation function not found.');
        }
    }

    function setLanguageAndApply(lang) {
        console.log(`[LANG_INIT] setLanguageAndApply called with: ${lang}`);
        localStorage.setItem(languagePreferenceToken, lang);
        if (banner) {
            banner.classList.remove('banner-fullscreen');
            banner.classList.add('banner-language-selected');
            console.log('[LANG_INIT] Banner state updated to language-selected.');
        }
        applyTranslations(lang);
    }

    // --- Initial Load Logic ---
    console.log('[LANG_INIT] Starting initial load logic.');
    let currentSelectedLang = localStorage.getItem(languagePreferenceToken);
    console.log(`[LANG_INIT] Language from localStorage: ${currentSelectedLang}`);

    if (!currentSelectedLang || !translations[currentSelectedLang]) {
        if (currentSelectedLang && !translations[currentSelectedLang]) {
            console.warn(`[LANG_INIT] Saved language "${currentSelectedLang}" is invalid or has no translations. Falling back to default.`);
        }
        currentSelectedLang = defaultLanguage;
        console.log(`[LANG_INIT] currentSelectedLang set to default: ${currentSelectedLang}`);
    }

    if (banner) {
        const langIsInitiallySet = !!localStorage.getItem(languagePreferenceToken); // Check if it was explicitly set before
        console.log(`[LANG_INIT] Language was initially set in localStorage: ${langIsInitiallySet}`);
        if (langIsInitiallySet && translations[localStorage.getItem(languagePreferenceToken)]) { // Ensure the stored lang is valid before setting banner
            banner.classList.remove('banner-fullscreen');
            banner.classList.add('banner-language-selected');
            console.log('[LANG_INIT] Banner set to language-selected state (not fullscreen).');
        } else {
            banner.classList.add('banner-fullscreen');
            banner.classList.remove('banner-language-selected');
            console.log('[LANG_INIT] Banner set to fullscreen state.');
        }
    } else {
        console.log('[LANG_INIT] Banner element not found on this page.');
    }

    console.log(`[LANG_INIT] Applying initial translations for: ${currentSelectedLang}`);
    applyTranslations(currentSelectedLang);

    // Event listeners for language buttons on the BANNER
    if (bannerLangButtons.length > 0) {
        bannerLangButtons.forEach(button => {
            button.addEventListener('click', () => {
                const lang = button.getAttribute('data-lang');
                console.log(`[LANG_INIT] Banner language button clicked. Selected lang: ${lang}`);
                if (lang) {
                    setLanguageAndApply(lang);
                } else {
                    console.error('[LANG_INIT] Banner language button missing data-lang attribute.');
                }
            });
        });
    } else if (banner) { // Only warn if banner exists but buttons weren't found
        console.warn('[LANG_INIT] Banner language buttons not found.');
    }

    // Event listeners for language buttons in the HEADER
    if (headerLangSwitcher) {
        const headerButtons = headerLangSwitcher.querySelectorAll('.language-button-header');
        if (headerButtons.length > 0) {
            headerButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const lang = event.currentTarget.getAttribute('data-lang');
                    console.log(`[LANG_INIT] Header language button clicked. Selected lang: ${lang}`);
                    if (lang) {
                        localStorage.setItem(languagePreferenceToken, lang); // Set preference first
                        applyTranslations(lang); // Then apply
                    } else {
                        console.error('[LANG_INIT] Header language button missing data-lang attribute.');
                    }
                });
            });
        } else {
            console.warn('[LANG_INIT] Header language buttons (.language-button-header) not found inside #headerLanguageSwitcher.');
        }
    } else {
        // console.log('[LANG_INIT] Header language switcher element not found on this page.'); // This might be normal for layouts without it.
    }
    console.log('[LANG_INIT] Event listeners set up.');
});
