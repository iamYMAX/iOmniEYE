document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherButton = document.getElementById('themeSwitcherButton');
    const body = document.body;
    const currentThemeKey = 'themePreference';

    // Function to apply the theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('theme-dark');
            if (themeSwitcherButton) themeSwitcherButton.textContent = 'Switch to Light Mode';
        } else {
            body.classList.remove('theme-dark');
            if (themeSwitcherButton) themeSwitcherButton.textContent = 'Switch to Dark Mode';
        }
    }

    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem(currentThemeKey);
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        // Default to light theme if no preference or if system prefers light
        // Optionally, you could check for system preference here:
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // applyTheme('dark');
        // } else {
        applyTheme('light'); // Default to light
        // }
    }

    // Event listener for the button
    if (themeSwitcherButton) {
        themeSwitcherButton.addEventListener('click', () => {
            let newTheme;
            if (body.classList.contains('theme-dark')) {
                newTheme = 'light';
            } else {
                newTheme = 'dark';
            }
            applyTheme(newTheme);
            localStorage.setItem(currentThemeKey, newTheme);
        });
    }
});
