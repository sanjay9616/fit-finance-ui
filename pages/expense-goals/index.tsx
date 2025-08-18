import { getProgressColor, MONTHS, YEARS } from '@/config/constant';
import { ExpenseGoal, ExpenseHeaderCard, ExpenseType } from '@/config/interfaces';
import { MESSAGE } from '@/config/mesage';
import { expenseGoalService } from '@/services/expenseGoalService';
import { RootState } from '@/store';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import { ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Router from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import ExpenseGoalModal from './ExpenseGoalModal';

const ExpenseGoals = () => {

  const dispatch = useDispatch();

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showModal, setShowModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editedExpense, setEditedExpense] = useState<ExpenseGoal | null>(null);
  const { reset } = useForm<ExpenseGoal>({ mode: 'onTouched' });
  const user = useSelector((state: RootState) => state.auth.user);
  const [expenses, setExpenses] = useState<ExpenseGoal[]>([]);

  const getTotal = (type: ExpenseType, field: 'targetAmount' | 'currentAmount') =>
    expenses.filter((e) => e.expenseType === type).reduce((sum, e) => sum + e[field], 0);


  const totalIncomeTarget = getTotal('Income', 'targetAmount');
  const totalIncome = getTotal('Income', 'currentAmount');
  const totalExpenseTarget = getTotal('Expense', 'targetAmount');
  const totalExpense = getTotal('Expense', 'currentAmount');
  const totalSavingTarget = getTotal('Saving', 'targetAmount');
  const totalSaving = getTotal('Saving', 'currentAmount');
  const totalBalanceTarget = totalIncomeTarget - totalExpenseTarget - totalSavingTarget;
  const totalBalance = totalIncome - totalExpense - totalSaving;

  const safePercent = (num: number, total: number) =>
    total === 0 ? 0 : Math.round((Math.abs(num) / Math.abs(total)) * 100);

  const headerCards: ExpenseHeaderCard[] = [
    {
      title: 'Total Income',
      subTitle: 'Earnings received',
      targetAmount: `₹${totalIncomeTarget.toLocaleString('en-IN')}`,
      currentAmount: `₹${totalIncome.toLocaleString('en-IN')}`,
      achieved: safePercent(totalIncome, totalIncomeTarget),
      achievedText: `${safePercent(totalIncome, totalIncomeTarget)}% Achieved`,
      progressBarColor: getProgressColor(safePercent(totalIncome, totalIncomeTarget)),
      icon: '💰',
      textColor: 'text-green-600',
      bg: 'from-green-50 to-white',
    },
    {
      title: 'Total Expense',
      subTitle: 'Spending so far',
      targetAmount: `₹${Math.abs(totalExpenseTarget).toLocaleString('en-IN')}`,
      currentAmount: `₹${Math.abs(totalExpense).toLocaleString('en-IN')}`,
      achieved: safePercent(totalExpense, totalExpenseTarget),
      achievedText: `${safePercent(totalExpense, totalExpenseTarget)}% Achieved`,
      progressBarColor: getProgressColor(safePercent(totalExpense, totalExpenseTarget)),
      icon: '💸',
      textColor: 'text-red-600',
      bg: 'from-red-50 to-white',
    },
    {
      title: 'Total Savings',
      subTitle: 'Saving Money',
      targetAmount: `₹${totalSavingTarget.toLocaleString('en-IN')}`,
      currentAmount: `₹${totalSaving.toLocaleString('en-IN')}`,
      achieved: safePercent(totalSaving, totalSavingTarget),
      achievedText: `${safePercent(totalSaving, totalSavingTarget)}% Achieved`,
      progressBarColor: getProgressColor(safePercent(totalSaving, totalSavingTarget)),
      icon: '📊',
      textColor: 'text-emerald-600',
      bg: 'from-blue-50 to-white',
    },
    {
      title: 'Total Balance',
      subTitle: 'Money in hand',
      targetAmount: `₹${totalBalanceTarget.toLocaleString('en-IN')}`,
      currentAmount: `₹${totalBalance.toLocaleString('en-IN')}`,
      achieved: safePercent(totalBalance, totalBalanceTarget),
      achievedText: `${safePercent(totalBalance, totalBalanceTarget)}% Achieved`,
      progressBarColor: getProgressColor(safePercent(totalBalance, totalBalanceTarget)),
      icon: '📊',
      textColor: 'text-emerald-600',
      bg: 'from-blue-50 to-white',
    },
  ];


  const calculatePercentage = (currentAmount: number, targetAmount: number) => {
    if (targetAmount === 0) return currentAmount > 0 ? 150 : 0;
    return Math.min((Math.abs(currentAmount) / Math.abs(targetAmount)) * 100, 150);
  };

  const getStatusLabel = (percent: number) => {
    if (percent < 100) return `${percent.toFixed(0)}% of target used`;
    if (percent === 100) return `100% - Target met`;
    return `${percent.toFixed(0)}% - Over budget`;
  };

  const handleModalClose = () => {
    setEditingIndex(null);
    setEditedExpense(null);
    setShowModal(false);
    reset();
  };

  const fetchExpenses = useCallback(async () => {
    if (!user?.id) return;

    dispatch(showLoader());

    const startDate = new Date(selectedYear, selectedMonth, 1).getTime();
    const endDate = new Date(selectedYear, selectedMonth + 1, 0, 23, 59, 59, 999).getTime();

    try {
      const res = await expenseGoalService.getAllExpensesGoal(user.id, startDate, endDate);
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
  }, [user?.id, selectedMonth, selectedYear, dispatch]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const updateExitingExpense = async (data: ExpenseGoal) => {
    if (editingIndex !== null && expenses[editingIndex]?._id) {
      dispatch(showLoader());
      try {
        const updated = { ...expenses[editingIndex], ...data };
        const res = await expenseGoalService.updateExpenseGoal(updated._id!, updated);
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

  const addNewExpense = async (data: ExpenseGoal) => {
    dispatch(showLoader());

    try {
      const payload: any = { ...data, userId: user?.id };
      const res: any = await expenseGoalService.addNewExpenseGoal(payload);

      if (res?.status === 200 && res?.success) {
        const data: ExpenseGoal = res?.data;
        setExpenses((prev) => [...prev, data]);
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

  const handleEditExpense = (i: number) => {
    setEditingIndex(i);
    setEditedExpense({ ...expenses[i] });
    setShowModal(true);
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
        const res = await expenseGoalService.deleteExpenseGoal(expenseToDelete._id);
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

  return (
    <div className="flex flex-col items-center w-full bg-white">

      {showModal && (
        <ExpenseGoalModal
          show={showModal}
          onClose={handleModalClose}
          onSubmit={editingIndex !== null ? updateExitingExpense : addNewExpense}
          defaultValues={editedExpense as unknown as ExpenseGoal}
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
                    Set Your Monthly Expense Targets
                  </h2>
                </div>
                <p className="text-gray-500 text-sm sm:text-base hidden sm:block">
                  Plan ahead by setting your monthly spending limits. Stay focused and track how close you are to reaching your target.
                </p>
              </div>
              <div className="flex flex-row flex-wrap justify-between sm:justify-end items-center gap-2 w-full md:w-auto">

                <div className="flex gap-2">
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(Number(e.target.value))}>
                    {MONTHS.map((month, index) => (
                      <option key={index} value={index}>{month}</option>
                    ))}
                  </select>
                  <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}>
                    {YEARS.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="flex-1 min-w-[120px] max-w-[180px] px-3 py-2 bg-blue-600 text-white text-sm rounded-md shadow hover:bg-blue-700 transition"
                  onClick={() => setShowModal(true)}>
                  + Add Target
                </button>
              </div>
            </div>
          </div>

          {/* For Tablet and Desktop: Grid layout */}
          <div className="hidden sm:block w-full py-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-2">
              {headerCards.map((item, idx) => (
                <div key={idx} className={`relative bg-gradient-to-br ${item.bg} border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1`}>
                  <div className="absolute top-4 right-4 w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" cx="18" cy="18" r="15.9155" />
                      <circle stroke={item.progressBarColor} strokeWidth="3" fill="none" strokeDasharray={`${Math.min(100, item.achieved)} 100`} strokeLinecap="round" cx="18" cy="18" r="15.9155" transform="rotate(-90 18 18)" />
                      <text x="18" y="20.35" className="fill-gray-800 text-[9px] font-semibold" textAnchor="middle" dominantBaseline="middle">
                        {Math.min(100, item.achieved)}%
                      </text>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      {item.subTitle && (<p className="text-[11px] text-gray-500">{item.subTitle}</p>)}
                    </div>
                  </div>
                  <div className="mt-1 text-[13px] text-gray-700">
                    <div className="flex justify-between">
                      <p><span className="font-semibold">Target:</span> {item.targetAmount}</p>
                      <p><span className="font-semibold">Now:</span> {item.currentAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sm:hidden overflow-x-auto">
            <div className="flex gap-4 w-max">
              {headerCards.map((item, idx) => (
                <div key={idx} className={`relative min-w-[230px] max-w-[260px] bg-gradient-to-br ${item.bg} border border-gray-200 rounded-2xl p-4 shadow-md hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-1`}>
                  <div className="absolute top-4 right-4 w-12 h-12">
                    <svg className="w-full h-full" viewBox="0 0 36 36">
                      <circle className="text-gray-200" stroke="currentColor" strokeWidth="3" fill="none" cx="18" cy="18" r="15.9155" />
                      <circle stroke={item.progressBarColor} strokeWidth="3" fill="none" strokeDasharray={`${Math.min(100, item.achieved)} 100`} strokeLinecap="round" cx="18" cy="18" r="15.9155" transform="rotate(-90 18 18)" />
                      <text x="18" y="20.35" className="fill-gray-800 text-[9px] font-semibold" textAnchor="middle" dominantBaseline="middle">
                        {Math.min(100, item.achieved)}%
                      </text>
                    </svg>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="text-2xl">{item.icon}</div>
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      {item.subTitle && (<p className="text-[11px] text-gray-500">{item.subTitle}</p>)}
                    </div>
                  </div>
                  <div className="mt-1 text-[13px] text-gray-700">
                    <div className="flex justify-between">
                      <p><span className="font-semibold">Target:</span> {item.targetAmount}</p>
                      <p><span className="font-semibold">Now:</span> {item.currentAmount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 🖥️ Desktop Table View */}
          <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm hidden sm:block mt-4">
            <table className="w-full table-fixed text-sm md:text-base">
              <thead>
                <tr className="bg-gray-50 text-left text-gray-600 font-semibold">
                  <th className="p-4 w-[20%]">Category</th>
                  <th className="p-4 w-[15%]">Amount</th>
                  <th className="p-4 w-[20%]">Status</th>
                  <th className="p-4 w-[30%]">Description</th>
                  <th className="p-4 w-[15%]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {expenses.map((expense, i: number) => (
                  <tr key={i} className="hover:bg-blue-50 transition-colors border-b border-gray-200">
                    <td className="p-4">
                      <span className="text-gray-800">{expense.category}</span>
                    </td>
                    <td className="p-4">
                      <span className={expense.currentAmount < 0 ? 'text-red-500' : 'text-green-600'}>
                        {`₹${Math.abs(expense.currentAmount).toLocaleString('en-IN')} of ₹${Math.abs(expense.targetAmount).toLocaleString('en-IN')}`}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">
                      <div className="w-full mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div className={`h-full rounded-full ${calculatePercentage(expense.currentAmount, expense.targetAmount) < 100 ? 'bg-green-500' : calculatePercentage(expense.currentAmount, expense.targetAmount) === 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                          style={{ width: `${Math.min(calculatePercentage(expense.currentAmount, expense.targetAmount), 150)}%` }}>
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        {getStatusLabel(calculatePercentage(expense.currentAmount, expense.targetAmount))}
                      </div>

                    </td>
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
                  <div className="text-sm font-medium text-gray-800">{expense.category}</div>
                  <div className={`text-sm font-semibold ${expense.currentAmount < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    {`₹${Math.abs(expense.currentAmount).toLocaleString('en-IN')} of ₹${Math.abs(expense.targetAmount).toLocaleString('en-IN')}`}
                  </div>
                </div>
                {expense.description && (
                  <div className="text-xs text-gray-500 truncate mb-1">{expense.description}</div>
                )}
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div>
                    <div className="w-full mt-2 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div className={`h-full rounded-full ${calculatePercentage(expense.currentAmount, expense.targetAmount) < 100 ? 'bg-green-500' : calculatePercentage(expense.currentAmount, expense.targetAmount) === 100 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${Math.min(calculatePercentage(expense.currentAmount, expense.targetAmount), 150)}%` }}>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {getStatusLabel(calculatePercentage(expense.currentAmount, expense.targetAmount))}
                    </div>
                  </div>
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

export default ExpenseGoals;
