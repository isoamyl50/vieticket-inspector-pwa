import React, {useState} from 'react';
import {Button, FloatingLabel, Form} from 'react-bootstrap';
import {verifyOtp} from '../../utils/api';
import axios from 'axios';

interface OTPInputFormProps {
    setMessage: (message: string) => void;
    isLoading: boolean;
    setLoading: (loading: boolean) => void;
    setSuccess: (success: boolean) => void;
    setToken: (token: string) => void;
    email: string;
}

const OTPInputForm: React.FC<OTPInputFormProps> = ({
                                                       setMessage,
                                                       setLoading,
                                                       isLoading,
                                                       setSuccess,
                                                       email,
                                                       setToken
                                                   }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const responseData = await verifyOtp(email, otp);
            setMessage(responseData.message);
            setToken(responseData.token);
            setSuccess(true);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response) {
                // Check if the error status code is 400
                if (err.response.status === 400) {
                    // Assuming the server response contains a message field in its JSON payload
                    const errorMessage = err.response.data.message || 'Error submitting data to the server';
                    setMessage(errorMessage);
                } else {
                    // Handle other errors
                    setMessage('Error submitting data to the server');
                }
            } else {
                // Handle errors and play the error sound
                setMessage('An unexpected error occurred');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group className='mb-3'>
                <FloatingLabel
                    controlId='floatingInput'
                    label={'One-Time Password (OTP)'}
                >
                    <Form.Control
                        autoComplete='one-time-code'
                        type='text'
                        placeholder='Enter OTP'
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isLoading}
                    />
                </FloatingLabel>
            </Form.Group>
            <Button
                className='w-100'
                type='submit'
                variant='primary'
                disabled={isLoading}
            >
                Submit
            </Button>
        </Form>
    );
};

export default OTPInputForm;