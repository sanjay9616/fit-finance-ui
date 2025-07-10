import React from 'react';
import { useRouter } from 'next/router';
import LoginForm from './login-form';

const Login = () => {
    const router = useRouter();

    const handleSignUp = () => {
        router.push('/users/create');
    };

    return (
        <div className="p-0 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
            <LoginForm />

            <div className="hidden md:block order-1 md:order-2 bg-gradient-to-r from-green-100 to-green-200 p-6 md:p-8 rounded-xl shadow-xl transition-transform transform hover:scale-105 w-full">
                <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4 text-green-600 text-center md:text-left">New Here?</h2>
                <p className="text-gray-600 mb-5 md:mb-6 text-center md:text-left hidden md:block">
                    Create an account to track your expenses, manage budgets, and generate detailed financial reports with ease.
                </p>

                <div className="flex justify-center md:justify-start">
                    <button
                        onClick={handleSignUp}
                        className="bg-green-500 text-white py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300"
                    >
                        Create Your Account
                    </button>
                </div>
            </div>
        </div>

    );
}

export default Login;
