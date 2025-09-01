import React, { useState } from 'react';
import {
    Plus,
    Users,
    Trash2,
    Edit,
    FolderPlus,
    User,
    Info,
    Menu,
    X
} from 'lucide-react';
import AddFriendModal from './AddFriendModal';
import AddEditExpenseModal from './AddEditExpenseModal';
import AddGroupModal from './AddGroupModal';
import SettleUpFormModal from './SettleUpFormModal';
import FriendDetailsPopup from './FriendDetailsPopup';

interface Group {
    id: number;
    name: string;
    members: string[];
}

interface Expense {
    id: number;
    title: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
    groupId: number;
}

interface ExpenseForm {
    title: string;
    amount: string;
    paidBy: string;
    splitBetween: string[];
    groupId: number | null;
}

interface OweItem {
    from: string;
    to: string;
    amount: number;
}

const Splitwise: React.FC = () => {
    const [friends, setFriends] = useState<string[]>(['You', 'Alice', 'Bob']);
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

    const [showSidebar, setShowSidebar] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [newExpense, setNewExpense] = useState<ExpenseForm>({
        title: '',
        amount: '',
        paidBy: '',
        splitBetween: [],
        groupId: null
    });
    const [editId, setEditId] = useState<number | null>(null);

    const [showFriendForm, setShowFriendForm] = useState(false);
    const [newFriend, setNewFriend] = useState('');

    const [showGroupForm, setShowGroupForm] = useState(false);
    const [newGroup, setNewGroup] = useState<{ name: string; members: string[] }>({
        name: '',
        members: []
    });

    const [showSettleUpForm, setShowSettleUpForm] = useState(false);
    const [settleData, setSettleData] = useState<{ from: string; to: string; amount: string }>({
        from: '',
        to: '',
        amount: ''
    });

    const [selectedFriendDetails, setSelectedFriendDetails] = useState<{
        name: string;
        details: string[];
    } | null>(null);

    const isAnyModalOpen =
        showForm || showFriendForm || showGroupForm || showSettleUpForm || !!selectedFriendDetails;

    const addOrUpdateExpense = () => {
        if (
            !newExpense.title.trim() ||
            !newExpense.amount.trim() ||
            !newExpense.paidBy.trim() ||
            newExpense.splitBetween.length === 0 ||
            !selectedGroup
        ) {
            return;
        }

        const amountNumber = Number(newExpense.amount);
        if (Number.isNaN(amountNumber) || amountNumber <= 0) return;

        const expenseToSave: Expense = {
            id: editId ?? Date.now(),
            title: newExpense.title.trim(),
            amount: amountNumber,
            paidBy: newExpense.paidBy,
            splitBetween: newExpense.splitBetween,
            groupId: selectedGroup.id
        };

        if (editId) {
            setExpenses((prev) => prev.map((e) => (e.id === editId ? expenseToSave : e)));
        } else {
            setExpenses((prev) => [...prev, expenseToSave]);
        }

        setNewExpense({ title: '', amount: '', paidBy: '', splitBetween: [], groupId: null });
        setEditId(null);
        setShowForm(false);
    };

    const addFriend = () => {
        const trimmed = newFriend.trim();
        if (!trimmed) return;

        if (selectedGroup) {
            const updatedGroups = groups.map((g) =>
                g.id === selectedGroup.id && !g.members.includes(trimmed)
                    ? { ...g, members: [...g.members, trimmed] }
                    : g
            );
            setGroups(updatedGroups);
            const updatedSelected = updatedGroups.find((g) => g.id === selectedGroup.id) ?? null;
            setSelectedGroup(updatedSelected);
        } else {
            if (!friends.includes(trimmed)) setFriends((prev) => [...prev, trimmed]);
        }

        setNewFriend('');
        setShowFriendForm(false);
    };

    const addGroup = () => {
        if (!newGroup.name.trim() || newGroup.members.length === 0) return;
        const newGrp: Group = { id: Date.now(), name: newGroup.name.trim(), members: newGroup.members };
        setGroups((prev) => [...prev, newGrp]);
        setSelectedGroup(newGrp);
        setNewGroup({ name: '', members: [] });
        setShowGroupForm(false);
    };

    const deleteExpense = (id: number) => setExpenses((prev) => prev.filter((exp) => exp.id !== id));

    const editExpense = (expense: Expense) => {
        setNewExpense({
            title: expense.title,
            amount: expense.amount.toString(),
            paidBy: expense.paidBy,
            splitBetween: expense.splitBetween,
            groupId: expense.groupId
        });
        setEditId(expense.id);
        setShowForm(true);
    };

    const calculateBalances = (): Record<string, number> => {
        if (!selectedGroup) return {};
        const balances: Record<string, number> = {};
        selectedGroup.members.forEach((m) => (balances[m] = 0));

        expenses
            .filter((exp) => exp.groupId === selectedGroup.id)
            .forEach((exp) => {
                const perPerson = exp.amount / Math.max(1, exp.splitBetween.length);
                balances[exp.paidBy] += exp.amount;
                exp.splitBetween.forEach((p) => (balances[p] -= perPerson));
            });

        return balances;
    };

    const balances = calculateBalances();

    const calculateOwes = (): OweItem[] => {
        if (!selectedGroup) return [];
        const tempBalances: Record<string, number> = { ...balances };
        const creditors = Object.entries(tempBalances)
            .filter(([, bal]) => bal > 0)
            .map(([name, bal]) => ({ name, amount: bal }));
        const debtors = Object.entries(tempBalances)
            .filter(([, bal]) => bal < 0)
            .map(([name, bal]) => ({ name, amount: Math.abs(bal) }));

        const owes: OweItem[] = [];
        let i = 0,
            j = 0;
        while (i < creditors.length && j < debtors.length) {
            const credit = creditors[i];
            const debt = debtors[j];
            const settle = Math.min(credit.amount, debt.amount);
            owes.push({ from: debt.name, to: credit.name, amount: settle });
            credit.amount -= settle;
            debt.amount -= settle;
            if (credit.amount <= 0.001) i++;
            if (debt.amount <= 0.001) j++;
        }

        return owes;
    };

    const owesSummary = calculateOwes();

    const getHoverDetails = (friend: string): string[] => {
        const owes = owesSummary.filter((o) => o.from === friend);
        const gets = owesSummary.filter((o) => o.to === friend);

        let details: string[] = [];

        if (gets.length > 0) {
            gets.forEach((g) => {
                details.push(
                    `${friend === 'You' ? 'You get' : `${friend} gets`} ₹${g.amount.toFixed(2)} from ${g.from}`
                );
            });
        }

        if (owes.length > 0) {
            owes.forEach((o) => {
                details.push(
                    `${friend === 'You' ? 'You owe' : `${friend} owes`} ₹${o.amount.toFixed(2)} to ${o.to}`
                );
            });
        }

        if (details.length === 0) return ['All settled up! 🎉'];

        return details;
    };

    const settleUp = () => {
        const { from, to, amount } = settleData;
        const amt = Number(amount);
        if (!selectedGroup || !from || !to || Number.isNaN(amt) || amt <= 0) return;

        const newExp: Expense = {
            id: Date.now(),
            title: `Settle Up: ${from} → ${to}`,
            amount: amt,
            paidBy: from,
            splitBetween: [to],
            groupId: selectedGroup.id
        };

        setExpenses((prev) => [...prev, newExp]);
        setSettleData({ from: '', to: '', amount: '' });
        setShowSettleUpForm(false);
    };

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden flex justify-between items-center bg-white shadow p-4 z-49">
                <h1 className="text-xl font-bold">Splitwise</h1>
                <button
                    onClick={() => setShowSidebar(!showSidebar)}
                    disabled={isAnyModalOpen}
                    className={isAnyModalOpen ? 'opacity-50 cursor-not-allowed' : ''}
                >
                    {showSidebar ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-5 flex flex-col shadow-xl overflow-y-auto transform transition-transform duration-300 z-50
                ${isAnyModalOpen ? '-translate-x-full' : showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}
            >
                {/* Header with close button on mobile */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-700">GROUPS</h2>
                    <button
                        className="md:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setShowSidebar(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="space-y-3 mb-6">
                    {groups.map((group) => (
                        <div
                            key={group.id}
                            onClick={() => {
                                setSelectedGroup(group);
                                setShowSidebar(false);
                            }}
                            className={`cursor-pointer p-3 rounded-lg font-medium transition-all duration-200 ${selectedGroup?.id === group.id
                                ? 'bg-green-500 text-white shadow-md'
                                : 'hover:bg-gray-100 text-gray-700'
                                }`}
                        >
                            {group.name}
                        </div>
                    ))}
                    <button
                        onClick={() => setShowGroupForm(true)}
                        className="text-blue-500 mt-2 flex items-center gap-2 hover:underline font-medium"
                    >
                        <FolderPlus size={18} /> Add Group
                    </button>
                </div>

                <h2 className="text-lg font-bold text-gray-700 mb-4">FRIENDS</h2>
                <div className="space-y-3 flex-1 overflow-y-auto">
                    {Object.keys(balances).map((friend, idx) => {
                        const details = getHoverDetails(friend);
                        const balance = balances[friend];
                        const balanceText =
                            balance < 0
                                ? `Owes ₹${Math.abs(balance).toFixed(2)}`
                                : `Gets ₹${balance.toFixed(2)}`;
                        const balanceColor = balance < 0 ? 'text-red-500' : 'text-green-500';

                        return (
                            <div
                                key={idx}
                                className="p-4 bg-white rounded-xl shadow hover:shadow-lg hover:scale-[1.02] transition-all"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 flex items-center justify-center bg-gray-200 rounded-full">
                                        <User className="w-4 h-4 text-gray-700" />
                                    </div>
                                    <span className="text-gray-800 font-semibold">{friend}</span>
                                </div>
                                <div className="flex items-center justify-between mt-2">
                                    <span className={`text-sm font-semibold ${balanceColor}`}>
                                        {balanceText}
                                    </span>
                                    <button
                                        onClick={() => setSelectedFriendDetails({ name: friend, details })}
                                        className="p-1 hover:bg-gray-100 rounded-full transition"
                                    >
                                        <Info className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        onClick={() => setShowFriendForm(true)}
                        className="flex items-center gap-2 text-blue-500 font-semibold mt-3 hover:underline"
                    >
                        <span className="w-6 h-6 flex items-center justify-center bg-blue-100 rounded-full text-blue-500 font-bold">
                            +
                        </span>
                        Add Friend
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                {!selectedGroup && (
                    <p className="text-gray-500 text-center text-xl mt-16 font-medium">
                        Select a group to view balances & expenses
                    </p>
                )}

                {selectedGroup && (
                    <>
                        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{selectedGroup.name}</h2>
                            <div className="flex gap-3 w-full md:w-auto justify-center">
                                <button
                                    onClick={() => {
                                        setShowForm(true);
                                        setEditId(null);
                                        setNewExpense({
                                            title: '',
                                            amount: '',
                                            paidBy: '',
                                            splitBetween: [],
                                            groupId: selectedGroup.id
                                        });
                                    }}
                                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium shadow text-sm md:text-base"
                                >
                                    <Plus size={16} /> Add Expense
                                </button>
                                <button
                                    onClick={() => setShowSettleUpForm(true)}
                                    className="flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition font-medium shadow text-sm md:text-base"
                                >
                                    💸 Settle Up
                                </button>
                            </div>
                        </div>

                        <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-700">Expenses</h2>
                        <div className="space-y-4">
                            {expenses.filter((exp) => exp.groupId === selectedGroup.id).length === 0 ? (
                                <p className="text-gray-500 text-center">No expenses yet. Add one!</p>
                            ) : (
                                expenses
                                    .filter((exp) => exp.groupId === selectedGroup.id)
                                    .map((exp) => (
                                        <div
                                            key={exp.id}
                                            className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 md:p-5 rounded-xl shadow hover:shadow-lg transition"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-gray-800 text-lg">{exp.title}</h3>
                                                <p className="text-gray-500 text-sm">
                                                    Paid by <span className="font-medium">{exp.paidBy}</span> | Split:{' '}
                                                    {exp.splitBetween.join(', ')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-4 mt-3 md:mt-0">
                                                <h3 className="font-bold text-green-500 text-lg">₹{exp.amount}</h3>
                                                <button
                                                    onClick={() => editExpense(exp)}
                                                    className="text-blue-500 hover:text-blue-700"
                                                >
                                                    <Edit size={20} />
                                                </button>
                                                <button
                                                    onClick={() => deleteExpense(exp.id)}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* Modals */}
            {selectedFriendDetails && (
                <FriendDetailsPopup
                    friend={selectedFriendDetails}
                    onClose={() => setSelectedFriendDetails(null)}
                />
            )}

            {showSettleUpForm && selectedGroup && (
                <SettleUpFormModal
                    setShowSettleUpForm={setShowSettleUpForm}
                    selectedGroup={selectedGroup}
                    settleData={settleData}
                    setSettleData={setSettleData}
                    settleUp={settleUp}
                />
            )}

            {showGroupForm && (
                <AddGroupModal
                    setShowGroupForm={setShowGroupForm}
                    newGroup={newGroup}
                    setNewGroup={setNewGroup}
                    friends={friends}
                    addGroup={addGroup}
                />
            )}

            {showFriendForm && (
                <AddFriendModal
                    setShowFriendForm={setShowFriendForm}
                    newFriend={newFriend}
                    setNewFriend={setNewFriend}
                    addFriend={addFriend}
                    selectedGroup={selectedGroup}
                />
            )}

            {showForm && selectedGroup && (
                <AddEditExpenseModal
                    setShowForm={setShowForm}
                    editId={editId}
                    newExpense={newExpense}
                    setNewExpense={setNewExpense}
                    selectedGroup={selectedGroup}
                    addOrUpdateExpense={addOrUpdateExpense}
                />
            )}
        </div>
    );
};

export default Splitwise;
