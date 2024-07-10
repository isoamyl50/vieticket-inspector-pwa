import axios from 'axios';

/**
 * The base URL of the API. Defined to separate development and production environments.
 */
export const apiBaseUrl: string = (import.meta.env.VITE_APP_API_BASE_URL as string);

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

/**
 * Requests a password reset.
 * @param email - The email address of the user requesting the password reset.
 * @returns A Promise that resolves to the server's response.
 */
export const requestPasswordReset = async (email: string) => {
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/password-reset/request-reset`, { email });
    return response.data;
};

/**
 * Verifies the OTP for password reset.
 * @param email - The email address of the user.
 * @param otp - The one-time password provided by the user.
 * @returns A Promise that resolves to the server's response.
 */
export const verifyOtp = async (email: string, otp: string) => {
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/verify-otp`, { email, otp });
    return response.data;
};

/**
 * Sets the new password for the user.
 * @param newPassword - The new password chosen by the user.
 * @returns A Promise that resolves to the server's response.
 */
export const setNewPassword = async (newPassword: string) => {
    const response = await axios.post(`${apiBaseUrl}/api/v1/auth/password-reset/new-password`, { newPassword });
    return response.data;
};