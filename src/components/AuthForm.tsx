import React, { FormEvent, useState } from 'react';
import { Button, Form, Card, FloatingLabel, Alert, Row, Col, ButtonGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ThemeButton from './ThemeButton';
import GitHubIcon from '@mui/icons-material/GitHub';

/**
 * Props for the AuthForm component.
 */
interface AuthFormProps {
    error: string | null;
    setError: (error: string | null) => void;
    isLoading: boolean;
    onLogin: (username: string, password: string) => void;
    userPref: 'light' | 'dark' | 'auto';
    cycleTheme: () => void;
}

/**
 * A form component for user authentication.
 */
const AuthForm: React.FC<AuthFormProps> = ({ error, setError, isLoading, onLogin, userPref, cycleTheme }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    /**
     * Handles the form submission.
     * @param e - The form event.
     */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (!username || !password) {
            setError('Please enter your username and password.');
            return;
        }

        onLogin(username, password);
    };

    return (
        <>
            <Row className="justify-content-center">
                <Col xs={12} sm={9} md={7} lg={6} xl={5} xxl={4}>

                    <header className="d-flex justify-content-between align-items-center mb-3">
                        <div>
                            <h4 className='mb-0'>
                                Inspector
                            </h4>
                            <figcaption className="text-muted small mt-0 fw-light">by <a className='fw-semibold text-decoration-none text-muted' href='https://www.vieticket.io.vn/' target='_blank'>VieTicket</a></figcaption>
                        </div>
                        <ButtonGroup className='text-end' size='sm'>
                            <ThemeButton cycleTheme={cycleTheme} userPref={userPref} />
                            <Button variant='outline-secondary' aria-label='Check out the GitHub Repository' title='Check out the GitHub Repository' href='https://github.com/isoamyl50/vieticket-inspector-pwa' target='_blank' rel='noopener noreferrer'><GitHubIcon /></Button>
                        </ButtonGroup>
                    </header>


                    {error && <Alert variant="info" className='mb-3'>{error}</Alert>}
                    <Card className='p-1 container'>
                        <Card.Body>
                            <Card.Title className='mb-3'>Sign in</Card.Title>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <FloatingLabel
                                        controlId="floatingInput"
                                        label="Username"
                                    >
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            disabled={isLoading}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <FloatingLabel controlId="floatingPassword" label="Password">
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            disabled={isLoading}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </FloatingLabel>
                                </Form.Group>
                                <Button className="w-100" type='submit' variant="primary" disabled={isLoading}>Login</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    <a href="https://www.vieticket.io.vn/auth/reset-password" className="d-block mt-3 text-center text-decoration-none">Forgot your username or password?</a>
                </Col>
            </Row>
        </>
    );
};

export default AuthForm;
