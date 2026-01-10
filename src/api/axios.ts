import axios from 'axios';

// Use environment variable for API base URL in production
// In development, Vite proxy will handle /api requests
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
});

export { axiosInstance };
export default axiosInstance;
