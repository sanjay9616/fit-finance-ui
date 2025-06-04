import { Edit, Save, Trash2, XCircle } from 'lucide-react';
import Router from 'next/router';
import React, { useState } from 'react';

interface Expense {
    id: number;
    name: string;
    email: string;
    amount: number;
    date: string;
}

const Index = () => {
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: 1, name: 'Salary', email: 'salary@example.com', amount: 61000, date: '2025-03-01' },
        { id: 2, name: 'Ashish', email: 'ashish@example.com', amount: -13036, date: '2025-03-05' },
        { id: 3, name: 'In Pocket', email: 'pocket@example.com', amount: -18000, date: '2025-03-10' },
        { id: 4, name: 'Saving', email: 'saving@example.com', amount: -16500, date: '2025-03-12' },
        { id: 5, name: 'Home', email: 'home@example.com', amount: -2000, date: '2025-03-15' },
        { id: 6, name: 'Vikas Udhar', email: 'vikas@example.com', amount: -3000, date: '2025-03-20' },
    ]);

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editedExpense, setEditedExpense] = useState<Expense | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    const showNotification = (message: string) => {
        setNotification(message);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleEditExpense = (id: number) => {
        const expenseToEdit = expenses.find((exp) => exp.id === id);
        if (expenseToEdit) {
            setEditingId(id);
            setEditedExpense({ ...expenseToEdit });
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditedExpense(null);
        showNotification('Edit canceled!');
    };

    const handleSaveExpense = () => {
        if (editedExpense) {
            setExpenses(expenses.map((exp) => (exp.id === editedExpense.id ? editedExpense : exp)));
            setEditingId(null);
            setEditedExpense(null);
            showNotification('Expense updated successfully!');
        }
    };

    const handleDeleteExpense = (id: number) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            setExpenses(expenses.filter((exp) => exp.id !== id));
            showNotification('Expense deleted successfully!');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 gap-6 w-full min-h-[525px] bg-white">
            {/* Notification */}
            {notification && (
                <div className="fixed top-5 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-bounce">
                    {notification}
                </div>
            )}

            <div className="w-full max-w-7xl">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-xl w-full">
                    {/* Total & Date Range */}
                    <div className="flex flex-col md:flex-row md:justify-between items-center gap-4 mb-4">
                        <div className="text-lg font-bold text-gray-700">
                            Total: <span className={total >= 0 ? 'text-green-600' : 'text-red-600'}>₹{total}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <input
                                type="date"
                                className="border border-gray-300 p-2 rounded w-full md:w-auto"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />
                            <span className="text-gray-500">to</span>
                            <input
                                type="date"
                                className="border border-gray-300 p-2 rounded w-full md:w-auto"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table Container */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                        <table className="w-full text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600 font-semibold">
                                    <th className="p-4 min-w-[100px]">Name</th>
                                    <th className="p-4 min-w-[150px]">Email</th>
                                    <th className="p-4 min-w-[100px]">Amount</th>
                                    <th className="p-4 min-w-[120px]">Date</th>
                                    <th className="p-4 min-w-[120px]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense) => (
                                    <tr
                                        key={expense.id}
                                        className="hover:bg-blue-50 transition-colors border-b border-gray-200"
                                    >
                                        <td className="p-4">
                                            {editingId === expense.id ? (
                                                <input
                                                    type="text"
                                                    className="border rounded-md px-2 py-1 w-full"
                                                    value={editedExpense?.name || ''}
                                                    onChange={(e) =>
                                                        setEditedExpense((prev) =>
                                                            prev ? { ...prev, name: e.target.value } : null
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className="text-gray-800">{expense.name}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === expense.id ? (
                                                <input
                                                    type="email"
                                                    className="border rounded-md px-2 py-1 w-full"
                                                    value={editedExpense?.email || ''}
                                                    onChange={(e) =>
                                                        setEditedExpense((prev) =>
                                                            prev ? { ...prev, email: e.target.value } : null
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className="text-gray-700">{expense.email}</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            {editingId === expense.id ? (
                                                <input
                                                    type="number"
                                                    className="border rounded-md px-2 py-1 w-full"
                                                    value={editedExpense?.amount || 0}
                                                    onChange={(e) =>
                                                        setEditedExpense((prev) =>
                                                            prev ? { ...prev, amount: Number(e.target.value) } : null
                                                        )
                                                    }
                                                />
                                            ) : (
                                                <span className={expense.amount < 0 ? 'text-red-500' : 'text-green-600'}>
                                                    {expense.amount < 0
                                                        ? `-₹${Math.abs(expense.amount)}`
                                                        : `₹${expense.amount}`}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-gray-600">{expense.date}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {editingId === expense.id ? (
                                                    <>
                                                        <Save
                                                            className="text-green-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={handleSaveExpense}
                                                        />
                                                        <XCircle
                                                            className="text-gray-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={handleCancelEdit}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Edit
                                                            className="text-blue-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={() => handleEditExpense(expense.id)}
                                                        />
                                                        <Trash2
                                                            className="text-red-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform"
                                                            onClick={() => handleDeleteExpense(expense.id)}
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Save All Button */}
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-3 mt-4">
                        {/* Save & Cancel Group */}
                        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                            {/* Save Button */}
                            <button
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 w-full sm:w-auto"
                                onClick={() => Router.push('/expense-tracking')}
                            >
                                Save
                            </button>

                            {/* Cancel Button (Appears to the right on laptops) */}
                            <button
                                className="bg-red-500 text-white px-5 py-2 rounded-lg shadow-md hover:bg-red-600 w-full sm:w-auto"
                                onClick={() => Router.push('/expense-tracking')}
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Add Button (Aligned to the right) */}
                        <button
                            className="bg-green-600 text-white px-5 py-2 rounded-lg shadow-md hover:bg-green-700 w-full sm:w-auto lg:ml-auto"
                            onClick={() => Router.push('/expense-tracking')}
                        >
                            Add
                        </button>
                    </div>


                </div>
            </div>
        </div>
    );
};

export default Index;
