import {Modal, OverlayTrigger, Tooltip} from "react-bootstrap";
import React from "react";
import {GitHub} from "@mui/icons-material";
import SampleQRCard from "../SampleQRCard";

interface HelpModalProps {
    showModal: boolean;
    handleCloseModal: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({showModal, handleCloseModal}) => {
    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Welcome to Inspector</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>This client-side app lets you inspect a ticket by scanning its QR code to view the details.</p>

                    <h5>How to Use</h5>
                    <p>
                        Open the web app on your mobile device or laptop. Align the QR code in the camera view, and the
                        ticket details will appear on the screen. You can add this web app to your home screen for
                        the&nbsp;
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id="tooltip-pwa">PWA (Progressive Web App) allows you to install a web app
                                like a native app for offline access and faster performance.</Tooltip>}
                        >
                            <span style={{textDecoration: "underline", cursor: "pointer"}}>PWA experience</span>
                        </OverlayTrigger>.
                    </p>

                    <h5>How It Works</h5>
                    <p>In production environment, the app fetches the details from an API. In this demo, it
                        pseudo-randomly generate ticket details on the client side based on the scanned QR code.</p>

                    <h5>Need a sample random QR code?</h5>
                    <p>Go to a <a href={'https://httpbin.dmuth.org/uuid/qrcode'} target={'_blank'}>random QR code
                        site</a> or scan the QR code below to view a sample ticket.</p>
                    <SampleQRCard />

                    <h5>Backend where?</h5>
                    <a className={'text-decoration-none'} href={'https://github.com/dangthanhvinh003/VieTicket'}><GitHub
                        fontSize={'small'} className={'mb-1'}/> dangthanhvinh003/VieTicket</a>
                </div>
            </Modal.Body>
        </Modal>
    );
}

export default HelpModal;