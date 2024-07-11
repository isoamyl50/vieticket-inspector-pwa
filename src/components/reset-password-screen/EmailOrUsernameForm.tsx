import React, {useState} from "react";
import {Button, FloatingLabel, Form} from "react-bootstrap";
import {requestPasswordReset} from "../../utils/api";
import axios from "axios";

interface EmailOrUsernameFormProps {
    setMessage: (message: string) => void;
    isLoading: boolean;
    setLoading: (isLoading: boolean) => void;
    setSuccess: (isSuccess: boolean) => void;
    setParentEmail: (email: string) => void;
}

const EmailOrUsernameForm: React.FC<EmailOrUsernameFormProps> = ({setMessage, isLoading, setLoading, setSuccess, setParentEmail}) => {
    const [emailOrUsername, setEmailOrUsername] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        try {
            const responseData = await requestPasswordReset(emailOrUsername);
            setMessage(responseData.message);
            setParentEmail(emailOrUsername);
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
            <Form.Group className="mb-3">
                <FloatingLabel
                    controlId="floatingInput"
                    label={'Email or Username'}
                >
                    <Form.Control
                        type="text"
                        placeholder="Enter email or username"
                        value={emailOrUsername}
                        onChange={(e) => setEmailOrUsername(e.target.value)}
                        disabled={isLoading}
                    />
                </FloatingLabel>
            </Form.Group>
            <Button
                className="w-100"
                type='submit'
                variant="primary"
                disabled={isLoading}
            >
                Submit
            </Button>
        </Form>
    );
};

export default EmailOrUsernameForm;