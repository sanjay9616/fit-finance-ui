import React from 'react';
import { X } from 'lucide-react';

interface SettleUpFormModalProps {
    setShowSettleUpForm: (show: boolean) => void;
    selectedGroup: {
        members: string[];
    };
    settleData: {
        from: string;
        to: string;
        amount: string;
    };
    setSettleData: (data: any) => void;
    settleUp: () => void;
}

const SettleUpFormModal: React.FC<SettleUpFormModalProps> = ({
    setShowSettleUpForm,
    selectedGroup,
    settleData,
    setSettleData,
    settleUp
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Settle Up</h2>
                    <X
                        onClick={() => setShowSettleUpForm(false)}
                        className="cursor-pointer"
                    />
                </div>

                <select
                    value={settleData.from}
                    onChange={(e) =>
                        setSettleData({ ...settleData, from: e.target.value })
                    }
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                >
                    <option value="">Who is paying?</option>
                    {selectedGroup.members.map((m, i) => (
                        <option key={i} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <select
                    value={settleData.to}
                    onChange={(e) =>
                        setSettleData({ ...settleData, to: e.target.value })
                    }
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                >
                    <option value="">Who receives?</option>
                    {selectedGroup.members.map((m, i) => (
                        <option key={i} value={m}>
                            {m}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    placeholder="Amount"
                    value={settleData.amount}
                    onChange={(e) =>
                        setSettleData({ ...settleData, amount: e.target.value })
                    }
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowSettleUpForm(false)}
                        className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={settleUp}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettleUpFormModal;
