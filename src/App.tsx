import React, { useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import CheckIn from './components/CheckIn';
import { useAuth } from './hooks/useAuth';
import { fetchTicketDetails } from './utils/api';
import { beep } from './utils/beep';
import { Container } from 'react-bootstrap';
import { useDarkMode } from './utils/theme';
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
    const { cycleTheme, userPref } = useDarkMode();
    const { isLoading: authLoading, error: authError, setError: setAuthError, authToken, login, logout, isAuthenticated } = useAuth();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrScanned, setQrScanned] = useState(false);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            if (event.code === 'Space') {
                handleScanAnother();
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const clearData = () => {
        setTicketDetails(null);
        setError(null);
        setIsLoading(false);
        setQrScanned(false);
    };

    const handleLogout = () => {
        clearData();
        logout();
    }

    const processQrCode = async (qrCode: string) => {

        // Check if qrCode text matches UUID format
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(qrCode)) {
            setError('Invalid QR code. Please try again.');
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
                beep(false);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleScanAnother = () => {
        setQrScanned(false);
    };

    return (
        <Container className="App p-3">
            {!isAuthenticated ? (
                <AuthForm
                    error={authError}
                    setError={setAuthError}
                    isLoading={authLoading}
                    onLogin={login}
                    cycleTheme={cycleTheme}
                    userPref={userPref}
                />
            ) : (
                <CheckIn
                    onQrScan={processQrCode}
                    ticketDetails={ticketDetails}
                    error={error}
                    isLoading={isLoading}
                    onManualSubmit={processQrCode}
                    qrScanned={qrScanned}
                    setQrScanned={setQrScanned}
                    handleScanAnother={handleScanAnother}
                    onLogout={handleLogout}
                    cycleTheme={cycleTheme}
                    userPref={userPref}
                />
            )}
        </Container>
    );
};

export default App;
