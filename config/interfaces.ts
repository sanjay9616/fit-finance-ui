export interface Features {
    title: string,
    desc: string,
    path: string,
}

export type ExpenseType = 'Expense' | 'Income' | 'Saving';

export interface Expense {
    _id?: string
    category: string;
    name: string,
    expenseType: ExpenseType,
    amount: number;
    createdAt: number;
    updatedAt: number;
    description: string | null,
}

export interface ExpenseFormData {
    userId: number;
    category: string;
    name: string;
    expenseType: ExpenseType,
    amount: number;
    createdAt: number;
    updatedAt: number;
    description?: string;
};

export interface ExpenseGoal {
    _id?: string;
    userId: number | null;
    category: string;
    expenseType: ExpenseType;
    targetAmount: number;
    currentAmount: number;
    description: string;
    createdAt: number;
    updatedAt: number;
}

// export interface ExpenseGoalFormData {
//     userId: number;
//     category: string;
//     expenseType: ExpenseType;
//     targetAmount: number;
//     currentAmount: number;
//     description: string;
//     createdAt: number;
//     updatedAt: number;
// }

export interface FormField {
    name: string;
    type: string;
    label: string;
    placeholder: string;
    required: boolean;
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        message: string;
    };
}

export type ExpenseHeaderCard = {
    title: string;
    subTitle: string;
    targetAmount: string;
    currentAmount: string;
    achieved: number;
    achievedText: string;
    progressBarColor: string;
    icon: string;
    textColor: string;
    bg: string;
};

