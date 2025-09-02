import { ENDPOINTS } from "@/config/endpoints";
import { apiService } from "@/utils/apiService";

export const expenseService = {
    getAllExpenses: (id: number, data: any) => apiService.post(`${ENDPOINTS.EXPENSE.EXPENCES}/${id}`, data),
    addNewExpense: (expence: any) => apiService.post(`${ENDPOINTS.EXPENSE.EXPENCES}`, expence),
    updateExpense: (id: string, expence: any) => apiService.patch(`${ENDPOINTS.EXPENSE.EXPENCES}/${id}`, expence),
    deleteExpense: (id: string) => apiService.delete(`${ENDPOINTS.EXPENSE.EXPENCES}/${id}`),
    getCategories: (id: number, search: string, createdAt: number) => apiService.get(`${ENDPOINTS.EXPENSE.GET_CATEGORY_LIST}/${id}`, {
        params: { search, createdAt }
    }),
    getAllCategories: (id: number) => apiService.get(`${ENDPOINTS.EXPENSE.GET_ALL_CATEGORY_LIST}/${id}`),
    getExpenseGoalsByCategory: (id: number, category: string, createdAt: number) => apiService.get(`${ENDPOINTS.EXPENSE.GET_EXPENSE_GOAL_BY_CATEGORY}/${id}`, {
        params: { category, createdAt }
    }),
};