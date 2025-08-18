import { useState } from "react";
import { Trash2, PlusCircle, Edit, PackageOpen } from "lucide-react";
import DietPopup from "@/components/DietPopup";

export interface Item {
    item: string;
    itemRate: number;
    itemUnit: "item" | "gm" | "Kg";
    itemCost: number;
    macroRate: number;
    macroUnit: string;
    protein: number;
    carbs: number;
    fat: number;
    calorie: number;
    quantity: number;
    updatedAt: number;
}

export default function SetRate() {
    const [diet, setDiet] = useState<Item[]>([]);
    const [showPopup, setShowPopup] = useState(false);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [defaultValues, setNewDefaultValues] = useState<Item>({
        item: "WheyP",
        itemRate: 1,
        itemUnit: "Kg",
        itemCost: 1945,
        macroRate: 35,
        macroUnit: "gm",
        protein: 27,
        carbs: 2,
        fat: 3,
        calorie: 105,
        quantity: 50,
        updatedAt: Date.now(),
    });

    const handleSaveItem = (updatedItem: Item) => {
        if (editingIndex !== null) {
            setDiet((prevDiet) =>
                prevDiet.map((item, index) =>
                    index === editingIndex ? updatedItem : item
                )
            );
        } else {
            setDiet((prevDiet) => [...prevDiet, updatedItem]);
        }
        setEditingIndex(null);
        setShowPopup(false);
    };

    const editItem = (i: number) => {
        setEditingIndex(i);
        setShowPopup(true);
        setNewDefaultValues(diet[i]);
    };

    const deleteItem = (i: number) => {
        setDiet((prevDiet) => prevDiet.filter((_, index) => index !== i));
    };

    const calculateCost = (i: number) => {
        const costPerUnit = diet[i].itemCost / diet[i].itemRate;
        let cost: number;
        switch (diet[i].itemUnit) {
            case "Kg":
                cost = (costPerUnit / 1000) * diet[i].quantity;
                break;
            case "gm":
            case "item":
                cost = costPerUnit * diet[i].quantity;
                break;
            default:
                throw new Error(`Unknown unit: ${diet[i].itemUnit}`);
        }
        return parseFloat(cost.toFixed(2));
    };

    const totalProtein = diet.reduce((sum, item) => sum + (item.protein / item.macroRate * item.quantity), 0).toFixed(2);
    const totalCarbs = diet.reduce((sum, item) => sum + (item.carbs / item.macroRate * item.quantity), 0).toFixed(2);
    const totalFat = diet.reduce((sum, item) => sum + (item.fat / item.macroRate * item.quantity), 0).toFixed(2);
    const totalCalories = diet.reduce((sum, item) => sum + (item.calorie / item.macroRate * item.quantity), 0).toFixed(2);
    const totalCost = diet.reduce((sum, _, i) => sum + calculateCost(i), 0).toFixed(2);

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center bg-white">
            <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-8">
                <h2 className="text-3xl font-bold text-gray-800 text-center">🥗 Set Item Rates</h2>

                {/* Empty State UI */}
                {diet.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-96">
                        <PackageOpen size={80} className="text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-600 mt-4">
                            No items added yet! Start tracking your diet now. 🥗
                        </h3>
                    </div>
                ) : (
                    <div className="overflow-x-auto mt-6">
                        <table className="w-full border-collapse shadow-lg rounded-lg overflow-hidden">
                            <thead>
                                <tr className="bg-blue-500 text-white font-semibold shadow-md">
                                    <th className="p-3 min-w-[90px] text-left">Item</th>
                                    <th className="p-3 min-w-[110px] text-left">Quantity</th>
                                    <th className="p-3 min-w-[70px] text-left">Protein (g)</th>
                                    <th className="p-3 min-w-[70px] text-left">Carbs (g)</th>
                                    <th className="p-3 min-w-[70px] text-left">Fat (g)</th>
                                    <th className="p-3 min-w-[70px] text-left">Calories</th>
                                    <th className="p-3 min-w-[70px] text-left">Cost (₹)</th>
                                    <th className="p-3 min-w-[70px] text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diet.map((item: Item, i: number) => (
                                    <tr key={i} className="even:bg-gray-50 hover:bg-blue-100 transition-all duration-200">
                                        <td className="p-3 text-gray-800 font-medium">{item.item}</td>
                                        <td className="p-3">
                                            <div className="flex items-center justify-between bg-gray-100 p-1 rounded-md">
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.quantity}
                                                    onChange={(e) => {
                                                        const newQuantity = e.target.value === "" ? NaN : Number(e.target.value);
                                                        setDiet((prevDiet) =>
                                                            prevDiet.map((itm, index) =>
                                                                index === i ? { ...itm, quantity: newQuantity } : itm
                                                            )
                                                        );
                                                    }}
                                                    className="w-14 text-center bg-transparent focus:outline-none"
                                                />
                                                <span className="text-gray-600">{item.macroUnit}</span>
                                            </div>
                                        </td>
                                        <td className="p-3 text-gray-700">{(item.protein / item.macroRate * item.quantity).toFixed(2)}</td>
                                        <td className="p-3 text-gray-700">{(item.carbs / item.macroRate * item.quantity).toFixed(2)}</td>
                                        <td className="p-3 text-gray-700">{(item.fat / item.macroRate * item.quantity).toFixed(2)}</td>
                                        <td className="p-3 text-gray-700">{(item.calorie / item.macroRate * item.quantity).toFixed(2)}</td>
                                        <td className="p-3 text-gray-900">₹{calculateCost(i)}</td>
                                        <td className="p-3 flex justify-center space-x-3">
                                            <Trash2 onClick={() => deleteItem(i)} className="text-red-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                                            <Edit onClick={() => editItem(i)} className="text-blue-500 w-5 h-5 cursor-pointer hover:scale-110 transition-transform" />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                )}

                {/* Add Item Button */}
                <div className="flex justify-center mt-6">
                    <button
                        onClick={() => setShowPopup(true)}
                        className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md flex items-center gap-2 hover:bg-blue-600 transition-all"
                    >
                        <PlusCircle size={22} />
                        Add Item
                    </button>
                </div>

                {/* Summary Section */}
                {diet.length > 0 && (
                    <div className="mt-10 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl shadow-md border border-blue-200 flex flex-wrap justify-between items-center text-center min-h-[80px]">
                        <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                            📊 Summary:
                        </h3>

                        <div className="flex gap-6 justify-center flex-wrap w-full md:w-auto">
                            {/* Protein */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-blue-600">🥩 Protein</span>
                                <p className="text-lg font-bold text-gray-900">{totalProtein} g</p>
                            </div>

                            {/* Carbs */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-yellow-600">🍞 Carbs</span>
                                <p className="text-lg font-bold text-gray-900">{totalCarbs} g</p>
                            </div>

                            {/* Fat */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-red-600">🥑 Fat</span>
                                <p className="text-lg font-bold text-gray-900">{totalFat} g</p>
                            </div>

                            {/* Calories */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-green-700">🔥 Calories</span>
                                <p className="text-lg font-bold text-gray-900">{totalCalories}</p>
                            </div>

                            {/* Cost */}
                            <div className="flex flex-col items-center">
                                <span className="text-sm font-medium text-purple-700">💰 Cost</span>
                                <p className="text-lg font-bold text-gray-900">₹{totalCost}</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {showPopup && (
                <DietPopup showPopup={showPopup} setShowPopup={setShowPopup} defaultValues={defaultValues} onSave={handleSaveItem} />
            )}
        </div>
    );
}
