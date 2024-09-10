// src/utils/tokenUtils.js
import axios from 'axios';

// Token management helper functions
export const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
};

export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

// Axios instance for making API calls with automatic token refreshing
const api = axios.create({
  baseURL: 'https://psychic-cod-94497pgxvg4h74pj-5000.app.github.dev/', // Your Flask API URL
});

api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Automatically refresh token when access token expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = getRefreshToken();
      try {
        const response = await axios.post(
          'https://psychic-cod-94497pgxvg4h74pj-5000.app.github.dev/refresh',
          {},
          {
            headers: { Authorization: `Bearer ${refreshToken}` },
          }
        );
        const newAccessToken = response.data.access_token;
        setTokens(newAccessToken, refreshToken);
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Retry the original request with the new token
      } catch (err) {
        clearTokens();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
