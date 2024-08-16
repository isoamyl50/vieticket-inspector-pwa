import React, { FormEvent, useEffect, useState } from 'react';
import { Alert, Button, ButtonGroup, CloseButton } from 'react-bootstrap';
import TicketDetailsCard, { TicketDetails } from './TicketDetailsCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeButton from '../ThemeButton';
import QrReader from './QrReader';

import './CheckIn.css'
import TicketInputForm from './TicketInputForm';
import Branding from '../Branding';
import { GitHub } from '@mui/icons-material';

interface CheckInProps {
    onQrScan: (qrCode: string) => void;
    ticketDetails: TicketDetails | null;
    error: string | null;
    isLoading: boolean;
    onManualSubmit: (qrCode: string) => void;
    qrScanned: boolean;
    handleScanAnother: () => void;
    userPref: 'light' | 'dark' | 'auto';
    cycleTheme: () => void;
    clearPreviousTicket?: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({
    onQrScan,
    ticketDetails,
    error,
    isLoading,
    onManualSubmit,
    qrScanned,
    handleScanAnother,
    userPref,
    cycleTheme,
    clearPreviousTicket
}) => {

    const [qrCode, setQrCode] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (qrCode) {
            onManualSubmit(qrCode);
            setQrCode('');
        }
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
        <>
            <header className='d-flex justify-content-between align-items-center mb-3'>
                <Branding />
                <ButtonGroup size='sm' className='text-end'>
                    <ThemeButton userPref={userPref} cycleTheme={cycleTheme} />
                    <Button variant='outline-secondary' aria-label='Check out the GitHub Repository'
                        title='Check out the GitHub Repository'
                        href='https://github.com/isoamyl50/vieticket-inspector-pwa' target='_blank'
                        rel='noopener noreferrer'><GitHub /></Button>
                </ButtonGroup>
            </header>

            <main onClick={qrScanned ? handleScanAnother : undefined} style={{ minHeight: '100dvh' }}>
                <div className='row g-4'>
                    <div className='col-lg-6'>
                        {qrScanned ? (
                            <Alert variant='info' className='mt-0 mb-0'>Press <strong>Space</strong> or tap screen to
                                validate another ticket.</Alert>
                        ) : (
                            <>
                                <QrReader onScan={onQrScan} />
                                <br />
                                <TicketInputForm qrCode={qrCode} setQrCode={setQrCode} handleSubmit={handleSubmit} />
                            </>
                        )}
                    </div>
                    <div className='col-lg-6'>
                        {!qrScanned && (ticketDetails || error) && (
                            <div className='d-flex align-items-center mt-3 mt-lg-0 mb-3'>
                                <CloseButton aria-label='Hide' title='Hide' className='mb-0 mt-0' onClick={clearPreviousTicket} variant='danger' />
                                <h3 className='text-muted mb-0 mt-0 ms-2'>Previous Ticket</h3>
                            </div>
                        )}
                        <TicketDetailsCard ticketDetails={ticketDetails} qrScanned={qrScanned} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </main>
        </>
    );
};

export default CheckIn;
