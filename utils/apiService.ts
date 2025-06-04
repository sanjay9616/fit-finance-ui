import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_URL,
    timeout: 10000,
});

function handleSuccess<T>(response: AxiosResponse<T>): T {
    return response.data;
}

function handleError(error: any): never {
    throw error;
}

export const apiService = {
    get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        return apiClient.get<T>(url, config).then(handleSuccess).catch(handleError);
    },

    post: <T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
        return apiClient.post<T>(url, data, config).then(handleSuccess).catch(handleError);
    },

    put: <T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
        return apiClient.put<T>(url, data, config).then(handleSuccess).catch(handleError);
    },

    delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
        return apiClient.delete<T>(url, config).then(handleSuccess).catch(handleError);
    },

    patch: <T = any>(url: string, data: any, config?: AxiosRequestConfig): Promise<T> => {
        return apiClient.patch<T>(url, data, config).then(handleSuccess).catch(handleError);
    },
};
