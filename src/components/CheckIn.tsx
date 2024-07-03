import React, { FormEvent, useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import QrReader from './QrReader';
import TicketDetailsCard, { TicketDetails } from './TicketDetailsCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import ThemeButton from './ThemeButton';

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
        setQrScanned(true);
        e.preventDefault();
        if (qrCode) {
            onManualSubmit(qrCode);
            setQrCode('');
        }
    };

    return (
        <div>
            <header className="d-flex justify-content-between align-items-center mb-3">
                <h2>Check-In</h2>
                <div>
                    <ThemeButton className="ms-2" userPref={userPref} cycleTheme={cycleTheme} />
                    <Button aria-label='Help' variant="outline-secondary" className="ms-2" onClick={() => window.open('https://docs.vieticket.io.vn/check-in/checkin_using_pwa', '_blank')}><HelpOutlineIcon /></Button>
                    <Button aria-label='Log Out' variant="outline-danger" className='ms-2' onClick={handleLogout}><LogoutIcon /></Button>
                </div>
            </header>

            <main onClick={qrScanned ? handleScanAnother : undefined} style={{ minHeight: '100vh' }}>
                <div className="row g-4">
                    <div className="col-md-6">
                        {qrScanned ? (
                            <Alert variant="info" className="mt-3 mb-1">Press <strong>Space</strong> or tap screen to validate another ticket.</Alert>
                        ) : (
                            <>
                                <QrReader onScan={onQrScan} qrScanned={qrScanned} setQrScanned={setQrScanned} />
                                <br />
                                <Form onSubmit={handleSubmit}>
                                    <Form.Group>
                                        <Form.Label>Ticket Validation Data</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                                            value={qrCode}
                                            onChange={e => setQrCode(e.target.value)}
                                        />
                                        <Form.Text className="text-muted">
                                            Input the validation data manually if the QR code cannot be scanned.
                                        </Form.Text>
                                    </Form.Group>
                                    <Button variant="primary" type="submit">
                                        Submit QR Code
                                    </Button>
                                </Form>
                            </>
                        )}
                    </div>
                    <div className="col-md-6">
                        <TicketDetailsCard ticketDetails={ticketDetails} isLoading={isLoading} error={error} />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CheckIn;
