import React from 'react';
import { X } from 'lucide-react';

interface AddGroupModalProps {
    setShowGroupForm: (value: boolean) => void;
    newGroup: {
        name: string;
        members: string[];
    };
    setNewGroup: React.Dispatch<React.SetStateAction<any>>;
    friends: string[];
    addGroup: () => void;
}

const AddGroupModal: React.FC<AddGroupModalProps> = ({
    setShowGroupForm,
    newGroup,
    setNewGroup,
    friends,
    addGroup
}) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl w-96 shadow-lg">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Create Group</h2>
                    <X onClick={() => setShowGroupForm(false)} className="cursor-pointer" />
                </div>

                <input
                    type="text"
                    placeholder="Group Name"
                    value={newGroup.name}
                    onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
                    className="w-full mb-3 px-4 py-2 border rounded-xl"
                />

                <p className="font-semibold mb-2">Select Members:</p>
                <div className="flex flex-wrap gap-2 mb-4">
                    {friends.map((friend, idx) => (
                        <label key={idx} className="flex items-center gap-1">
                            <input
                                type="checkbox"
                                checked={newGroup.members.includes(friend)}
                                onChange={(e) => {
                                    const checked = e.target.checked;
                                    setNewGroup((prev: any) => ({
                                        ...prev,
                                        members: checked
                                            ? [...prev.members, friend]
                                            : prev.members.filter((f: string) => f !== friend)
                                    }));
                                }}
                            />
                            {friend}
                        </label>
                    ))}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={() => setShowGroupForm(false)}
                        className="px-4 py-2 bg-gray-300 rounded-xl hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={addGroup}
                        className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600"
                    >
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddGroupModal;
