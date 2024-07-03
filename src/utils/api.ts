import axios from 'axios';

export const apiBaseUrl: string = (process.env.REACT_APP_API_BASE_URL as string);

export const fetchTicketDetails = async (qrCode: string, token: string) => {
    const response = await axios.post(`${apiBaseUrl}/organizer/checkin`, { qrCode }, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.data;
};
