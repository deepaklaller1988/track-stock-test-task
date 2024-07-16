import React from 'react'
import { IoMdLogOut } from "react-icons/io";


export default function Header() {
    return (
        <>
           <div className="bg-[#34495e] p-4 rounded">
                <div className="container mx-auto flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Track Stock Test</h1>
                    <button className="flex items-center text-white">
                        <IoMdLogOut size={25} />
                        <span className="ml-2 "></span>
                    </button>
                </div>
            </div>
        </>
    )
}
