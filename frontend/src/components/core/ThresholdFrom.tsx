import React from 'react';

export default function ThresholdFrom({ stock, onSubmit, onCancel, handleChange }: any) {
  const handleSubmit = () => {
    onSubmit();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <p className="text-lg mb-4">Set Threshold</p>
        <div>
          <label htmlFor="country-select">Select Stock:</label>
          <select id="stock-select" onChange={handleChange}>
            {stock?.map((stock: any) => (
              <option key={stock} value={stock}>
                {stock}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Set Price</label>
          <input type="Number" />
        </div>
        <div className="flex justify-end">
          <button className="px-4 py-2 mr-2 bg-blue-600 text-white rounded-md text-sm" onClick={handleSubmit}>
            Submit
          </button>
          <button className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md text-sm" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
