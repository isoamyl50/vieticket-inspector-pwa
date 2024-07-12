import React from 'react';
import {Alert, Card} from 'react-bootstrap';
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
    qrScanned: boolean;
}

const TicketDetailsCard: React.FC<TicketDetailsCardProps> = ({ticketDetails, isLoading, error, qrScanned}) => {
    const getRandomWidth = () => Math.floor(Math.random() * 50) + 25;

    if (isLoading) {
        return (
            <Card className='mt-0' border='info'>
                <Card.Header>
                    <Skeleton width={`${getRandomWidth()}%`}/>
                </Card.Header>
                <Card.Body>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`}/></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`}/></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`}/></Card.Text>
                    <Card.Text><Skeleton width={`${getRandomWidth()}%`}/></Card.Text>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return <Alert variant={!qrScanned ? 'secondary' : 'danger'} className='mt-0'>{error}</Alert>;
    }

    if (ticketDetails) {
        return (
            <Card
                bg={!qrScanned ? undefined : ticketDetails.status !== 'PURCHASED' ? 'danger' : undefined}
                text={!qrScanned ? 'muted' : ticketDetails.status !== 'PURCHASED' ? 'light' : undefined}
                border={ticketDetails.status !== 'PURCHASED' ? 'danger' : undefined}
                className={`mt-0`}>
                <Card.Header><strong>{ticketDetails.message}</strong></Card.Header>
                <Card.Body>
                    <Card.Text><span className={'fw-bold'}>Lead Visitor:</span> {ticketDetails.leadVisitor}</Card.Text>
                    <Card.Text><span className={'fw-bold'}>Event:</span> {ticketDetails.event}</Card.Text>
                    <Card.Text><span className={'fw-bold'}>Area/Row/Seat:</span> {ticketDetails.seat}</Card.Text>
                    <Card.Text><span className={'fw-bold'}>Status:</span>
                        <strong>{ticketDetails.status}</strong></Card.Text>
                </Card.Body>
            </Card>
        );
    }

    return null;
};

export default TicketDetailsCard;
