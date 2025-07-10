export interface Expense {
    _id?: string
    category: string;
    amount: number;
    createdAt: number;
    updatedAt: number;
    description: string | null,
}

export interface ExpenseFormData {
    id: number;
    category: string;
    amount: number;
    description?: string;
};

export interface FormField {
    name: string;
    type: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    validation?: {
        pattern?: RegExp;
        minLength?: number;
        message: string;
    };
}