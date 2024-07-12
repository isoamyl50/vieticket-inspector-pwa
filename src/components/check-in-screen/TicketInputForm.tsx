import React, {ChangeEvent, FormEvent, useState} from 'react';
import {Button, Form, InputGroup} from 'react-bootstrap';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface TicketInputFormProps {
    qrCode: string;
    setQrCode: (qrCode: string) => void;
    handleSubmit: (e: FormEvent) => void;
}

const TicketInputForm: React.FC<TicketInputFormProps> = ({qrCode, setQrCode, handleSubmit}) => {

    const [isValidUuid, setIsValidUuid] = useState(false);

    const validateUuid = (input: string) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        return uuidRegex.test(input);
    };

    const formatInput = (input: string) => {
        const raw = input.replace(/[^0-9a-f]/gi, '');
        const parts = [
            raw.substring(0, 8),
            raw.substring(8, 12),
            raw.substring(12, 16),
            raw.substring(16, 20),
            raw.substring(20, 32),
        ].filter(Boolean);
        return parts.join('-').toLowerCase();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const formattedInput = formatInput(e.target.value);
        setQrCode(formattedInput);
        setIsValidUuid(validateUuid(formattedInput));
    };

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>Ticket Validation Data</Form.Label>
                <InputGroup>
                    <Form.Control
                        type='text'
                        aria-label='Ticket Validation Data'
                        placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                        value={qrCode}
                        onChange={handleChange}
                    />
                    <Button variant='primary' type='submit' title='Submit QR Code' aria-label='Submit QR Code'
                            disabled={!isValidUuid}>
                        <ArrowForwardIcon/>
                    </Button>
                </InputGroup>
                <Form.Text className='small text-muted'>
                    Hyphens will be added automatically.
                </Form.Text>
            </Form.Group>
        </Form>
    );
};

export default TicketInputForm;