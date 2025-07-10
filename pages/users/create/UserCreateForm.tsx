import React, { useState } from 'react';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';
import Router from 'next/router';

const UserCreateForm = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data: any = await userService.createUser(formData);
            toast.success(data?.message);
            setFormData({ name: '', email: '', password: '' });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'User creation failed');
        }
    };

    const handleLogin = () => {
        Router.push('/users/login');
    }

    return (
        <div className="w-full p-4 md:p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-blue-600">Create a New User</h2>
            <p className="text-gray-600 mb-2">
                Join now to track your expenses.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    className="border p-3 w-full rounded-lg focus:ring-2 focus:ring-blue-400 transition"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
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
                <p className="text-gray-600 text-sm">
                    Already have an account?{' '}
                    <button
                        type="button"
                        onClick={handleLogin}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Login here
                    </button>
                    .
                </p>
                <button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">
                    Create User
                </button>
            </form>
        </div>
    );
};

export default UserCreateForm;
