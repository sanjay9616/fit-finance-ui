import { useRouter } from 'next/router';
import React from 'react';
import SignupForm from './signup-form';

const Index = () => {

    const router = useRouter();

    const handleLogin = () => {
        router.push('/users/login');
    };

    return (
        <div className="p-0 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Form Section */}
            <SignupForm />

            {/* Right Info Section */}
            <div className="hidden md:block bg-gradient-to-r from-green-100 to-green-200 p-8 rounded-xl shadow-xl transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-green-600">Already have an account?</h2>
                <p className="text-gray-600 mb-6">
                    If you already have an account, proceed to login and manage your data efficiently.
                </p>
                <button
                    onClick={handleLogin}
                    className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer"
                >
                    Login to Your Account
                </button>
            </div>
        </div>
    );
};

export default Index;
