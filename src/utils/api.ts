import axios from 'axios';

/**
 * The base URL of the API. Defined to separate development and production environments.
 */
export const apiBaseUrl: string = (process.env.REACT_APP_API_BASE_URL as string);

/**
 * Fetches ticket details from the API.
 * @param qrCode - The QR code of the ticket.
 * @param token - The authentication token.
 * @returns A Promise that resolves to the ticket details.
 */
export const fetchTicketDetails = async (qrCode: string, token: string) => {
    const response = await axios.post(`${apiBaseUrl}/organizer/checkin`, { qrCode }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
