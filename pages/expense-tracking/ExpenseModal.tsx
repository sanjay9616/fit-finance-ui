import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ExpenseFormData } from '@/config/interfaces';
import Error from '@/components/Error';
import toast from 'react-hot-toast';
import { debounce } from '@/config/utils';
import { expenseService } from '@/services/expenseService';
import { AppDispatch, RootState } from '@/store';
import { useDispatch, useSelector } from 'react-redux';
import { hideLoader, showLoader } from '@/store/slices/loaderSlice';

interface Props {
    show: boolean;
    onClose: () => void;
    onSubmit: (data: ExpenseFormData) => void;
    defaultValues?: ExpenseFormData;
}

const ExpenseModal = ({ show, onClose, onSubmit, defaultValues }: Props) => {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ExpenseFormData>({ defaultValues });

    const [tag, setTag] = useState<'income' | 'expense'>('expense');
    const amount = watch('amount');
    const [categorySearchStr, setCategorySearchStr] = useState('');
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    useEffect(() => {
        if (amount !== undefined && !isNaN(amount)) {
            if (amount < 0 && tag !== 'expense') setTag('expense');
            if (amount > 0 && tag !== 'income') setTag('income');
        }
    }, [amount, tag]);

    useEffect(() => {
        reset(defaultValues);
        if (defaultValues?.amount !== undefined) {
            setTag(defaultValues.amount < 0 ? 'expense' : 'income');
        }
    }, [defaultValues, reset]);

    const fetchCategories = useCallback(
        async (str: string) => {
            if (!user?.id) return;
            try {
                dispatch(showLoader());
                setValue('category', str); // from react-hook-form
                const res = await expenseService.getCategories(user.id, str);
                if (res?.status === 200 && res?.success) {
                    setSuggestions(res.data);
                } else {
                    toast.error(res.message);
                }
            } catch (error: any) {
                toast.error(error?.response?.data?.message || 'Error fetching categories');
            } finally {
                dispatch(hideLoader());
            }
        },
        [user?.id, setValue, dispatch]
    );

    const fetchCategoriesDebounce = useMemo(
        () => debounce((str: string) => fetchCategories(str), 300),
        [fetchCategories]
    );

    useEffect(() => {
        if (categorySearchStr.trim()) {
            fetchCategoriesDebounce(categorySearchStr);
        } else {
            setSuggestions([]);
        }
    }, [categorySearchStr, fetchCategoriesDebounce]);

    const handleTagSelect = (selected: 'income' | 'expense') => {
        setTag(selected);
        if (!isNaN(amount)) {
            const newAmount = selected === 'income' ? Math.abs(amount) : -Math.abs(amount);
            setValue('amount', newAmount);
        }
    };

    const handleSelect = (name: string) => {
        setCategorySearchStr('');
        setValue('category', name);
        setSuggestions([]);
    };

    const handleFormSubmit = (data: ExpenseFormData) => {
        const finalData = {
            ...data,
            amount: tag === 'income' ? Math.abs(data.amount) : -Math.abs(data.amount),
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
                        <label className="block text-sm font-medium mb-1">Category</label>
                        <input
                            {...register('category', { required: 'Category is required' })}
                            onChange={(e) => {
                                console.log("e.target.value", e.target.value);
                                setCategorySearchStr(e.target.value);
                            }}
                            onBlur={() => setSuggestions([])}
                            placeholder="Start typing to search or add..."
                            autoComplete="off"
                            className="w-full border px-3 py-2 rounded"
                        />
                        {suggestions?.length > 0 && (
                            <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-52 overflow-auto backdrop-blur-sm">
                                {suggestions.map((item: string, i: number) => (
                                    <li
                                        key={i}
                                        className="p-3 text-sm text-gray-800 hover:bg-blue-100 hover:text-blue-600 transition-all duration-150 ease-in-out cursor-pointer"
                                        onMouseDown={() => handleSelect(item)}
                                    >
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        )}
                        <Error message={errors?.category?.message} />
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <label className="block text-sm font-medium">Amount</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => handleTagSelect('income')}
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${tag === 'income'
                                        ? 'bg-green-100 text-green-700 border-green-400'
                                        : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-green-50 hover:text-green-600'
                                        }`}
                                >
                                    Income
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleTagSelect('expense')}
                                    className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${tag === 'expense'
                                        ? 'bg-red-100 text-red-700 border-red-400'
                                        : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-red-50 hover:text-red-600'
                                        }`}
                                >
                                    Expense
                                </button>

                            </div>
                        </div>

                        <input
                            type="number"
                            {...register('amount', { required: 'Amount is required' })}
                            className="w-full border px-3 py-2 rounded"
                        />
                        <Error message={errors?.amount?.message} />
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
