import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.freeapi.app/api/v1';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      if (Platform.OS !== 'web') {
        const token = await SecureStore.getItemAsync('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    } catch (error) {
      console.error('Error fetching token', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle global errors here (e.g., 401 Unauthorized -> Logout)
    if (error.response) {
        console.error(`API Error: ${error.response.status} ${error.config.method.toUpperCase()} ${error.config.url}`, error.response.data);
    } else {
        console.error(`API Error: ${error.message}`);
    }

    if (error.response?.status === 401) {
       // Ideally we would try to refresh the token here.
       // Since we don't have a refresh token implementation from the backend yet,
       // we should clear the local token to force a re-login on next app start or
       // trigger a global logout event (could use existing store if we moved logic there,
       // or just clear storage).
       if (Platform.OS !== 'web') {
         await SecureStore.deleteItemAsync('authToken');
         await SecureStore.deleteItemAsync('userData');
       }
       // We could also broadcast an event or use the store outside of React
       // useAuthStore.getState().logout() // if we export the store properly
    }
    return Promise.reject(error);
  }
);

export default api;
