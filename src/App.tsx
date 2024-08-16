import React, { useCallback, useEffect, useState } from 'react';
import CheckIn from './components/check-in-screen/CheckIn';
import { fetchTicketDetails } from './utils/api';
import { beep } from './utils/beep';
import { Container } from 'react-bootstrap';
import { useThemes } from './hooks/useThemes';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface TicketDetails {
    leadVisitor: string;
    event: string;
    seat: string;
    status: 'PURCHASED' | 'CHECKED_IN' | null;
    message?: string;
}

const App: React.FC = () => {
    const { cycleTheme, userPref } = useThemes();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrScanned, setQrScanned] = useState(false);
    const [qrCodeState, setQrCodeState] = useState<string | null>(null);
    const authToken = '';

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                event.preventDefault();
                handleScanAnother();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const processQrCode = useCallback(async (qrCode: string) => {

        setQrScanned(true);

        // Check if qrCode text matches UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(qrCode)) {
            setError('Invalid QR code. Please try again.');
            beep(false);
            return;
        }

        if (authToken && qrCode) {
            setIsLoading(true);
            try {
                const data = await fetchTicketDetails(qrCode, authToken);
                if (data.status === 'PURCHASED') {
                    beep();
                } else {
                    beep(false);
                }

                setTicketDetails(data);
                setError(null);
            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    // Check if the error status code is 400
                    if (err.response.status === 400) {
                        // Assuming the server response contains a message field in its JSON payload
                        const errorMessage = err.response.data.message || 'Error submitting QR Code';
                        setError(errorMessage);
                    } else {
                        // Handle other errors
                        setError('Error submitting QR Code');
                    }
                } else {
                    // Handle errors and play the error sound
                    setError('An unexpected error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        }
    }, [authToken]);

    const handleQrCode = useCallback(
        (qrCode: string) => {
            setQrCodeState(qrCode);
        },
        []
    );

    const handleScanAnother = () => {
        setQrScanned(false);
    };

    const clearPreviousTicket = () => {
        setTicketDetails(null);
        setError(null);
    }

    useEffect(() => {

        if (qrCodeState !== null) {
            processQrCode(qrCodeState);
            setQrCodeState(null);
        }

    }, [qrCodeState, processQrCode]);

    return (
        <Container className='p-3'>
            <CheckIn
                onQrScan={handleQrCode}
                ticketDetails={ticketDetails}
                error={error}
                isLoading={isLoading}
                onManualSubmit={processQrCode}
                qrScanned={qrScanned}
                handleScanAnother={handleScanAnother}
                cycleTheme={cycleTheme}
                userPref={userPref}
                clearPreviousTicket={clearPreviousTicket}
            />
        </Container>
    );
};

export default App;
