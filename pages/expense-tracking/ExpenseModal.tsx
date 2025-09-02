import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExpenseFormData, ExpenseType } from '@/config/interfaces';
import Error from '@/components/Error';
import toast from 'react-hot-toast';
import { expenseService } from '@/services/expenseService';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';
import { MESSAGE } from '@/config/mesage';

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
    defaultValues?: ExpenseFormData;
}

const ExpenseModal = ({ show, onClose, onSubmit, defaultValues }: Props) => {

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<ExpenseFormData>({ defaultValues });
    const [expenseType, setExpenseType] = useState<ExpenseType>('Expense');
    const [categoryList, setCategoryList] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (defaultValues?.expenseType) {
            setExpenseType(defaultValues.expenseType);
        }
    }, [defaultValues]);

    useEffect(() => {
        if (defaultValues?.category && categoryList.length > 0) {
            setValue('category', defaultValues.category);
        }
    }, [defaultValues?.category, categoryList, setValue]);

    const getCategoryList = useCallback(async (str: string, userId: number) => {
        try {
            dispatch(showLoader());
            const res = await expenseService.getCategories(userId, str, defaultValues?.createdAt ?? new Date().getTime());
            if (res?.status === 200 && res?.success) {
                const sorted = (res.data || []).sort((a: string, b: string) => a.localeCompare(b));
                setCategoryList(sorted);
            } else {
                toast.error(res.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
        } finally {
            dispatch(hideLoader());
        }
    }, [dispatch, defaultValues?.createdAt]);

    useEffect(() => {
        if (user?.id) getCategoryList('', user.id);
    }, [getCategoryList, user?.id]);

    const handleCategorySelect = async (category: string) => {
        try {
            if (!user?.id) return;
            dispatch(showLoader());
            const res = await expenseService.getExpenseGoalsByCategory(user?.id, category, defaultValues?.createdAt ?? (new Date()).getTime());
            if (res?.status === 200 && res?.success) {
                setValue('description', res?.data?.description);
                setExpenseType(res?.data?.expenseType);
            } else {
                toast.error(res.message);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || MESSAGE.ERROR.SERVER_ERROR);
        } finally {
            dispatch(hideLoader());
        }
    }

    const handleFormSubmit = (data: ExpenseFormData) => {
        const finalData = {
            ...data,
            expenseType,
            amount: Number(data.amount),
        };
        onSubmit(finalData);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="relative bg-white rounded-xl shadow-2xl p-4 max-w-md w-full mx-2">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-3 text-gray-500 hover:text-red-600 text-xl font-bold z-10"
                >
                    &times;
                </button>

                <h2 className="text-lg font-bold mb-4">{defaultValues ? 'Edit Expense' : 'Add Expense'}</h2>

                <form onSubmit={handleSubmit(handleFormSubmit)} className="">

                    <div className="relative">
                        <input
                            type="text"
                            {...register('name', { required: 'Name is required' })}
                            className="w-full border px-3 py-2 rounded"
                            placeholder="Enter Name"
                        />
                        <Error message={errors?.name?.message} />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Amount</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Expense'
                                        ? 'bg-red-100 text-red-700 border-red-400'
                                        : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Income'
                                        ? 'bg-green-100 text-green-700 border-green-400'
                                        : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                >
                                    Income
                                </button>
                                <button
                                    type="button"
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Saving'
                                        ? 'bg-blue-100 text-blue-700 border-blue-400'
                                        : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                                        }`}
                                >
                                    Saving
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('amount', { required: 'Amount is required' })}
                                    className="w-full border px-3 py-2 rounded"
                                    placeholder="Enter amount"
                                />
                                <Error message={errors?.amount?.message} />
                            </div>

                            <div className="flex-1">
                                <select
                                    {...register('category', { required: 'Category is required' })}
                                    className="w-full border px-3 py-2 rounded bg-white"
                                    defaultValue=""
                                    onChange={(e) => handleCategorySelect(e.target.value)}
                                >
                                    <option value="" disabled>
                                        Select Category...
                                    </option>
                                    {categoryList?.map((item: string, i: number) => (
                                        <option key={i} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>

                                <Error message={errors?.category?.message} />
                            </div>

                        </div>

                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            {...register('description')}
                            className="w-full border px-3 py-2 rounded resize-none"
                            rows={3}
                            placeholder="Enter a brief description"
                        />
                    </div>

                    <div className="flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100 transition"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                        >
                            {defaultValues ? 'Update' : 'Add'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ExpenseModal;
