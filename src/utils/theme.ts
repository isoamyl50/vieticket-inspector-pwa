import { useEffect, useState } from 'react';

export const useDarkMode = () => {
    // Initialize userPref state with value from localStorage if available, otherwise 'auto'
    const [userPref, setUserPref] = useState<'light' | 'dark' | 'auto'>(
        localStorage.getItem('themePref') as 'light' | 'dark' | 'auto' || 'auto'
    );
    const [darkMode, setDarkMode] = useState<boolean>(true);

    useEffect(() => {
        const updateDarkModePreference = () => {
            const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (userPref === 'auto') {
                setDarkMode(systemPrefersDark);
            } else {
                setDarkMode(userPref === 'dark');
            }
        };

        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQueryList.addEventListener('change', updateDarkModePreference);
        updateDarkModePreference(); // Call it to set initial state based on user preference or system preference

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (darkMode) {
            document.documentElement.setAttribute('data-bs-theme', 'dark');
            metaThemeColor?.setAttribute('content', '#212529');
        } else {
            document.documentElement.removeAttribute('data-bs-theme');
            metaThemeColor?.setAttribute('content', '#ffffff');
        }

        return () => {
            mediaQueryList.removeEventListener('change', updateDarkModePreference);
        };
    }, [darkMode, userPref]);

    useEffect(() => {
        // Save userPref to localStorage whenever it changes
        localStorage.setItem('themePref', userPref);
    }, [userPref]);

    const cycleTheme = () => {
        if (userPref === 'auto') {
            setUserPref('light');
        } else if (userPref === 'light') {
            setUserPref('dark');
        } else {
            setUserPref('auto');
        }
    }

    return { darkMode, cycleTheme, userPref };
};