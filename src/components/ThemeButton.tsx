import React from 'react';
import { Button } from 'react-bootstrap';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';

type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeButtonProps {
    className?: string;
    size?: 'sm' | 'lg';
    userPref: ThemePreference;
    cycleTheme: () => void;
}

function ThemeButton({ userPref, cycleTheme, className, size }: ThemeButtonProps): JSX.Element {

    const themeInfo = {
        auto: { icon: <BrightnessAutoIcon />, label: 'Auto Light/Dark Mode' },
        light: { icon: <LightModeIcon />, label: 'Light Mode' },
        dark: { icon: <DarkModeIcon />, label: 'Dark Mode' },
    };

    const { icon, label } = themeInfo[userPref];

    return (
        <Button aria-label={label} title={label + '. Click to toggle.'} className={className} size={size} onClick={cycleTheme} variant='outline-secondary'>
            {icon}
        </Button>
    );
}

export default ThemeButton;
