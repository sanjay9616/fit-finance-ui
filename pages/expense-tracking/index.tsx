import { Expense, ExpenseFormData } from '@/config/interfaces';
import { MESSAGE } from '@/config/mesage';
import { expenseService } from '@/services/expenseService';
import { RootState } from '@/store';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ExpenseModal from './ExpenseModal';

const Index = () => {
    const range: string[] = ["Today", "This Week", "Last Week", "This Month", "Last Month", "This Year", "Last Year", "All Time"];
    const [expenses, setExpenses] = useState<Expense[]>([
        {
            "_id": "68710ed68a81fb0b3fc52fc7",
            "category": "Rent",
            "name": "Chicken",
            "expenseType": 'Income',
            "amount": 12,
            "description": "mdm",
            "createdAt": 1752239830434,
            "updatedAt": 1752239830434,
        },
    ]);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editedExpense, setEditedExpense] = useState<Expense | null>(null);
    const [selectedRange, setSelectedRange] = useState('This Month');
    const [showModal, setShowModal] = useState(false);
    const { reset } = useForm<ExpenseFormData>({ mode: 'onTouched' });
    const user = useSelector((state: RootState) => state.auth.user);
    const dispatch = useDispatch();

    const [avgExpenses, setAvgExpenses] = useState(0);

    const totalIncome = expenses.filter((expense) => expense.expenseType === 'Income').reduce((sum, expense) => sum + expense.amount, 0);
    const totalExpense = expenses.filter((expense) => expense.expenseType === 'Expense').reduce((sum, expense) => sum + expense.amount, 0);
    const totalSaving = expenses.filter((expense) => expense.expenseType === 'Saving').reduce((sum, expense) => sum + expense.amount, 0);
    const totalBalance = totalIncome - totalExpense - totalSaving;
    // const spendTransactions = expenses.filter((expense) => expense.expenseType === 'Expense');
    // const averageSpendAmount = spendTransactions.length ? Math.abs(totalExpense / spendTransactions.length) : 0;


    const headerCards = [
        {
            title: 'Total Expense',
            value: `₹${totalExpense.toLocaleString('en-IN')}`,
            icon: '💸',
            textColor: totalExpense >= 0 ? 'text-green-600' : 'text-red-600',
            bg: 'from-red-50 to-white',
        },
        {
            title: 'Total Income',
            value: `₹${totalIncome.toLocaleString('en-IN')}`,
            icon: '💰',
            textColor: 'text-green-600',
            bg: 'from-green-50 to-white',
        },
        {
            title: 'Total Balance',
            value: `${totalBalance.toLocaleString('en-IN')}`,
            icon: '📊',
            textColor: totalBalance >= 0 ? 'text-green-600' : 'text-red-600',
            bg: 'from-blue-50 to-white',
        },
        {
            title: 'Average Daily Spend',
            value: `₹${avgExpenses.toFixed(0)}`,
            icon: '🪙',
            textColor: 'text-orange-500',
            bg: 'from-yellow-50 to-white',
        },
    ];

    const fetchExpenses = useCallback(async () => {
        if (!user?.id) return;

        dispatch(showLoader());

        const { from, to } = getDateRange(selectedRange);
        try {
            const res = await expenseService.getAllExpenses(user.id, from, to);
            if (res?.status === 200 && res?.success) {
                setExpenses(res.data);
            } else {
                toast.error(res.message);
            }
        } catch (error: any) {
            console.error('Error fetching expenses:', error);
            toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
        } finally {
            dispatch(hideLoader());
        }
    }, [user?.id, selectedRange, dispatch]);

    useEffect(() => {
        fetchExpenses();
    }, [fetchExpenses]);

    useEffect(() => {
        const { from, to } = getDateRange(selectedRange);
        const daysInRange = Math.max(1, Math.ceil((to - from) / (1000 * 60 * 60 * 24)));
        const averageSpendAmount = totalExpense > 0 ? Math.abs(totalExpense / daysInRange) : 0;
        setAvgExpenses(averageSpendAmount);
      }, [expenses, selectedRange, totalExpense]);

    const handleEditExpense = (i: number) => {
        setEditingIndex(i);
        setEditedExpense({ ...expenses[i] });
        setShowModal(true);
    };

    const handleModalClose = () => {
        setEditingIndex(null);
        setEditedExpense(null);
        setShowModal(false);
        reset();
    };

    const updateExitingExpense = async (data: ExpenseFormData) => {
        if (editingIndex !== null && expenses[editingIndex]?._id) {
            dispatch(showLoader());
            try {
                const updated = { ...expenses[editingIndex], ...data };
                const res = await expenseService.updateExpense(updated._id!, updated);
                if (res?.status === 200 && res?.success) {
                    const updatedExpenses = [...expenses];
                    updatedExpenses[editingIndex] = res.data;
                    setExpenses(updatedExpenses);
                    toast.success(res?.message);
                    handleModalClose();
                } else {
                    toast.error(res?.message);
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
            } finally {
                dispatch(hideLoader());
            }
        } else {
            toast.error('Expense ID is missing or invalid');
        }
    };

    const handleDeleteExpense = async (i: number) => {
        const expenseToDelete = expenses[i];
        if (!expenseToDelete || !expenseToDelete._id) {
            toast.error('Expense ID not found.');
            return;
        }

        if (window.confirm('Are you sure you want to delete this expense?')) {
            dispatch(showLoader());

            try {
                const res = await expenseService.deleteExpense(expenseToDelete._id);
                if (res?.status === 200 && res?.success) {
                    setExpenses(prev => prev.filter((_, index) => index !== i));
                    toast.success(res?.message);
                } else {
                    toast.error(res?.message);
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
            } finally {
                dispatch(hideLoader());
            }
        }
    };

    const addNewExpense = async (data: ExpenseFormData) => {
        dispatch(showLoader());

        try {
            const payload: any = { ...data, userId: user?.id };
            const res: any = await expenseService.addNewExpense(payload);

            if (res?.status === 200 && res?.success) {
                const data: Expense = res?.data;
                setExpenses((prev) => [data, ...prev]);
                toast.success(res?.message);
                reset();
                setShowModal(false);
            } else {
                toast.error(res?.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Something went wrong!');
        } finally {
            dispatch(hideLoader());
        }
    };

    const getDateRange = (label: string): { from: number, to: number } => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        let from = new Date(today);
        let to = new Date(today);

        switch (label) {
            case 'Today':
                break;
            case 'This Week':
                from.setDate(today.getDate() - today.getDay());
                break;
            case 'Last Week':
                from.setDate(today.getDate() - today.getDay() - 7);
                to.setDate(today.getDate() - today.getDay() - 1);
                break;
            case 'This Month':
                from = new Date(today.getFullYear(), today.getMonth(), 1);
                break;
            case 'Last Month':
                from = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                to = new Date(today.getFullYear(), today.getMonth(), 0);
                break;
            case 'This Year':
                from = new Date(today.getFullYear(), 0, 1);
                break;
            case 'Last Year':
                from = new Date(today.getFullYear() - 1, 0, 1);
                to = new Date(today.getFullYear() - 1, 11, 31);
                break;
            case 'All Time':
                from = new Date(2000, 0, 1);
                to = new Date();
                break;
            default:
                break;
        }

        return { from: from.getTime(), to: to.getTime() + 86400000 - 1 }; // end of day
    };

    return (
        <div className="flex flex-col items-center gap-6 w-full min-h-[525px] bg-white">

            {showModal && (
                <ExpenseModal
                    show={showModal}
                    onClose={handleModalClose}
                    onSubmit={editingIndex !== null ? updateExitingExpense : addNewExpense}
                    defaultValues={editedExpense as unknown as ExpenseFormData}
                />
            )}

            <div className="w-full max-w-7xl">
                <div className="w-full max-w-7xl mx-auto sm:px-6 lg:px-8 py-0">

                    <div className="w-full mb-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex flex-col gap-1 sm:gap-2 w-full md:w-auto">
                                <div className="flex items-center gap-0">
                                    <button
                                        onClick={() => Router.push('/')}
                                        className="rounded-full hover:bg-gray-200 transition p-1"
                                    >
                                        <ArrowLeft className="w-5 h-5 text-gray-700" />
                                    </button>
                                    <h2 className="text-base sm:text-xl font-semibold text-gray-800">
                                        Track Your Daily Expenses
                                    </h2>
                                </div>
                                <p className="text-gray-500 text-sm sm:text-base hidden sm:block">
                                    Easily categorize and monitor your expenses in real time.
                                </p>
                            </div>
                            <div className="flex flex-row flex-wrap justify-between sm:justify-end items-center gap-2 w-full md:w-auto">
                                <select
                                    className="flex-1 min-w-[120px] max-w-[180px] border border-gray-300 px-2 py-2 rounded-md text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={selectedRange}
                                    onChange={(e) => setSelectedRange(e.target.value)}
                                >
                                    {range.map((date: string) => (
                                        <option key={date}>{date}</option>
                                    ))}
                                </select>

                                <button
                                    className="flex-1 min-w-[120px] max-w-[180px] px-3 py-2 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 transition"
                                    onClick={() => setShowModal(true)}
                                >
                                    + Add Entry
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* For Tablet and Desktop: Grid layout */}
                    <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {headerCards.map((item, idx) => (
                            <div key={idx} className={`bg-gradient-to-br ${item.bg} border rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl transition-transform group-hover:scale-125">{item.icon}</div>
                                    <p className="text-sm text-gray-500">{item.title}</p>
                                </div>
                                <p className={`mt-3 text-xl font-bold ${item.textColor}`}>{item.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* For Mobile: Horizontal scrollable container */}
                    <div className="sm:hidden overflow-x-auto">
                        <div className="flex gap-3 w-max">
                            {headerCards.map((item, idx) => (
                                <div key={idx} className={`min-w-[180px] bg-gradient-to-br ${item.bg} border rounded-lg p-3 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
                                    <div className="flex items-center gap-2">
                                        <div className="text-xl">{item.icon}</div>
                                        <p className="text-xs text-gray-600">{item.title}</p>
                                    </div>
                                    <p className={`mt-2 text-lg font-semibold ${item.textColor}`}>{item.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 🖥️ Desktop Table View */}
                    <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm hidden sm:block mt-4">
                        <table className="w-full table-fixed text-sm md:text-base">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600 font-semibold">
                                    <th className="p-4 w-[20%]">Name</th>
                                    <th className="p-4 w-[20%]">Category</th>
                                    <th className="p-4 w-[15%]">Amount</th>
                                    <th className="p-4 w-[20%]">Date</th>
                                    <th className="p-4 w-[30%]">Description</th>
                                    <th className="p-4 w-[15%]">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {expenses.map((expense, i: number) => (
                                    <tr key={i} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                                        <td className="p-4">
                                            <span className="text-gray-800">{expense.name}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-gray-800">{expense.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <span className={expense.amount < 0 ? 'text-red-500' : 'text-green-600'}>
                                                {expense.amount < 0 ? `-₹${Math.abs(expense.amount)}` : `₹${expense.amount}`}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-600">{new Date(expense.createdAt).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            <span
                                                className="text-gray-800 truncate block max-w-[250px] whitespace-nowrap overflow-hidden"
                                                title={expense?.description ?? ''}
                                            >
                                                {expense.description || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <Edit
                                                    className="text-blue-500 w-5 h-5 cursor-pointer hover:scale-110"
                                                    onClick={() => handleEditExpense(i)}
                                                />
                                                <Trash2
                                                    className="text-red-500 w-5 h-5 cursor-pointer hover:scale-110"
                                                    onClick={() => handleDeleteExpense(i)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="sm:hidden space-y-3 mt-4">
                        {expenses.map((expense, i: number) => (
                            <div key={i} className="border border-gray-200 rounded-lg px-4 py-3 bg-white shadow-sm" >
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-sm font-medium text-gray-800">
                                        <span>{expense.name}</span>
                                        <span className="ml-1 px-1 py-0.5 rounded-full text-xs font-medium border transition bg-green-100 text-green-700 border-green-400">
                                            {expense.category}
                                        </span>
                                    </div>
                                    <div className={`text-sm font-semibold ${expense.amount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                        {expense.amount < 0 ? `-₹${Math.abs(expense.amount)}` : `₹${expense.amount}`}
                                    </div>
                                </div>
                                {expense.description && (
                                    <div className="text-xs text-gray-500 truncate mb-1">{expense.description}</div>
                                )}
                                <div className="flex items-center justify-between text-xs text-gray-400">
                                    <span>{new Date(expense.createdAt).toLocaleDateString()}</span>
                                    <div className="flex gap-2">
                                        <button
                                            className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 transition"
                                            onClick={() => handleEditExpense(i)}
                                        >
                                            <Edit className="w-4 h-4 text-blue-600" />
                                        </button>
                                        <button
                                            className="p-1 rounded-full bg-red-100 hover:bg-red-200 transition"
                                            onClick={() => handleDeleteExpense(i)}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Index;
