// language_init.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('[LANG_INIT] DOMContentLoaded');

    const banner = document.getElementById('banner');
    const bannerLangButtons = document.querySelectorAll('.banner-language-buttons .language-button');
    //MODIFIED: Get the new segmented control
    const languageSwitcherControl = document.getElementById('languageSegmentedControl');
    const languagePreferenceToken = 'languagePreference';
    const defaultLanguage = 'ru';

    console.log('[LANG_INIT] Banner element:', banner);
    console.log('[LANG_INIT] Banner lang buttons:', bannerLangButtons.length);
    //MODIFIED: Log the new control
    console.log('[LANG_INIT] Language Segmented Control:', languageSwitcherControl);

    if (typeof translations === 'undefined') {
        console.error('[LANG_INIT] CRITICAL: Translations object not found. Make sure translations.js is loaded before language_init.js.');
        return;
    } else {
        console.log('[LANG_INIT] Translations object found.');
    }

    //MODIFIED: updateHeaderLangButtonStates function to work with segmented control
    function updateLanguageSwitcherState(currentLang) {
        console.log(`[LANG_INIT] updateLanguageSwitcherState called with: ${currentLang}`);
        if (languageSwitcherControl) {
            const buttons = languageSwitcherControl.querySelectorAll('.segment-button');
            buttons.forEach(button => {
                if (button.getAttribute('data-lang') === currentLang) {
                    button.classList.add('active');
                    button.setAttribute('aria-pressed', 'true');
                } else {
                    button.classList.remove('active');
                    button.setAttribute('aria-pressed', 'false');
                }
            });
        } else {
            // This console message might appear on pages that don't use _Layout2.cshtml
            // console.warn('[LANG_INIT] Language Segmented Control not found for updating button states.');
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
            } else {
                console.warn(`[LANG_INIT] Translation key "${key}" not found for language "${targetLang}". Element content: "${element.textContent.trim().substring(0,30)}..."`);
            }
        });
        console.log(`[LANG_INIT] Total elements processed for translation: ${translatedCount}`);

        //MODIFIED: Call the updated state function
        updateLanguageSwitcherState(targetLang);

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
        const langIsInitiallySet = !!localStorage.getItem(languagePreferenceToken);
        console.log(`[LANG_INIT] Language was initially set in localStorage: ${langIsInitiallySet}`);
        if (langIsInitiallySet && translations[localStorage.getItem(languagePreferenceToken)]) {
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

    // Event listeners for language buttons on the BANNER (remains unchanged)
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
    } else if (banner) {
        console.warn('[LANG_INIT] Banner language buttons not found.');
    }

    // MODIFIED: Event listeners for new language segmented control in the HEADER
    if (languageSwitcherControl) {
        const headerButtons = languageSwitcherControl.querySelectorAll('.segment-button');
        if (headerButtons.length > 0) {
            headerButtons.forEach(button => {
                button.addEventListener('click', (event) => {
                    const lang = event.currentTarget.getAttribute('data-lang');
                    console.log(`[LANG_INIT] Header language segment clicked. Selected lang: ${lang}`);
                    if (lang) {
                        localStorage.setItem(languagePreferenceToken, lang); // Set preference first
                        applyTranslations(lang); // Then apply (this will also update the active state)
                    } else {
                        console.error('[LANG_INIT] Header language segment missing data-lang attribute.');
                    }
                });
            });
        } else {
            console.warn('[LANG_INIT] Header language segments (.segment-button) not found inside #languageSegmentedControl.');
        }
    } else {
        // console.log('[LANG_INIT] Language Segmented Control element not found on this page.');
    }
    console.log('[LANG_INIT] Event listeners set up.');
});
