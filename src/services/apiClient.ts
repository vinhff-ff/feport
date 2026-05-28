import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import axiosInstance from './axiosInstance';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, ApiError } from '../types/Api';

// ─── Refresh token queue ──────────────────────────────────────────────────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

// ─── Request interceptor ─────────────────────────────────────────────────────
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {

    const accessToken = useAuthStore.getState().accessToken

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    // Auto detect FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    } else {
      config.headers['Content-Type'] = 'application/json'
    }

    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response interceptor ────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response.data.data,

  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newAccessToken) => {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.get<ApiResponse<{ accessToken: string; refreshToken: string; role: string }>>(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const { accessToken: newAccessToken, refreshToken: newRefreshToken, role } = response.data.data;

        useAuthStore.getState().setToken(newAccessToken, newRefreshToken, role);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);

      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    const apiError: ApiError = {
      message: error.response?.data?.message ?? 'Something went wrong',
      status: error.response?.status ?? 500,
      errors: undefined,
    };

    return Promise.reject(apiError);
  }
);

// ─── apiClient: typed wrapper ─────────────────────────────────────────────────
const apiClient = {
  get: <T>(url: string, params?: object): Promise<T> =>
    axiosInstance.get(url, { params }),

  post: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.post(url, body),

  put: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.put(url, body),

  patch: <T>(url: string, body?: unknown): Promise<T> =>
    axiosInstance.patch(url, body),

  delete: <T>(url: string): Promise<T> =>
    axiosInstance.delete(url),
};

export default apiClient;