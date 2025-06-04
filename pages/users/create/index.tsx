import { userService } from '@/services/userService';
import Router from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

const Index = () => {

    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const data: any = await userService.createUser(formData);
            toast.success(data?.message);
            console.log("data", data);
            setMessage(`User created successfully: ${data.name}`);
            setFormData({ name: '', email: '', password: '' });
        } catch (error: any) {
            console.log("error", error);
            toast.error(error?.response?.data?.message);
            setMessage(error?.response?.data?.message || 'Failed to create user');
        }
    };

    const handleLogin = () => {
        Router.push('/users/login');
    }

    return (
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Side: Form Section */}
            <div className="p-8 bg-white shadow-xl rounded-xl transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-6 text-blue-600">Create a New User</h2>
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
                    <button className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer" type="submit">Create User</button>
                </form>

                {message && <p className="mt-4 text-red-500">{message}</p>}
            </div>

            {/* Right Side: Content Section */}
            <div className="bg-gradient-to-r from-green-100 to-green-200 p-8 rounded-xl shadow-xl transition-transform transform hover:scale-105">
                <h2 className="text-3xl font-bold mb-4 text-green-600">Already have an account?</h2>
                <p className="text-gray-600 mb-6">
                    If you already have an account, proceed to login and manage your data efficiently.
                </p>
                <button onClick={handleLogin} className="bg-green-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer">Login to Your Account</button>
            </div>
        </div>
    );
}

export default Index;