export const ENDPOINTS = {
    USERS: {
        CREATE: `/users/create`,
        VERIFY_USER: `/users/verify`,
        LOGIN_USER: `/users/login`,
        VALIDATE_TOKEN: '/users/validate-token'
    },
    EXPENSE: {// /expense-goals/:userId
        EXPENCES: '/expense',
        GET_CATEGORY_LIST: '/expense/categories',
        GET_EXPENSE_GOAL_BY_CATEGORY: '/expense/expense-goals',
    },
    EXPENSE_GOAL: {
        EXPENCES: '/expense-goal',
    }
}