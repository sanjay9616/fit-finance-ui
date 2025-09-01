import { X } from "lucide-react";

interface FriendDetailsPopupProps {
    friend: {
        name: string;
        details: string[];
    };
    onClose: () => void;
}

export default function FriendDetailsPopup({ friend, onClose }: FriendDetailsPopupProps) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-96 shadow-lg relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
                >
                    <X className="w-5 h-5 text-gray-600" />
                </button>
                <h3 className="text-xl font-bold mb-4">{friend.name} - Details</h3>
                <div className="space-y-2">
                    {friend.details.map((line, i) => (
                        <p key={i} className="text-gray-700">• {line}</p>
                    ))}
                </div>
            </div>
        </div>
    );
}
