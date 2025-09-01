import React from 'react';
import { X } from 'lucide-react';

interface AddEditExpenseModalProps {
    setShowForm: (value: boolean) => void;
    editId: number | null;
    newExpense: {
        title: string;
        amount: number | string;
        paidBy: string;
        splitBetween: string[];
    };
    setNewExpense: React.Dispatch<React.SetStateAction<any>>;
    selectedGroup: {
        members: string[];
    };
    addOrUpdateExpense: () => void;
}

const AddEditExpenseModal: React.FC<AddEditExpenseModalProps> = ({
    setShowForm,
    editId,
    newExpense,
    setNewExpense,
    selectedGroup,
    addOrUpdateExpense
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">{editId ? 'Edit Expense' : 'Add Expense'}</h2>
                    <X onClick={() => setShowForm(false)} className="cursor-pointer" />
                </div>

                <input
                    type="text"
                    placeholder="Expense Title"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                />

                <input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                />

                <select
                    value={newExpense.paidBy}
                    onChange={(e) => setNewExpense({ ...newExpense, paidBy: e.target.value })}
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                >
                    <option value="">Paid By</option>
                    {selectedGroup.members.map((friend, idx) => (
                        <option key={idx} value={friend}>{friend}</option>
                    ))}
                </select>

                <div className="mb-4">
                    <p className="font-semibold mb-2">Split Between:</p>
                    <div className="flex flex-wrap gap-2">
                        {selectedGroup.members.map((friend, idx) => (
                            <label key={idx} className="flex items-center gap-1">
                                <input
                                    type="checkbox"
                                    checked={newExpense.splitBetween.includes(friend)}
                                    onChange={(e) => {
                                        const checked = e.target.checked;
                                        setNewExpense((prev: any) => ({
                                            ...prev,
                                            splitBetween: checked
                                                ? [...prev.splitBetween, friend]
                                                : prev.splitBetween.filter((f: string) => f !== friend)
                                        }));
                                    }}
                                />
                                {friend}
                            </label>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowForm(false)}
                        className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addOrUpdateExpense}
                        className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                    >
                        {editId ? 'Update' : 'Add'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddEditExpenseModal;
