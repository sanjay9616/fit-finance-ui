import { Features, FormField } from "./interfaces";

export const features: Features[] = [
    { title: "Track Your Daily Expenses", desc: "Easily categorize and monitor your expenses in real time.", path: "/expense-tracking" },
    { title: "Set Monthly Expense Goals", desc: "Set goals, track progress, and achieve with Fit Finance.", path: '' },
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

