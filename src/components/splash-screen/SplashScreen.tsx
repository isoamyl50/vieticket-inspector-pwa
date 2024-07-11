import { useEffect, useState } from 'react';
import { tips } from './tips';
import { Col, Container, Row } from 'react-bootstrap';
import Branding from '../Branding';

const SplashScreen: React.FC = () => {

    const [selectedTip, setSelectedTip] = useState('');

    useEffect(() => {
        // Function to select and set a random tip
        const updateTip = () => {
            const randomTip = tips[Math.floor(Math.random() * tips.length)];
            setSelectedTip(randomTip);
        };
    
        // Call it once immediately to show a tip on component mount
        updateTip();
    
        // Set up the interval to update the tip every 2560 milliseconds
        const intervalId = setInterval(updateTip, 2560);
    
        // Cleanup function to clear the interval when the component unmounts
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