import React from 'react';
import { Button } from 'react-bootstrap';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkMOdeIcon from '@mui/icons-material/DarkMode';
import BrightnessAutoIcon from '@mui/icons-material/BrightnessAuto';

type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeButtonProps {
    className?: string;
    userPref: ThemePreference;
    cycleTheme: () => void;
}

function ThemeButton({ userPref, cycleTheme, className }: ThemeButtonProps): JSX.Element {
    const buttonVariant = {
        auto: 'outline-secondary',
        light: 'outline-dark',
        dark: 'outline-light',
    }[userPref] as string;

    const buttonIcon = {
        auto: <BrightnessAutoIcon aria-label='Auto Light/Dark Mode' />,
        light: <LightModeIcon aria-label='Light Mode' />,
        dark: <DarkMOdeIcon aria-label='Dark Mode' />,
    }[userPref];

    return (
        <Button aria-label='Toggle Light/Dark Mode' title='Toggle Light/Dark Mode' className={className} onClick={cycleTheme} variant={buttonVariant}>
            {buttonIcon}
        </Button>
    );
}

export default ThemeButton;
