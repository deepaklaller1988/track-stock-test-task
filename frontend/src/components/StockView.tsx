"use client"
// src/StockCard.js
import React, { useRef, useEffect } from 'react';

const StockCard = ({ stock }: { stock: any }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Clean up any existing scripts in the ref element
    while (ref.current?.firstChild) {
      ref.current.removeChild(ref.current.firstChild);
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      "colorTheme": "dark",
      "dateRange": "1D",
      "showChart": true,
      "locale": "en",
      "largeChartUrl": "",
      "isTransparent": true,
      "showSymbolLogo": true,
      "showFloatingTooltip": false,
      "width": "100%",
      "height": "500",
      "plotLineColorGrowing": "rgba(41, 98, 255, 1)",
      "plotLineColorFalling": "rgba(41, 98, 255, 1)",
      "gridLineColor": "rgba(42, 46, 57, 0)",
      "scaleFontColor": "rgba(120, 123, 134, 1)",
      "belowLineFillColorGrowing": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorFalling": "rgba(41, 98, 255, 0.12)",
      "belowLineFillColorGrowingBottom": "rgba(41, 98, 255, 0)",
      "belowLineFillColorFallingBottom": "rgba(41, 98, 255, 0)",
      "symbolActiveColor": "rgba(41, 98, 255, 0.12)",
      "tabs": [
        {
          "title": "Custom Symbol",
          "symbols": [
            {
              "s": stock.symbol,  // Dynamic symbol from stock data
              "d": stock.description  // Display name for the symbol
            }
          ],
          "originalTitle": "Custom Symbol"
        }
      ]
    });

    ref.current?.appendChild(script);

    return () => {
      // Clean up the script when component unmounts
      if (ref.current?.firstChild) {
        ref.current.removeChild(ref.current.firstChild);
      }
    };
  }, [stock]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-6 w-full container">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-bold">{stock?.description}</h1>
            <p className="text-gray-500">Jul 15, 11:55:49 AM UTC+5:30</p>
          </div>
          <div className="bg-green-100 text-green-600 px-2 py-1 rounded">
            +{stock?.price?.c}
          </div>
        </div>
        <div className="flex justify-between items-baseline mb-4">
          <span className="text-3xl font-semibold">${stock?.price?.c}</span>
          <span className={`${stock?.price.d > 0 ? "text-green-500" : "text-red-500"}`}>{stock?.price.d < 0 ? stock?.price.d : "+" + stock?.price.d} Today</span>
        </div>
        <div className="mb-4">
          <div className="tradingview-widget-container" ref={ref}>
            <div className="tradingview-widget-container__widget"></div>
          </div>
        </div>
        {/* <div className="text-sm grid grid-cols-2 gap-4">
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
        </div> */}
      </div>
    </div>
  );
};

export default StockCard;
