"use client";
import React from 'react'
import ThresholdFrom from './ThresholdFrom';

const ThresholdBtn = () => {
    const [showModal, setShowModal] = React.useState(false);
    const handleChange = () => {}

    const handleSubmit = () => {}

    return (
        <>
            <button type='button' onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Set Threshold</button>
            { showModal && <ThresholdFrom stock={[]} onSubmit={handleSubmit} handleChange={handleChange} onCancel={()=>setShowModal(false)} /> }
        </>
    ) 
}

export default ThresholdBtn
