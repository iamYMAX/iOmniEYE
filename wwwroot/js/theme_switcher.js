document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeSwitcherInput');
    const body = document.body;
    const currentThemeKey = 'themePreference';

    // Function to set the theme based on string and update toggle
    function setTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('theme-dark');
            if (themeToggle) themeToggle.checked = true;
        } else {
            body.classList.remove('theme-dark');
            if (themeToggle) themeToggle.checked = false;
        }
    }

    // Load saved theme or use system preference
    let initialTheme = localStorage.getItem(currentThemeKey);
    if (!initialTheme) {
        initialTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(initialTheme);

    // Event listener for the toggle change
    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'dark' : 'light';
            // The setTheme function will handle body class and keep toggle state consistent
            // This might be redundant if the click itself changes themeToggle.checked already.
            // However, ensuring body class matches is key.
            if (newTheme === 'dark') {
                 body.classList.add('theme-dark');
            } else {
                 body.classList.remove('theme-dark');
            }
            localStorage.setItem(currentThemeKey, newTheme);
        });
    }
});
