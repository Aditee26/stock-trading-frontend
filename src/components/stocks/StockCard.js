import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid';

const StockCard = ({ stock }) => {
  const isPositive = stock.dayChangePercent >= 0;

  return (
    <Link to={`/stocks/${stock.symbol}`} className="block">
      <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold">{stock.symbol}</h3>
            <p className="text-gray-600 text-sm">{stock.companyName}</p>
          </div>
          <span className="px-2 py-1 bg-gray-100 text-xs rounded-full">
            {stock.sector}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span className="text-2xl font-bold">
              ${stock.currentPrice?.toFixed(2)}
            </span>
          </div>
          <div className={`flex items-center ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <ArrowUpIcon className="h-4 w-4" />
            ) : (
              <ArrowDownIcon className="h-4 w-4" />
            )}
            <span className="text-sm font-semibold ml-1">
              {Math.abs(stock.dayChangePercent).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StockCard;