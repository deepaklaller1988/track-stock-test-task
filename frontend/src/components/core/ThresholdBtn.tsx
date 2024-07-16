"use client";
import React, { ChangeEvent, useEffect } from 'react'
import ThresholdFrom from './ThresholdFrom';
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/Api';
import { getToken } from '@/lib/token';

const ThresholdBtn = () => {
    const [showModal, setShowModal] = React.useState(false);
    const [input, setInput] = React.useState('');
    const [stockList, setStockList] = React.useState([]);
    const [formData, setFormData] = React.useState({ stock: '', price: '',symbol: '' });

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value.toUpperCase());
    };

    const handleSelect = (stock: string,symbol: string) => {
        setFormData({ ...formData, stock,symbol });
        setStockList([]); // Clear the dropdown after selection
    };

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, price: event.target.value });
    };

    useEffect(() => {
        if (input.length > 0) {
            fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${input}&apikey=RGQV6YBI0HA8JU1Q`)
                .then(res => {
                    if (!res.ok) {
                        throw new Error('Failed to fetch data');
                    }
                    return res.json();
                })
                .then(data => {
                    setStockList(data.bestMatches.slice(0, 5)); // Limit to 5 results
                })
                .catch(error => {
                    console.error('Error fetching stock symbols:', error);
                });
        }
    }, [input]);

    const handleSubmit = () => {
        mutation.mutate({
            id:getToken,
            ...formData,
        });
    };
    
    const mutation = useMutation({
        mutationFn: async (data: any) => {
          return await API.post('threshold', data);
        },
        onSuccess: async (data: any) => {
          if (data?.data?.accessToken) {
            alert("Login successfull!");
          }
          setShowModal(false);
        },
        onError: async (error: any) => {
            console.log(error)
            alert(error);
        },
      });

    return (
        <>
            <button type='button' onClick={() => setShowModal(true)} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Set Threshold</button>
            { showModal && 
                <ThresholdFrom 
                    stock={stockList} 
                    formData={formData} 
                    onSubmit={handleSubmit} 
                    handleChange={handleChange} 
                    handleSelect={handleSelect} 
                    handlePriceChange={handlePriceChange} 
                    onCancel={() => setShowModal(false)} 
                /> 
            }
        </>
    );
};

export default ThresholdBtn;
