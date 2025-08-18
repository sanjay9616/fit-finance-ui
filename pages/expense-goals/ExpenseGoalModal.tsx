import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Error from '@/components/Error';
import { ExpenseGoal, ExpenseType } from '@/config/interfaces';

interface Props {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: ExpenseGoal) => void;
  defaultValues?: ExpenseGoal;
}

const ExpenseGoalModal = ({ show, onClose, onSubmit, defaultValues }: Props) => {

  const { register, handleSubmit, formState: { errors } } = useForm<ExpenseGoal>({ defaultValues });

  const [expenseType, setExpenseType] = useState<ExpenseType>('Expense');

  useEffect(() => {
    if (defaultValues?.expenseType) {
      setExpenseType(defaultValues.expenseType);
    }
  }, [defaultValues]);

  const handleTagSelect = (selected: ExpenseType) => {
    setExpenseType(selected);
  };

  const handleFormSubmit = (data: ExpenseGoal) => {
    const finalData = {
      ...data,
      expenseType,
      targetAmount: Number(data.targetAmount),
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

        <h2 className="text-lg font-bold mb-4">{defaultValues ? 'Edit Expense Goal' : 'Add Expense Goal'}</h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="">

          <input
            {...register('category', { required: 'Category is required' })}
            placeholder="Category..."
            autoComplete="off"
            className="w-full border px-3 py-2 rounded"
          />
          <Error message={errors?.category?.message} />

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Amount</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTagSelect('Expense')}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Expense'
                    ? 'bg-red-100 text-red-700 border-red-400'
                    : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-red-50 hover:text-red-600'
                    }`}
                >
                  Expense
                </button>
                <button
                  type="button"
                  onClick={() => handleTagSelect('Income')}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Income'
                    ? 'bg-green-100 text-green-700 border-green-400'
                    : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-green-50 hover:text-green-600'
                    }`}
                >
                  Income
                </button>
                <button
                  type="button"
                  onClick={() => handleTagSelect('Saving')}
                  className={`px-2 py-0.5 rounded-full text-xs font-medium border transition ${expenseType === 'Saving'
                    ? 'bg-blue-100 text-blue-700 border-blue-400'
                    : 'bg-gray-100 text-gray-500 border-gray-300 hover:bg-blue-50 hover:text-blue-600'
                    }`}
                >
                  Saving
                </button>
              </div>

            </div>

            <div className="flex-1">
              <input
                type="number"
                step="0.01"
                {...register('targetAmount', { required: 'Target amount is required' })}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter target amount"
              />
              <Error message={errors?.targetAmount?.message} />
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

export default ExpenseGoalModal;
