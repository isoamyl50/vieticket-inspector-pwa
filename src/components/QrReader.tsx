import { useEffect, useRef, useState } from "react";

// Styles
import "./QrStyles.css";

// Qr Scanner
import QrScanner from "qr-scanner";
import React from "react";

interface QrReaderProps {
    onScan: (qrCode: string) => void;
    qrScanned: boolean;
    setQrScanned: React.Dispatch<React.SetStateAction<boolean>>;
}

const QrReader: React.FC<QrReaderProps> = ({ onScan, qrScanned, setQrScanned }) => {
    // QR States
    const scanner = useRef<QrScanner>();
    const videoEl = useRef<HTMLVideoElement>(null);
    const [qrOn, setQrOn] = useState<boolean>(true);
    const isFirstScan = useRef(true); // Keep track of the first scan

    // Result
    const [scannedResult, setScannedResult] = useState<string | undefined>("");

    // Success
    const onScanSuccess = (result: QrScanner.ScanResult) => {
        if (isFirstScan.current) {
            isFirstScan.current = false;
            onScan(result?.data);
            setQrScanned(true);
            // Immediately stop the scanner after successful scan
            scanner?.current?.stop();
        }
    };

    // Fail
    const onScanFail = (err: string | Error) => {
    };

    useEffect(() => {
        let scannerInstance: QrScanner | null = null; // Store the scanner instance

        const startScanner = () => {
            if (videoEl?.current && !scannerInstance) {
                scannerInstance = new QrScanner(videoEl?.current, onScanSuccess, {
                    onDecodeError: onScanFail,
                    preferredCamera: "environment",
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

        if (qrScanned) {
            stopScanner();
        } else {
            startScanner(); // Ensure scanner is started when qrScanned is false
            isFirstScan.current = true;
            setScannedResult(undefined);
        }

        // Clean up on unmount and when qrScanned changes
        return () => {
            stopScanner();
            scannerInstance = null; // Release the instance
        };
    }, [qrScanned]);

    // ❌ If "camera" is not allowed in browser permissions, show an alert.
    useEffect(() => {
        if (!qrOn)
            alert(
                "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload."
            );
    }, [qrOn]);

    return (
        <div className="qr-reader">
            {/* QR */}
            <video ref={videoEl}></video>
        </div>
    );
};

export default QrReader;
