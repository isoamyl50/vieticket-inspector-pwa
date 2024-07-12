import React, {FormEvent, useEffect, useState} from 'react';
import {Alert, Button, ButtonGroup} from 'react-bootstrap';
import TicketDetailsCard, {TicketDetails} from './TicketDetailsCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeButton from '../ThemeButton';
import QrReader from './QrReader';

import './CheckIn.css'
import TicketInputForm from './TicketInputForm';
import Branding from '../Branding';
import {CameraswitchOutlined, LogoutOutlined} from '@mui/icons-material';

interface CheckInProps {
    onQrScan: (qrCode: string) => void;
    ticketDetails: TicketDetails | null;
    error: string | null;
    isLoading: boolean;
    onManualSubmit: (qrCode: string) => void;
    qrScanned: boolean;
    handleScanAnother: () => void;
    onLogout: () => void;
    userPref: 'light' | 'dark' | 'auto';
    cycleTheme: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({
                                             onQrScan,
                                             ticketDetails,
                                             error,
                                             isLoading,
                                             onManualSubmit,
                                             qrScanned,
                                             handleScanAnother,
                                             onLogout,
                                             userPref,
                                             cycleTheme
                                         }) => {

    const [qrCode, setQrCode] = useState('');
    const [cameraOrientation, setCameraOrientation] = useState<'environment' | 'user'>('environment');

    const handleLogout = () => {
        onLogout();
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (qrCode) {
            onManualSubmit(qrCode);
            setQrCode('');
        }
    }

    const changeCameraOrientation = () => {
        setCameraOrientation(cameraOrientation === 'environment' ? 'user' : 'environment');
    }

    // Function to adjust the main element's height
    const adjustMainHeight = () => {
        const header = document.querySelector('header');
        const main = document.querySelector('main');
        const parentContainer = document.querySelector('.container'); // Select the parent container

        if (header && main && parentContainer) {
            const headerHeight = header.offsetHeight;
            // Get computed styles of the header
            const headerStyle = window.getComputedStyle(header);
            // Get computed styles of the parent container
            const containerStyle = window.getComputedStyle(parentContainer);

            // Extract margins and paddings, remove 'px', and convert to numbers
            const headerMargins = parseInt(headerStyle.marginBottom, 10) + parseInt(headerStyle.marginTop, 10);
            const containerPaddings = parseInt(containerStyle.paddingTop, 10) + parseInt(containerStyle.paddingBottom, 10);

            // Include the bottom margin and container paddings in the calculation
            main.style.minHeight = `calc(99dvh - ${headerHeight + headerMargins + containerPaddings}px)`;
        }
    };

    // useEffect hook to run the adjustMainHeight function on component mount and window resize
    useEffect(() => {
        adjustMainHeight();
        window.addEventListener('resize', adjustMainHeight);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener('resize', adjustMainHeight);
    }, []);

    return (
        <div>
            <header className='d-flex justify-content-between align-items-center mb-3'>
                <Branding/>
                <ButtonGroup size='sm' className='text-end'>
                    <Button aria-label={'Change camera orientation'} title={'Change camera orientation'} variant={'outline-secondary'} onClick={changeCameraOrientation} >
                        <CameraswitchOutlined/>
                    </Button>
                    <ThemeButton userPref={userPref} cycleTheme={cycleTheme}/>
                    <Button aria-label='Log Out' title='Log Out' variant='outline-secondary' className='btn-logout'
                            onClick={handleLogout} style={{color: 'var(--bs-danger)'}}><LogoutOutlined/></Button>
                </ButtonGroup>
            </header>

            <main onClick={qrScanned ? handleScanAnother : undefined} style={{minHeight: '100dvh'}}>
                <div className='row g-4'>
                    <div className='col-lg-6'>
                        {qrScanned ? (
                            <Alert variant='info' className='mt-0 mb-0'>Press <strong>Space</strong> or tap screen to
                                validate another ticket.</Alert>
                        ) : (
                            <>
                                <QrReader onScan={onQrScan} cameraOrientation={cameraOrientation} />
                                <br/>
                                <TicketInputForm qrCode={qrCode} setQrCode={setQrCode} handleSubmit={handleSubmit}/>
                            </>
                        )}
                    </div>
                    <div className='col-lg-6'>
                        <TicketDetailsCard ticketDetails={ticketDetails} isLoading={isLoading} error={error}/>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckIn;
