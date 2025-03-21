import { ENDPOINTS } from "@/config/endpoints";
import { apiService } from "@/utils/apiService";

export const userService = {
    dummyAPI: () => apiService.get(''),
    createUser: (userData: any) => apiService.post(ENDPOINTS.USERS.CREATE, userData),
};