import { Features, FormField } from "./interfaces";

export const features: Features[] = [
    { title: "Track Your Daily Expenses", desc: "Easily categorize and monitor your expenses in real time.", path: "/expense-tracking" },
    { title: "Set Monthly Expense Goals", desc: "Set goals, track progress, and achieve with Fit Finance.", path: '/expense-goals' },
    { title: "Split/Settle Your Expenses", desc: "Easily divide expenses among friends or family members.", path: '' },
    { title: "Budget & Savings Report", desc: "Generate detailed reports to analyze your spending and savings.", path: '' },
    { title: "Set Your Daily Macros & Meals", desc: "Track your daily nutrition intake, manage meals, and stay fit.", path: "/diet-management" },
    { title: "Set Your Workout Plans", desc: "Create and customize your own workout routines and monitor your fitness journey.", path: '' },
    { title: "Health Monitoring", desc: "Track body measurements, monitor heart rate, and analyze your overall health progress.", path: '' },
]

export const userStatement = [
    { quote: "Tracking my expenses has never been easier! Fit Finance helped me budget effectively and save more.", name: "Sarah Williams" },
    { quote: "Splitting expenses with friends on trips was a hassle before. Fit Finance made it seamless!", name: "Michael Lee" },
    { quote: "The diet and workout management features are incredible. Staying fit and organized has never been so simple.", name: "Priya Sharma" }
];

export const loginFields: FormField[] = [
    {
        name: "email",
        type: "text",
        placeholder: "Email",
        required: true,
        label: "Email Address",
        validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Please enter a valid email",
        },
    },
    {
        name: "password",
        type: "password",
        placeholder: "Password",
        required: true,
        label: "Password",
    },
];

export const signupFields: FormField[] = [
    {
        name: 'name',
        type: "text",
        placeholder: 'Name',
        label: 'Name',
        required: true,
        validation: {
            minLength: 2,
            message: 'Name must be at least 2 characters'
        }
    },
    {
        name: 'email',
        type: "text",
        placeholder: 'Email',
        label: 'Email',
        required: true,
        validation: {
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Invalid email format'
        }
    },
    {
        name: 'password',
        type: "password",
        placeholder: 'Password',
        label: 'Password',
        required: true,
        validation: {
            minLength: 6,
            message: 'Password must be at least 6 characters'
        }
    }
];

export const getProgressColor = (percentage: number): string => {
    if (percentage > 100) return '#059669';  // emerald-600
    if (percentage > 90) return '#16a34a';   // green-600
    if (percentage > 80) return '#22c55e';   // green-500
    if (percentage > 70) return '#84cc16';   // lime-500
    if (percentage > 60) return '#facc15';   // yellow-400
    if (percentage > 50) return '#eab308';   // yellow-500
    if (percentage > 40) return '#f59e0b';   // amber-500
    if (percentage > 30) return '#f97316';   // orange-500
    if (percentage > 20) return '#ea580c';   // orange-600
    if (percentage > 10) return '#f87171';   // red-400
    return '#ef4444';                        // red-500
};

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const YEARS = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i);