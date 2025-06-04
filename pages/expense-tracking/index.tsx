import React from 'react';
import { Wallet, BarChart, CheckCircle, Home } from 'lucide-react';
import Router from 'next/router';

const ExpenseTracking: React.FC = () => {

    const setTrackingStarted = () => {
        Router.push('/expense-tracking/start');
    };

    const goToHome = () => {
        Router.push('/');
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-8 w-full overflow-hidden min-h-[525px]">
            <div className="w-full max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left Section */}
                    <div>
                        <h1 className="text-4xl font-bold text-blue-600 mb-4">Expense Tracking</h1>
                        <p className="text-gray-700 text-lg mb-6">Easily categorize and monitor your expenses in real time.</p>
                        <div className="flex gap-4">
                            <button onClick={setTrackingStarted} className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300">
                                Start Tracking Now
                            </button>
                            <button onClick={goToHome} className="bg-gray-500 text-white py-3 px-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-300 flex items-center">
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </button>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center p-4 bg-white rounded-xl shadow-lg">
                            <Wallet className="text-blue-500 w-10 h-10 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">Categorize Expenses</h3>
                                <p className="text-gray-600 text-sm">Manage your spending by assigning categories to your expenses.</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded-xl shadow-lg">
                            <BarChart className="text-green-500 w-10 h-10 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">Real-Time Monitoring</h3>
                                <p className="text-gray-600 text-sm">Stay updated with live expense tracking and insights.</p>
                            </div>
                        </div>
                        <div className="flex items-center p-4 bg-white rounded-xl shadow-lg sm:col-span-2">
                            <CheckCircle className="text-purple-500 w-10 h-10 mr-4" />
                            <div>
                                <h3 className="text-lg font-semibold">Achieve Financial Goals</h3>
                                <p className="text-gray-600 text-sm">Set and achieve budgeting goals with actionable insights.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpenseTracking;
