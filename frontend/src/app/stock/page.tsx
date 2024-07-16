import StockCard from '@/components/StockView'
import React from 'react'

const page = async ({
    searchParams,
}: {
    searchParams?:{ [key: string]: string | undefined };
}) => {
    const { symbol } = searchParams || {};
    const stock = await getApi(symbol);
    return (
        <StockCard stock={stock} />
    )
}

export default page;


async function getApi(symbol: any) {
    try {
      const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
      const response = await fetch(`https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`);
      const data = await response.json();

      // Filter the data to include only the provided symbol
      const filteredData = data.find((stock: any) => stock.symbol === symbol);
      if (!filteredData) {
        throw new Error(`Symbol ${symbol} not found`);
      }

      // Fetch the current price for the symbol
      const price = await getStockPrice(symbol);
  
      // Combine stock data with the price
      const finalData = {
        ...filteredData,
        price: price // Assuming 'c' is the current price in the returned JSON
      };
  
      return finalData;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
  
  async function getStockPrice(symbol: string) {
    try {
      const apiKey = 'cqadgn9r01qkfes31ut0cqadgn9r01qkfes31utg';
      const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`);
      const price = await response.json();
      return price;
    } catch (error) {
      console.error('Error fetching stock price:', error);
      throw error;
    }
  }