import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  CurrencyDollarIcon,
  ChartPieIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { getPortfolio } from '../redux/slices/portfolioSlice';
import { getStocks } from '../redux/slices/stockSlice';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { portfolio, performance, isLoading: portfolioLoading } = useSelector(state => state.portfolio);
  const { stocks, isLoading: stocksLoading } = useSelector(state => state.stocks);

  useEffect(() => {
    dispatch(getPortfolio());
    dispatch(getStocks({ limit: 6 }));
  }, [dispatch]);

  const stats = [
    {
      name: 'Total Value',
      value: `$${performance?.totalValue?.toLocaleString() || '0'}`,
      change: '+0%',
      icon: CurrencyDollarIcon,
      color: 'bg-blue-500'
    },
    {
      name: "Today's P/L",
      value: `$${performance?.dayProfitLoss?.toFixed(2) || '0'}`,
      change: `${performance?.dayProfitLossPercent?.toFixed(2) || '0'}%`,
      icon: performance?.dayProfitLoss >= 0 ? ArrowTrendingUpIcon : ArrowTrendingDownIcon,
      color: performance?.dayProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
    },
    {
      name: 'Total P/L',
      value: `$${performance?.totalProfitLoss?.toFixed(2) || '0'}`,
      change: `${performance?.totalProfitLossPercent?.toFixed(2) || '0'}%`,
      icon: ChartPieIcon,
      color: performance?.totalProfitLoss >= 0 ? 'bg-green-500' : 'bg-red-500'
    },
    {
      name: 'Cash Balance',
      value: `$${user?.virtualBalance?.toLocaleString() || '100,000'}`,
      change: 'Available',
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    }
  ];

  if (portfolioLoading || stocksLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
          Add Funds
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm ${
                stat.change.includes('+') ? 'text-green-600' : 
                stat.change.includes('-') ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Holdings Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Your Holdings</h2>
          <Link to="/portfolio" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        {portfolio?.holdings?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Value</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">P/L</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {portfolio.holdings.map((holding) => (
                  <tr key={holding.stock?._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium text-gray-900">{holding.stock?.symbol}</div>
                        <div className="text-sm text-gray-500">{holding.stock?.companyName}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{holding.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${holding.averageBuyPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${holding.stock?.currentPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${holding.currentValue?.toFixed(2)}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-medium ${
                      holding.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${holding.profitLoss?.toFixed(2)} ({holding.profitLossPercent?.toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No holdings yet. Start trading to build your portfolio!</p>
        )}
      </div>

      {/* Popular Stocks */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Popular Stocks</h2>
          <Link to="/stocks" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            View All →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stocks?.map((stock) => (
            <Link key={stock._id} to={`/stocks/${stock.symbol}`} className="block">
              <div className="border rounded-lg p-4 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-600">{stock.companyName}</p>
                  </div>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                    {stock.sector}
                  </span>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xl font-bold">${stock.currentPrice?.toFixed(2)}</span>
                  <span className={`text-sm font-semibold ${
                    stock.dayChangePercent >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stock.dayChangePercent >= 0 ? '+' : ''}{stock.dayChangePercent?.toFixed(2)}%
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;