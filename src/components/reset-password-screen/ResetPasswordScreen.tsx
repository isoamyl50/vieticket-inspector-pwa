import React, {useState} from 'react';
import {Alert, Card, Col, Row} from 'react-bootstrap';
import ThemeButton from '../ThemeButton';
import {Link} from 'react-router-dom';
import {ArrowBackOutlined, CheckCircleOutlineOutlined} from '@mui/icons-material';
import Branding from '../Branding';
import EmailOrUsernameForm from './EmailOrUsernameForm';
import OTPInputForm from './OTPInputForm';
import NewPasswordForm from './NewPasswordForm';

interface ResetPasswordScreenProps {
    userPref: 'light' | 'dark' | 'auto';
    cycleTheme: () => void;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({cycleTheme, userPref}) => {

    const [message, setMessage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [isLoading, setLoading] = useState<boolean>(false);
    const [isRequestSuccess, setRequestSuccess] = useState<boolean>(false);
    const [isOtpSuccess, setOtpSuccess] = useState<boolean>(false);
    const [isNewPasswordSuccess, setNewPasswordSuccess] = useState<boolean>(false);
    const [token, setToken] = useState<string>('')

    return (
        <Row className='justify-content-center'>
            <Col xs={12} sm={9} md={7} lg={6} xl={5} xxl={4}>

                <header className='d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex align-items-center'>
                        <Link to={'/auth/login'}
                              className={`btn btn-outline-primary btn-sm ${isLoading ? 'disabled' : ''}`}
                              onClick={(e) => isLoading && e.preventDefault()}
                        >
                            <ArrowBackOutlined/>
                        </Link>
                        <Branding className={'ms-3'}/>
                    </div>
                    <ThemeButton size={'sm'} className='text-end' cycleTheme={cycleTheme} userPref={userPref}/>
                </header>

                {message && <Alert variant='info' className='mb-3'>{message}</Alert>}

                <Card className='p-1 container'>
                    <Card.Body>
                        <Card.Title className='mb-3'>Reset Password</Card.Title>
                        {!isRequestSuccess &&
                            <EmailOrUsernameForm
                                setMessage={setMessage}
                                isLoading={isLoading}
                                setLoading={setLoading}
                                setSuccess={setRequestSuccess}
                                setParentEmail={setEmail}
                            />}
                        {isRequestSuccess && !isOtpSuccess &&
                            <OTPInputForm
                                setMessage={setMessage}
                                isLoading={isLoading}
                                setLoading={setLoading}
                                setSuccess={setOtpSuccess}
                                email={email}
                                setToken={setToken}
                            />}
                        {isRequestSuccess && isOtpSuccess && !isNewPasswordSuccess &&
                            <NewPasswordForm
                                setMessage={setMessage}
                                isLoading={isLoading}
                                setLoading={setLoading}
                                setSuccess={setNewPasswordSuccess}
                                token={token}
                            />}
                        {isRequestSuccess && isOtpSuccess && isNewPasswordSuccess && (
                            <div className={'text-center'}>
                                <CheckCircleOutlineOutlined className={'m-2'} fontSize={'large'}/>
                                <h4>Success</h4>
                                <p className='small text-muted'>Your password has been reset.</p>
                                <Link to={'/auth/login'} className='btn btn-primary w-100'>Back to Login</Link>
                            </div>
                        )}
                    </Card.Body>
                </Card>

            </Col>
        </Row>
    );
};

export default ResetPasswordScreen;