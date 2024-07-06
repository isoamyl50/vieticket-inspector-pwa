import { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { apiBaseUrl } from '../utils/api';

interface LoginResponse {
    jwt: string;
}

interface AuthStatusResponse {
    isAuthenticated: boolean;
}

class AuthError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'AuthError';
    }
}

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem('authToken'));
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialAuthCheckDone, setIsInitialAuthCheckDone] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        const token = localStorage.getItem('authToken');

        try {
            if (!token) {
                setAuthToken(null);
                setIsAuthenticated(false);
                setError(null);
                setIsLoading(false);
                return;
            }

            const response = await axios.get<AuthStatusResponse>(`${apiBaseUrl}/auth/status`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.isAuthenticated) {
                setAuthToken(token);
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('authToken');
                setAuthToken(null);
                setIsAuthenticated(false);
                setError('Session expired. Please log in again.');
            }
        } catch (err) {
            setIsAuthenticated(false);
            setError('Could not make a request to the server. Please try again.');
        } finally {
            setIsLoading(false);
            setIsInitialAuthCheckDone(true);
        }
    }

    const login = async (username: string, password: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await axios.post<LoginResponse>(`${apiBaseUrl}/auth/login`, { username, password });
            const { jwt } = response.data;

            const decoded = jwtDecode<{ sub: string; roles: string[] }>(jwt);
            if (!decoded.roles.includes('ORGANIZER')) {
                throw new AuthError('You are not authorized to access this application.');
            }

            localStorage.setItem('authToken', jwt);
            setAuthToken(jwt);
            setIsAuthenticated(true);
        } catch (err) {
            if (err instanceof AuthError) {
                setError(err.message);
                // Check if error is network error
            }
            else if (axios.isAxiosError(error) && !error.response) {
                setError('Failed to establish connection to the server. Please check your network connection and try again later.');
                // Check if error status starts with 5 (server error)
            } else if (axios.isAxiosError(error) && error.response && error.response.status.toString().startsWith('5')) {
                setError('Server error. Please try again later.');
                // Check if error status is 401 (unauthorized)
            } else if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
                setError(`Invalid login. Please try again.`);
                // Any unexpected error
            } else {
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('authToken');
        setAuthToken(null);
    };

    return { isLoading, error, setError, authToken, login, logout, isAuthenticated, isInitialAuthCheckDone };
};
