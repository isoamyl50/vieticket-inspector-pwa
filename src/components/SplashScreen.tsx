import { Container } from "react-bootstrap";

const SplashScreen: React.FC = () => {
    return (
        <Container className='d-flex flex-column justify-content-center align-items-center' style={{ height: '100vh' }}>
            <div className='text-start'>
                <h2 className='mb-0 display-3 fw-semibold'>
                    Inspector
                </h2>
                <figcaption className="text-muted mt-0 fw-light">by <a className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/' target='_blank'>VieTicket</a></figcaption>
            </div>
        </Container>

    );
}

export default SplashScreen;