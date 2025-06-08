import { ENDPOINTS } from "@/config/endpoints";
import { apiService } from "@/utils/apiService";

export const userService = {
    createUser: (userData: any) => apiService.post(ENDPOINTS.USERS.CREATE, userData),
    verifyUser: (userData: any, token: string) => apiService.post(`${ENDPOINTS.USERS.VERIFY_USER}?token=${token}`, userData),
    loginUser: (userData: any) => apiService.post(ENDPOINTS.USERS.LOGIN_USER, userData),
};