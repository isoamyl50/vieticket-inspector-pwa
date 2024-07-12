import React, {useCallback, useEffect, useRef, useState} from 'react';

// Styles
import './QrStyles.css';

// Qr Scanner
import QrScanner from 'qr-scanner';

interface QrReaderProps {
    onScan: (qrCode: string) => void;
    cameraOrientation?: 'environment' | 'user';
}

const QrReader: React.FC<QrReaderProps> = ({ onScan, cameraOrientation }) => {
    // QR States
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const isFirstScan = useRef(true); // Keep track of the first scan

    // Success
    const onScanSuccess = useCallback((result: QrScanner.ScanResult) => {
        if (isFirstScan.current) {
            isFirstScan.current = false;
            onScan(result?.data);
            // Immediately stop the scanner after successful scan
            scanner?.current?.stop();
        }
    }, [onScan]);

    // Fail
    const onScanFail = (err: string | Error) => {
    };

    useEffect(() => {
        let scannerInstance: QrScanner | null = null; // Store the scanner instance

        const startScanner = () => {
            if (videoEl?.current && !scannerInstance) {
                scannerInstance = new QrScanner(videoEl?.current, onScanSuccess, {
                    onDecodeError: onScanFail,
                    preferredCamera: cameraOrientation,
                });
            }
            scannerInstance?.start().then(() => setQrOn(true)).catch((err) => {
                if (err) setQrOn(false);
            });
        };

        const stopScanner = () => {
            scannerInstance?.stop();
        };

        // Initial scanner start
        startScanner();

        // Clean up on unmount and when qrScanned changes
        return () => {
            stopScanner();
            scannerInstance = null; // Release the instance
        };
    }, [onScanSuccess, cameraOrientation]);

    // ❌ If 'camera' is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                'Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.'
            );
    }, [qrOn]);

    return (
        <div className='qr-reader'>
            {/* QR */}
            <video ref={videoEl}></video>
        </div>
    );
};

export default React.memo(QrReader);
