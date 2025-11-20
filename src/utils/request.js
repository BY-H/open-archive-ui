// src/utils/request.js
import axios from 'axios';
import { showToast } from 'vant';
import router from '@/router';

// 创建 axios 实例
const request = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
    timeout: 10000,
});

// -----------------------
// 请求拦截器：自动带 token
// -----------------------
request.interceptors.request.use(
    config => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);

// -----------------------
// 响应拦截器
// -----------------------
request.interceptors.response.use(
    response => {
        // 后端正常返回的 response.data（例如 token）
        return response.data;
    },

    error => {
        // -----------------------------
        // 处理 HTTP 错误（如 401 / 500）
        // -----------------------------
        const status = error.response?.status;

        const message = error.response?.data?.error;
        if (status === 401) {
            showToast({
                message: message || '登录已过期，请重新登录',
                type: 'fail'
            });

            localStorage.removeItem('token');
            router.push('/login');
            return Promise.reject(error);
        }

        // 其他错误（例如 404 / 500 / timeout）
        showToast({
            message: message || '网络错误',
            type: 'fail'
        });

        return Promise.reject(error);
    }
);

export default request;
