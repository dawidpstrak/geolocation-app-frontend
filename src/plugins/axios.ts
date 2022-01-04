import globalAxios from 'axios';
import env from '@/config';

const { apiUrl } = env();

const axios = globalAxios.create({
    baseURL: apiUrl
});

axios.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');

        if (token) {
            config.headers!.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    error => {
        throw error;
    }
);

axios.interceptors.response.use(
    response => response,

    error => {
        if (error.response.status === 403) {
            localStorage.clear();
            window.location.href = '/login';
        }

        throw error;
    }
);

export default axios;
