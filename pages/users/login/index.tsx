import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (!name) return; // Ignore inputs without name
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data: any = await userService.loginUser(formData);
            toast.success(data?.message);
            setFormData({ email: '', password: '' });
            if (data?.status === 200 && data?.success) {
                router.push('/');
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message);
        }
    };

    const handleSignUp = () => {
        router.push('/users/create');
    };

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side: Form Section */}
            <div className="p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-2 text-blue-600">Welcome Back!</h2>
                <p className="text-gray-600 mb-4">Login to your account and start managing your finances with ease.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                        Login
                    </button>
                </form>
                <p className="text-gray-600 mt-4">{`Don't have an account?`}<button onClick={handleSignUp} className="text-blue-600 hover:underline cursor-pointer">Sign up here</button>.</p>
            </div>

            {/* Right Side: Content Section */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-8 rounded-xl shadow-xl transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-green-600">New Here?</h2>
                <p className="text-gray-600 mb-6">Create an account to track your expenses, manage budgets, and generate detailed financial reports with ease.</p>
                <button onClick={handleSignUp} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">Create Your Account</button>
            </div>
        </div>
    );
}

export default Login;
