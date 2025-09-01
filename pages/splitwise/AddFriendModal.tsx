import React from 'react';
import { X } from 'lucide-react';

interface AddFriendModalProps {
    setShowFriendForm: (show: boolean) => void;
    newFriend: string;
    setNewFriend: (value: string) => void;
    addFriend: () => void;
    selectedGroup: { name: string } | null;
}

const AddFriendModal: React.FC<AddFriendModalProps> = ({
    setShowFriendForm,
    newFriend,
    setNewFriend,
    addFriend,
    selectedGroup
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-80 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">
                        Add Friend {selectedGroup ? `to ${selectedGroup.name}` : ''}
                    </h2>
                    <X onClick={() => setShowFriendForm(false)} className="cursor-pointer" />
                </div>

                <input
                    type="text"
                    placeholder="Friend's Name"
                    value={newFriend}
                    onChange={(e) => setNewFriend(e.target.value)}
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                />

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowFriendForm(false)}
                        className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addFriend}
                        className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                        Add
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddFriendModal;
