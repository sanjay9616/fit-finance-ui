import { Item } from '@/pages/diet-management';
import { XCircle } from 'lucide-react';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const DietPopup = ({
  showPopup,
  setShowPopup,
  defaultValues,
  onSave,
}: {
  showPopup: boolean;
  setShowPopup: (val: boolean) => void;
  defaultValues: Item;
  onSave: (data: Item) => void;
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Item>({ defaultValues });

  React.useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const itemUnit = watch("itemUnit");
  const unitDropdown = ['Kg', 'gm', 'item'];

  useEffect(() => {
    if (itemUnit === "item") {
      setValue("macroUnit", "item");
    } else {
      setValue("macroUnit", "gm");
    }
  }, [itemUnit, setValue]);

  const handleInputValidation = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sanitizedValue = e.target.value.replace(/[^0-9.]/g, '');
    setValue(e.target.name as keyof Item, sanitizedValue);
  };

  const onSubmit = (data: Item) => {
    onSave(data);
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center transition-opacity animate-fadeIn">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-[400px] relative glassmorphic">
        <XCircle
          onClick={() => setShowPopup(false)}
          className="absolute top-3 right-3 w-6 h-6 text-gray-500 hover:text-red-500 transition-transform transform hover:scale-110 cursor-pointer"
        />
        <h2 className="text-xl font-bold text-center text-gray-800 mb-4">Add / Update Item</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-4 items-center">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Item</label>
              <input
                {...register('item', { required: 'Item name is required' })}
                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter item"
              />
              <p className="text-red-500 text-xs h-4">{errors.item?.message}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Qty</label>
              <input
                type="number"
                step="any"
                {...register('itemRate', { required: 'Quantity is required', min: { value: 0, message: 'Cannot be negative' } })}
                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter quantity"
                onChange={handleInputValidation}
              />
              <p className="text-red-500 text-xs h-4">{errors.itemRate?.message}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Unit</label>
              <select
                {...register('itemUnit')}
                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
              >
                {unitDropdown.map((unit, i) => (
                  <option key={i} value={unit}>{unit}</option>
                ))}
              </select>
              <p className="text-red-500 text-xs h-4">{errors.itemUnit?.message}</p>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700">Cost</label>
              <input
                type="number"
                step="any"
                {...register('itemCost', { required: 'Cost is required', min: { value: 0, message: 'Cannot be negative' } })}
                className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                placeholder="Enter cost"
                onChange={handleInputValidation}
              />
              <p className="text-red-500 text-xs h-4">{errors.itemCost?.message}</p>
            </div>
          </div>

          {/* Macros Per Section */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Macros per:</label>
            <input
              type="number"
              step="any"
              {...register('macroRate', { required: 'Please enter value', min: { value: 0, message: 'Cannot be negative' } })}
              className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400 w-20"
              placeholder="Enter value"
            />
            {watch('itemUnit') === 'item' ? (
              <span className="text-gray-700">Item</span>
            ) : (
              <span className="text-gray-700">gm</span>
            )}
          </div>

          {/* Macros Input Section */}
          <div className="grid grid-cols-2 gap-4">
            {['protein', 'carbs', 'fat', 'calorie'].map((macro) => (
              <div key={macro} className="flex flex-col">
                <label className="text-sm font-medium text-gray-700">
                  {macro.charAt(0).toUpperCase() + macro.slice(1)} (g)
                </label>
                <input
                  type="number"
                  step="any"
                  {...register(macro as keyof Item, { required: `Please enter ${macro}`, min: { value: 0, message: 'Cannot be negative' } })}
                  className="border p-2 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter value"
                  onChange={handleInputValidation}
                />
                <p className="text-red-500 text-xs h-4">{errors[macro as keyof Item]?.message}</p>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300 hover:scale-105 transition-transform"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DietPopup;
