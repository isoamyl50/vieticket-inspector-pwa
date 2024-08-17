import React, {useCallback, useEffect, useState} from 'react';
import CheckIn from './components/check-in-screen/CheckIn';
import {fetchTicketDetails} from './utils/api';
import {beep} from './utils/beep';
import {Container} from 'react-bootstrap';
import {useThemes} from './hooks/useThemes';
import 'bootstrap/dist/css/bootstrap.min.css';
import HelpModal from "./components/HelpModal";

export interface TicketDetails {
    qrCode?: string,
    leadVisitor: string;
    event: string;
    seat: string;
    status?: 'PURCHASED' | 'CHECKED_IN';
    message?: string;
}

const App: React.FC = () => {
    const {cycleTheme, userPref} = useThemes();
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [qrScanned, setQrScanned] = useState(false);
    const [qrCodeState, setQrCodeState] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(true);
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

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

        // Check if qrCode not empty
        if (!qrCode) {
            setError('Please try again with another QR Code.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchTicketDetails(qrCode);
            if (data.status === 'PURCHASED') {
                beep();
            } else {
                beep(false);
            }

            setTicketDetails(data);
            setError(null);
        } catch (err) {
            // Assuming the server response contains a message field in its JSON payload
            const errorMessage = err instanceof Error ? err.message : 'Error submitting QR Code';
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

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
        <>
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
                    showModal={handleShowModal}
                />
            </Container>
            <HelpModal showModal={showModal} handleCloseModal={handleCloseModal} />
        </>
    );
};

export default App;
