import React from 'react';

interface ThresholdFormProps {
    stock: Array<{ '1. symbol': string; '2. name': string }>;
    formData: { stock: string, price: string };
    onSubmit: () => void;
    onCancel: () => void;
    handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleSelect: (stock: string,symbol: string) => void;
    handlePriceChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ThresholdForm: React.FC<ThresholdFormProps> = ({ stock, formData, onSubmit, onCancel, handleChange, handleSelect, handlePriceChange }) => {
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
                    <label htmlFor="stock-input">Select Stock:</label>
                    <input type="text" id="stock-input" onChange={handleChange} />
                    {stock.length > 0 && (
                        <ul className="border border-gray-300 mt-2 max-h-40 overflow-auto">
                            {stock.map((item:any, index) => (
                                <li
                                    key={index}
                                    className="p-2 cursor-pointer hover:bg-gray-200"
                                    onClick={() => handleSelect(item.ticker,item.name)}
                                >
                                    {item.ticker} - {item.name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div>
                    <label>Set Price</label>
                    <input type="number" value={formData.price} onChange={handlePriceChange} />
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
};

export default ThresholdForm;
