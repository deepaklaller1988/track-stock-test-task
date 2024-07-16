"use client"
// src/StockCard.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const data = {
  labels: ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM'],
  datasets: [
    {
      label: 'Price',
      data: [860, 865, 870, 875, 870],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: true,
    },
  ],
};

const options:any = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Price Movement',
    },
  },
};

const StockCard = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full container">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">State Bank of India</h1>
            <p className="text-gray-500">Jul 15, 11:55:49 AM UTC+5:30</p>
          </div>
          <div className="bg-green-100 text-green-600 px-2 py-1 rounded">
            +1.69%
          </div>
        </div>
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-3xl font-semibold">₹874.25</span>
          <span className="text-gray-500">+14.55 Today</span>
        </div>
        <div className="mb-4">
          <Line width="400" data={data} options={options} />
        </div>
        <div className="text-sm grid grid-cols-2 gap-4">
          <p className="flex justify-between">
            <span>Previous Close:</span> <span>₹859.70</span>
          </p>
          <p className="flex justify-between">
            <span>Day Range:</span> <span>₹859.70 - ₹875.00</span>
          </p>
          <p className="flex justify-between">
            <span>Year Range:</span> <span>₹543.20 - ₹912.00</span>
          </p>
          <p className="flex justify-between">
            <span>Market Cap:</span> <span>7.80T INR</span>
          </p>
          <p className="flex justify-between">
            <span>Avg Volume:</span> <span>24.28M</span>
          </p>
          <p className="flex justify-between">
            <span>P/E Ratio:</span> <span>11.63</span>
          </p>
          <p className="flex justify-between">
            <span>Dividend Yield:</span> <span>1.57%</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default StockCard;
