
import Link from 'next/link';
import ThresholdBtn from './core/ThresholdBtn';
import React, { useEffect } from 'react'
import Header from './core/Header';

const Dashboard = ({ stockData, trendingData }: any) => {
    return (
        <div className="bg-gray-100 p-4">
            <div className="container mx-auto">
                <Header />
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold">Stock Market Dashboard</h1>
                    <ThresholdBtn />
                </div>
                {/* Market Overview */}
                <div className="grid grid-cols-5 gap-4 mb-4">
                    {stockData?.map((item: any) => (
                        <Link href="/stock" className="bg-white p-4 rounded-lg shadow-md text-center">
                            <p className="text-gray-600">{item?.description}</p>
                            <p className="text-green-500">{item?.price}%</p>
                        </Link>
                    ))}
                </div>
                {/* Trending List */}
                <div className="bg-white p-4 rounded-lg shadow-md mt-4">
                    <h2 className="text-xl font-bold mb-4">Market trends</h2>
                    <table className="min-w-full bg-white border border-r-0 border-l-0 border-gray-200">
                        <tbody className="divide-y divide-gray-200">
                            {trendingData?.map((item: any) => (
                                <tr>
                                    <td className="py-2 px-4"><img src="https://via.placeholder.com/32" alt={item?.description} className="w-8 h-8" /></td>
                                    <td className="py-2 px-4 font-bold text-blue-600"><Link href={`/stock?symbol=${item?.symbol}`}>{item?.description}</Link> </td>
                                    <td className="py-2 px-4">${item?.price.c}</td>
                                    <td className={`${item?.price.dp > 0 ? "text-green-500" : "text-red-500"} py-2 px-4`}>{item?.price.dp < 0 ? item?.price.dp : "+" + item?.price.dp} </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
