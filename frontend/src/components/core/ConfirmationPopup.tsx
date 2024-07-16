import React from 'react';

const ConfirmationPopup = ({ isOpen, onClose, onLogout }:any) => {
    return (
        isOpen && (
            <div className="rounded fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                <div className="bg-white p-8 rounded shadow-md">
                    <p className="text-lg mb-4">Are you sure you want to log out?</p>
                    <div className="flex justify-end">
                        <button
                            className="px-4 py-2 bg-[#34495e] text-white rounded mr-2"
                            onClick={onLogout}
                        >
                            Yes
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-300 rounded"
                            onClick={onClose}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
        )
    );
};

export default ConfirmationPopup;
