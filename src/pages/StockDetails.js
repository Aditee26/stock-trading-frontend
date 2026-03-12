import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  ArrowLeftIcon,
  StarIcon as StarOutline,
  CurrencyDollarIcon,
  ChartBarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { Line } from 'react-chartjs-2';
import {
  getStockBySymbol,
  getStockHistory,
  clearCurrentStock
} from '../redux/slices/stockSlice';
import { addToWatchlist, removeFromWatchlist } from '../redux/slices/watchlistSlice';
import { buyStock, sellStock } from '../redux/slices/transactionSlice';
import TradeModal from '../components/trading/TradeModal';
import Loader from '../components/common/Loader';
import { toast } from 'react-toastify';

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentStock, isLoading } = useSelector(state => state.stocks);
  const { user } = useSelector(state => state.auth);
  const { watchlist } = useSelector(state => state.watchlist);
  const [selectedPeriod, setSelectedPeriod] = useState('1M');
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [tradeType, setTradeType] = useState('BUY');

  useEffect(() => {
    dispatch(getStockBySymbol(symbol));
    dispatch(getStockHistory({ symbol, period: selectedPeriod }));

    return () => {
      dispatch(clearCurrentStock());
    };
  }, [dispatch, symbol, selectedPeriod]);

  const isInWatchlist = watchlist?.stocks?.some(s => s.symbol === symbol);

  const handleWatchlistToggle = () => {
    if (isInWatchlist) {
      dispatch(removeFromWatchlist(currentStock._id));
    } else {
      dispatch(addToWatchlist(currentStock._id));
    }
  };

  const handleTrade = (type) => {
    setTradeType(type);
    setShowTradeModal(true);
  };

  const handleBuy = async (quantity) => {
    const result = await dispatch(buyStock({
      stockId: currentStock._id,
      quantity
    }));
    
    if (!result.error) {
      setShowTradeModal(false);
      toast.success(`Successfully bought ${quantity} shares of ${symbol}`);
    }
  };

  const handleSell = async (quantity) => {
    const result = await dispatch(sellStock({
      stockId: currentStock._id,
      quantity
    }));
    
    if (!result.error) {
      setShowTradeModal(false);
      toast.success(`Successfully sold ${quantity} shares of ${symbol}`);
    }
  };

  if (isLoading || !currentStock) {
    return <Loader />;
  }

  const isPositive = currentStock.dayChangePercent >= 0;

  // Chart data
  const chartData = {
    labels: currentStock.historicalData?.map(d => 
      new Date(d.date).toLocaleDateString()
    ) || [],
    datasets: [
      {
        label: 'Stock Price',
        data: currentStock.historicalData?.map(d => d.close) || [],
        borderColor: isPositive ? 'rgb(16, 185, 129)' : 'rgb(239, 68, 68)',
        backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>

      {/* Stock Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{currentStock.symbol}</h1>
            <p className="text-xl text-gray-600 mt-1">{currentStock.companyName}</p>
            <p className="text-sm text-gray-500 mt-1">{currentStock.sector}</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={handleWatchlistToggle}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              {isInWatchlist ? (
                <StarSolid className="h-6 w-6 text-yellow-400" />
              ) : (
                <StarOutline className="h-6 w-6 text-gray-400" />
              )}
            </button>
            <button
              onClick={() => handleTrade('BUY')}
              className="btn-primary"
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade('SELL')}
              className="btn-danger"
            >
              Sell
            </button>
          </div>
        </div>

        {/* Price Info */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Price</p>
            <p className="text-3xl font-bold">${currentStock.currentPrice?.toFixed(2)}</p>
            <p className={`text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? '+' : ''}{currentStock.dayChange?.toFixed(2)} 
              ({isPositive ? '+' : ''}{currentStock.dayChangePercent?.toFixed(2)}%)
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Day Range</p>
            <p className="text-lg font-semibold">
              ${currentStock.dayLow?.toFixed(2)} - ${currentStock.dayHigh?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">52 Week Range</p>
            <p className="text-lg font-semibold">
              ${currentStock.week52Low?.toFixed(2)} - ${currentStock.week52High?.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Volume</p>
            <p className="text-lg font-semibold">
              {(currentStock.volume / 1000000).toFixed(2)}M
            </p>
            <p className="text-xs text-gray-500">
              Avg: {(currentStock.avgVolume / 1000000).toFixed(2)}M
            </p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Price History</h2>
          <div className="flex space-x-2">
            {['1D', '1W', '1M', '3M', '6M', '1Y'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 text-sm rounded-md ${
                  selectedPeriod === period
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-96">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: (context) => `$${context.raw.toFixed(2)}`
                  }
                }
              },
              scales: {
                y: {
                  grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                  },
                  ticks: {
                    callback: (value) => `$${value}`
                  }
                },
                x: {
                  grid: {
                    display: false
                  }
                }
              }
            }}
          />
        </div>
      </div>

      {/* Stock Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Company Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Market Cap</span>
              <span className="font-medium">${(currentStock.marketCap / 1e9).toFixed(2)}B</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">P/E Ratio</span>
              <span className="font-medium">{currentStock.pe?.toFixed(2) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Dividend Yield</span>
              <span className="font-medium">{currentStock.dividendYield?.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Industry</span>
              <span className="font-medium">{currentStock.industry || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Performance</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Open</span>
              <span className="font-medium">${currentStock.previousClose?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Today's High</span>
              <span className="font-medium">${currentStock.dayHigh?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Today's Low</span>
              <span className="font-medium">${currentStock.dayLow?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">52W High</span>
              <span className="font-medium">${currentStock.week52High?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">52W Low</span>
              <span className="font-medium">${currentStock.week52Low?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Trade Modal */}
      {showTradeModal && (
        <TradeModal
          stock={currentStock}
          type={tradeType}
          onClose={() => setShowTradeModal(false)}
          onConfirm={tradeType === 'BUY' ? handleBuy : handleSell}
          userBalance={user?.virtualBalance}
        />
      )}
    </div>
  );
};

export default StockDetails;