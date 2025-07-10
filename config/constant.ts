import { FormField } from "./interfaces";

export const features = [
    { title: "Track Your Daily Expenses", desc: "Easily categorize and monitor your expenses in real time.", path: "/expense-tracking" },
    { title: "Set Monthly Expense Goals", desc: "Set goals, track progress, and achieve with Fit Finance." },
    { title: "Split/Settle Your Expenses", desc: "Easily divide expenses among friends or family members." },
    { title: "Budget & Savings Report", desc: "Generate detailed reports to analyze your spending and savings." },
    { title: "Set Your Daily Macros & Meals", desc: "Track your daily nutrition intake, manage meals, and stay fit.", path: "/diet-management" },
    { title: "Set Your Workout Plans", desc: "Create and customize your own workout routines and monitor your fitness journey." },
    { title: "Health Monitoring", desc: "Track body measurements, monitor heart rate, and analyze your overall health progress." },
]

export const userStatement = [
    { quote: "Tracking my expenses has never been easier! Fit Finance helped me budget effectively and save more.", name: "Sarah Williams" },
    { quote: "Splitting expenses with friends on trips was a hassle before. Fit Finance made it seamless!", name: "Michael Lee" },
    { quote: "The diet and workout management features are incredible. Staying fit and organized has never been so simple.", name: "Priya Sharma" }
]

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
