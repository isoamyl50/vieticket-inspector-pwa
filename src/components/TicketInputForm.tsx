import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Form, Button } from 'react-bootstrap';

interface TicketInputFormProps {
    qrCode: string;
    setQrCode: (qrCode: string) => void;
    handleSubmit: (e: FormEvent) => void;
}

const TicketInputForm: React.FC<TicketInputFormProps> = ({ qrCode, setQrCode, handleSubmit }) => {

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
        return parts.join('-');
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
                <Form.Control
                    type='text'
                    aria-label='Ticket Validation Data'
                    placeholder='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
                    value={qrCode}
                    onChange={handleChange}
                />
                <Form.Text className='small text-muted'>
                    Hyphens will be added automatically.
                </Form.Text>
            </Form.Group>
            <Button variant='primary mt-1' type='submit' title='Submit QR Code' disabled={!isValidUuid}>
                Submit QR Code
            </Button>
        </Form>
    );
};

export default TicketInputForm;