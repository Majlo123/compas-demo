import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { config } from '@/config/config.ts';
import {
  getFromLocalStorage,
  setToLocalStorage,
  removeFromLocalStorage,
} from '@/services/local.storage.ts';

const axiosServer = axios.create({
  baseURL: config.backend.apiUrl,
  withCredentials: true,
});

let isTokenRenewing = false;
let tokenRenewalPromise: Promise<boolean> | null = null;

const NETWORK_ERROR_CODE = 'ERR_NETWORK';

export const renewTokens = async (): Promise<boolean> => {
  const axiosResponse = await axiosServer.post('/auth/renew-token');

  if (axiosResponse.data.success) {
    const { token } = axiosResponse.headers;
    setToLocalStorage('token', token);
    return true;
  }

  removeFromLocalStorage('token');

  return false;
};

type RequestConfig = AxiosRequestConfig & { priority: number };

type RequestQueueItem<T = any> = {
  config: RequestConfig;
  resolve: (value: AxiosResponse<T>) => void;
  reject: (reason?: any) => void;
};

const requestQueue: RequestQueueItem[] = [];
let isProcessingQueue = false;

const processQueue = async (): Promise<void> => {
  if (isProcessingQueue || requestQueue.length === 0) return;

  isProcessingQueue = true;
  const nextRequest = requestQueue
    .sort((a, b) => b.config.priority - a.config.priority)
    .shift();

  if (nextRequest) {
    try {
      const response = await axiosServer(nextRequest.config);
      nextRequest.resolve(response);
    } catch (error) {
      nextRequest.reject(error);
    } finally {
      isProcessingQueue = false;
      processQueue(); // Process next request in the queue
    }
  }
};

const addToQueue = <T>(
  axiosConfig: RequestConfig
): Promise<AxiosResponse<T>> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ config: axiosConfig, resolve, reject });
    processQueue();
  });
};

const handleTokenExpiredResponse = async (error: any): Promise<any> => {
  const originalRequest = error.config;
  if (!originalRequest._retry) {
    originalRequest._retry = true;

    if (!isTokenRenewing) {
      isTokenRenewing = true;
      tokenRenewalPromise = renewTokens();
    }

    const tokenRenewed = await tokenRenewalPromise;
    isTokenRenewing = false;

    if (tokenRenewed) {
      originalRequest.headers.token = getFromLocalStorage('token');
      return axiosServer(originalRequest);
    }

    if (originalRequest.url !== '/user/me') {
      window.location.href = '/login/';
    }

    return {
      data: { success: false, error: { message: 'Error', removeUser: true } },
    };
  }

  return error.response;
};

const handleUnauthorizedResponse = async (error: any): Promise<any> => {
  if (error.response.data.error.tokenExpired) {
    return handleTokenExpiredResponse(error);
  }

  // Don't redirect for vacation days endpoints - let the component handle the error
  const isVacationDaysEndpoint = error.config.url?.includes('/vacation-days');
  
  if (error.config.url !== '/user/me' && !isVacationDaysEndpoint) {
    window.location.href = '/login/';
  }

  return {
    data: { success: false, error: { message: 'Error', removeUser: true } },
  };
};

axiosServer.interceptors.request.use(
  (reqConfig) => {
    const token = getFromLocalStorage('token');
    if (token) {
      reqConfig.headers.Authorization = `Bearer ${token}`;
    }
    reqConfig.headers.token = token;

    return reqConfig;
  },
  (error) => {
    return error;
  }
);

axiosServer.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.code === NETWORK_ERROR_CODE) {
      return {
        data: {
          success: false,
          error: {
            message: 'Unable to connect. Please try again.',
          },
        },
      };
    }
    if (error.response.status === 401) {
      return handleUnauthorizedResponse(error);
    }

    return error.response;
  }
);

export const priorityAxiosServer = <T>(
  axiosConfig: RequestConfig
): Promise<AxiosResponse<T>> => {
  return addToQueue<T>(axiosConfig);
};

export default axiosServer;
