import { ENDPOINTS } from "@/config/endpoints";
import { apiService } from "@/utils/apiService";

export const expenseGoalService = {
    getAllExpensesGoal: (id: number, from?: number, to?: number) => apiService.get(`${ENDPOINTS.EXPENSE_GOAL.EXPENCES}/${id}`, {
        params: from && to ? { from, to } : {}
    }),
    addNewExpenseGoal: (expence: any) => apiService.post(`${ENDPOINTS.EXPENSE_GOAL.EXPENCES}`, expence),
    updateExpenseGoal: (id: string, expence: any) => apiService.patch(`${ENDPOINTS.EXPENSE_GOAL.EXPENCES}/${id}`, expence),
    deleteExpenseGoal: (id: string) => apiService.delete(`${ENDPOINTS.EXPENSE_GOAL.EXPENCES}/${id}`),
};