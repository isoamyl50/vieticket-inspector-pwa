import React, { FormEvent, useState, useEffect } from 'react';
import { Button, Alert, ButtonGroup } from 'react-bootstrap';
import TicketDetailsCard, { TicketDetails } from './TicketDetailsCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeButton from './ThemeButton';
import QrReader from './QrReader';

import './CheckIn.css'
import TicketInputForm from './TicketInputForm';

interface CheckInProps {
    onQrScan: (qrCode: string) => void;
    ticketDetails: TicketDetails | null;
    error: string | null;
    isLoading: boolean;
    onManualSubmit: (qrCode: string) => void;
    qrScanned: boolean;
    setQrScanned: React.Dispatch<React.SetStateAction<boolean>>;
    handleScanAnother: () => void;
    onLogout: () => void;
    userPref: 'light' | 'dark' | 'auto';
    cycleTheme: () => void;
}

const CheckIn: React.FC<CheckInProps> = ({ onQrScan, ticketDetails, error, isLoading, onManualSubmit, qrScanned, setQrScanned, handleScanAnother, onLogout, userPref, cycleTheme }) => {
    const [qrCode, setQrCode] = useState('');

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

    // Function to adjust the main element's height
    const adjustMainHeight = () => {
        const header = document.querySelector("header");
        const main = document.querySelector("main");
        const parentContainer = document.querySelector(".container"); // Select the parent container

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
            main.style.minHeight = `calc(99vh - ${headerHeight + headerMargins + containerPaddings}px)`;
        }
    };

    // useEffect hook to run the adjustMainHeight function on component mount and window resize
    useEffect(() => {
        adjustMainHeight();
        window.addEventListener("resize", adjustMainHeight);

        // Cleanup function to remove the event listener
        return () => window.removeEventListener("resize", adjustMainHeight);
    }, []);

    return (
        <div>
            <header className='d-flex justify-content-between align-items-center mb-3'>
                <div>
                    <h4 className='mb-0'>
                        Inspector
                    </h4>
                    <figcaption className='text-muted small mt-0 mb-0 fw-light'>by <a className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/' target='_blank'>VieTicket</a></figcaption>
                </div>
                <ButtonGroup size='sm' className='text-end'>
                    <ThemeButton userPref={userPref} cycleTheme={cycleTheme} />
                    <Button aria-label='Log Out' title='Log Out' variant='outline-secondary' className='btn-logout' onClick={handleLogout} style={{ color: 'var(--bs-danger)' }}><LogoutIcon /></Button>
                </ButtonGroup>
            </header>

            <main onClick={qrScanned ? handleScanAnother : undefined} style={{ minHeight: '100vh' }}>
                <div className='row g-4'>
                    <div className='col-md-6'>
                        {qrScanned ? (
                            <Alert variant='info' className='mt-0 mb-0'>Press <strong>Space</strong> or tap screen to validate another ticket.</Alert>
                        ) : (
                            <>
                                <QrReader onScan={onQrScan} />
                                <br />
                                <TicketInputForm qrCode={qrCode} setQrCode={setQrCode} handleSubmit={handleSubmit} />
                            </>
                        )}
                    </div>
                    <div className='col-md-6'>
                        <TicketDetailsCard ticketDetails={ticketDetails} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckIn;
