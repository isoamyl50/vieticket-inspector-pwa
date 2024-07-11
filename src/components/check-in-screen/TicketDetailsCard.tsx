import React from 'react';
import { Card, Alert } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-loading-skeleton/dist/skeleton.css';

export interface TicketDetails {
    leadVisitor: string;
    event: string;
    seat: string;
    status: 'PURCHASED' | 'CHECKED_IN' | null;
    message?: string;
}

interface TicketDetailsCardProps {
    ticketDetails: TicketDetails | null;
    isLoading: boolean;
    error: string | null;
}

const TicketDetailsCard: React.FC<TicketDetailsCardProps> = ({ ticketDetails, isLoading, error }) => {
    const getRandomWidth = () => Math.floor(Math.random() * 69) + 20;

    if (isLoading) {
        return (
            <Card className='mt-0' border='info'>
                <Card.Header>
                    <Skeleton width={`${getRandomWidth()}%`} />
                </Card.Header>
                <Card.Body>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`} /></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`} /></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`} /></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`} /></Card.Text>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return <Alert variant='danger' className='mt-0'>{error}</Alert>;
    }

    if (ticketDetails) {
        return (
            <Card
                bg={ticketDetails.status !== 'PURCHASED' ? 'danger' : undefined}
                text={ticketDetails.status !== 'PURCHASED' ? 'light' : undefined}
                border={ticketDetails.status !== 'PURCHASED' ? 'danger' : undefined}
                className={`mt-0`}>
                <Card.Header><strong>{ticketDetails.message}</strong></Card.Header>
                <Card.Body>
                    <Card.Text>Lead Visitor: {ticketDetails.leadVisitor}</Card.Text>
                    <Card.Text>Event: {ticketDetails.event}</Card.Text>
                    <Card.Text>Area/Row/Seat: {ticketDetails.seat}</Card.Text>
                    <Card.Text>Status: <strong>{ticketDetails.status}</strong></Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return null;
};

export default TicketDetailsCard;
