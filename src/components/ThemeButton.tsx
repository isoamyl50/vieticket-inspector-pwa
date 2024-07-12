import React from 'react';
import {Button} from 'react-bootstrap';
import {BrightnessAutoOutlined, DarkModeOutlined, LightModeOutlined} from '@mui/icons-material';

type ThemePreference = 'auto' | 'light' | 'dark';

interface ThemeButtonProps {
    className?: string;
    size?: 'sm' | 'lg';
    userPref: ThemePreference;
    cycleTheme: () => void;
}

const ThemeButton: React.FC<ThemeButtonProps> = ({userPref, cycleTheme, className, size}) => {

    const themeInfo = {
        auto: {icon: <BrightnessAutoOutlined/>, label: 'Auto Light/Dark Mode'},
        light: {icon: <LightModeOutlined/>, label: 'Light Mode'},
        dark: {icon: <DarkModeOutlined/>, label: 'Dark Mode'},
    };

    const {icon, label} = themeInfo[userPref];

    return (
        <Button aria-label={label} title={label + '. Click to toggle.'} className={className} size={size}
                onClick={cycleTheme} variant='outline-secondary'>
            {icon}
        </Button>
    );
}

export default ThemeButton;
