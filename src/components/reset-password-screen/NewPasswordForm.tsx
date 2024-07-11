import React, {useState} from 'react';
import {Button, FloatingLabel, Form} from 'react-bootstrap';
import {setNewPassword} from '../../utils/api';
import axios from 'axios';

interface NewPasswordFormProps {
    setMessage: (message: string) => void;
    setLoading: (loading: boolean) => void;
    isLoading: boolean;
    setSuccess: (success: boolean) => void;
    token: string;
}

const NewPasswordForm: React.FC<NewPasswordFormProps> = ({setMessage, setLoading, isLoading, setSuccess, token}) => {
    const [password, setPassword] = useState('');
    const [retypePassword, setRetypePassword] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        if (password !== retypePassword) {
            setMessage('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const responseData = await setNewPassword(token, password);
            setMessage(responseData.message);
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
                <FloatingLabel controlId='floatingInput' label={'New Password'}>
                    <Form.Control
                        autoComplete='new-password'
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                    />
                </FloatingLabel>
            </Form.Group>
            <Form.Group className='mb-3'>
                <FloatingLabel controlId='floatingInput' label={'Confirm new Password'}>
                    <Form.Control
                        autoComplete='new-password'
                        type='password'
                        placeholder='Retype New Password'
                        value={retypePassword}
                        onChange={(e) => setRetypePassword(e.target.value)}
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
                Reset Password
            </Button>
        </Form>
    );
};

export default NewPasswordForm;