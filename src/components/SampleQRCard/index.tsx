import React, {useEffect, useState} from 'react';
import {QRCodeCanvas} from "qrcode.react";
import {Button, Col, Row} from "react-bootstrap";
import {Refresh} from "@mui/icons-material";
import TicketDetailsCard from "../check-in-screen/TicketDetailsCard.tsx";
import {generateTicketDetails} from "../../utils/api.ts";
import {TicketDetails} from "../../App.tsx";

const SampleQRCard: React.FC = () => {
    const [uuid, setUUID] = React.useState<string>('');
    const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);

    useEffect(() => {
        setUUID(randomUUID());
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const details = generateTicketDetails(uuid);
                details.message = 'Sample ticket details';
                details.status = 'PURCHASED';
                setTicketDetails(details);
            } catch (err) {
                setTicketDetails(null);
            }
        };

        if (uuid) {
            fetchDetails();
        }
    }, [uuid]);

    const randomUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    return (
        <Row className={'mb-3'}>
            <Col md={4} className='d-flex align-items-center justify-content-center flex-column'>
                <div className='mb-1'>
                    <QRCodeCanvas value={uuid} includeMargin/>
                </div>
                <Button className={'mb-2 mb-md-0'} variant={'outline-secondary'} onClick={() => setUUID(randomUUID())}><Refresh/></Button>
            </Col>
            <Col md={8}>
                <TicketDetailsCard ticketDetails={ticketDetails} error={null} qrScanned={true} isLoading={false}/>
            </Col>
        </Row>
    );
}

export default SampleQRCard;