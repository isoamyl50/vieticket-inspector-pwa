import React, { useCallback, useEffect, useState } from 'react';
import AuthForm from './components/AuthForm';
import CheckIn from './components/check-in-screen/CheckIn';
import { useAuth } from './hooks/useAuth';
import { fetchTicketDetails } from './utils/api';
import { beep } from './utils/beep';
import { Container } from 'react-bootstrap';
import { useThemes } from './hooks/useThemes';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import SplashScreen from './components/splash-screen/SplashScreen';
import ResetPasswordScreen from './components/reset-password-screen/ResetPasswordScreen';

interface TicketDetails {
    leadVisitor: string;
    event: string;
    seat: string;
    status: 'PURCHASED' | 'CHECKED_IN' | null;
    message?: string;
}

const App: React.FC = () => {
    const { cycleTheme, userPref } = useThemes();
    const {
        isLoading: authLoading,
        error: authError,
        setError: setAuthError,
        authToken,
        login,
        logout,
        isAuthenticated,
        isInitialAuthCheckDone
    } = useAuth();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrScanned, setQrScanned] = useState(false);
    const [qrCodeState, setQrCodeState] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname !== '/auth/reset-password') {
            if (!isInitialAuthCheckDone) {
                navigate('/');
            } else if (isAuthenticated) {
                navigate('/check-in');
            } else {
                navigate('/auth/login');
            }
        }
    }, [isAuthenticated, navigate, isInitialAuthCheckDone, location.pathname]);
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

    useEffect(() => {

        if (qrCodeState !== null) {
            processQrCode(qrCodeState);
            setQrCodeState(null);
        }

    }, [qrCodeState, processQrCode]);

    return (
        <Routes>
            <Route path='/' element={
                <SplashScreen />
            }
            />
            <Route path='/auth/login' element={
                <Container className='p-3'>
                    <AuthForm
                        error={authError}
                        setError={setAuthError}
                        isLoading={authLoading}
                        onLogin={login}
                        cycleTheme={cycleTheme}
                        userPref={userPref}
                    />
                </Container>
            } />
            <Route path='/check-in' element={
                <Container className='p-3'>
                    <CheckIn
                        onQrScan={handleQrCode}
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
                </Container>
            } />
            <Route path='/auth/reset-password' element={
                <Container className='p-3'>
                    <ResetPasswordScreen
                        cycleTheme={cycleTheme}
                        userPref={userPref}
                    />
                </Container>
            } />
        </Routes>
    );
};

export default App;
