"use client"
import { logOut } from '@/lib/token';
import React, { useState } from 'react'
import { IoMdLogOut } from "react-icons/io";
import ConfirmationPopup from './ConfirmationPopup';

export default function Header() {
    const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false);

    const handleLogout = () => {
        logOut()
        window.location.href = '/auth/login';
    };

    const toggleLogoutConfirmation = () => {
        setShowLogoutConfirmation(!showLogoutConfirmation);
    };
    return (
        <>
            <>
                <div className="bg-[#34495e] p-4 rounded">
                    <div className="container mx-auto flex items-center justify-between">
                        <h1 className="text-2xl font-bold text-white">Track Stock Test</h1>
                        <button className="flex items-center text-white" onClick={toggleLogoutConfirmation}>
                            <IoMdLogOut size={25} />
                            <span className="ml-2">Logout</span>
                        </button>
                    </div>
                </div>

                <ConfirmationPopup
                    isOpen={showLogoutConfirmation}
                    onClose={toggleLogoutConfirmation}
                    onLogout={handleLogout}
                />
            </>
        </>
    )
}
