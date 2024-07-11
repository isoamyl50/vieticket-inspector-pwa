import { useEffect, useState } from 'react';
import { tips } from './tips';
import { Col, Container, Row } from 'react-bootstrap';
import Branding from '../Branding';

const SplashScreen: React.FC = () => {

    const [selectedTip, setSelectedTip] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            setSelectedTip(randomTip);
        }, 2560);
    
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container fluid className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
            <Row className="h-50 justify-content-center">
                <Col className="text-start align-self-end">
                    <Branding big />
                </Col>
            </Row>


            <Row className="h-50 align-items-center"> 
                <Col className="text-center">
                    <small className='small text-muted'>{selectedTip}</small>
                </Col>
            </Row>
        </Container>
    );
}

export default SplashScreen;