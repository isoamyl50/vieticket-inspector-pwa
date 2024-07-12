import {useEffect, useState} from 'react';

/**
 * Custom hook for managing dark mode preference.
 *
 * @returns An object containing the current dark mode state, a function to cycle through different themes, and the user preference.
 */
export const useThemes = () => {
    /**
     * Retrieves the user's preferred theme from local storage and sets it as the initial state.
     * If no preference is found, the default value is set to 'auto'.
     */
    const [userPref, setUserPref] = useState<'light' | 'dark' | 'auto'>(
        localStorage.getItem('themePref') as 'light' | 'dark' | 'auto' || 'auto'
    );
    /**
     * Represents the current dark mode state and provides a function to update it.
     */
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
        updateDarkModePreference();

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

    /**
     * Toggles between different theme preferences.
     */
    const cycleTheme = () => {
        if (userPref === 'auto') {
            setUserPref('light');
        } else if (userPref === 'light') {
            setUserPref('dark');
        } else {
            setUserPref('auto');
        }
    }

    return {darkMode, cycleTheme, userPref};
};