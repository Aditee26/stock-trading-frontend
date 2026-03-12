import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { getStocks } from '../redux/slices/stockSlice';
import StockCard from '../components/stocks/StockCard';
import Loader from '../components/common/Loader';
import Pagination from '../components/common/Pagination';

const StockMarket = () => {
  const dispatch = useDispatch();
  const { stocks, filters, pagination, isLoading } = useSelector(state => state.stocks);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [sortBy, setSortBy] = useState('symbol');
  const [sortOrder, setSortOrder] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    dispatch(getStocks({
      page: currentPage,
      search: searchTerm,
      sector: selectedSector,
      sortBy,
      order: sortOrder
    }));
  }, [dispatch, currentPage, searchTerm, selectedSector, sortBy, sortOrder]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleSectorChange = (sector) => {
    setSelectedSector(sector);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSector('');
    setSortBy('symbol');
    setSortOrder('asc');
    setCurrentPage(1);
  };

  if (isLoading && currentPage === 1) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Stock Market</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-secondary flex items-center space-x-2"
        >
          <FunnelIcon className="h-5 w-5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search stocks by symbol or company name..."
            value={searchTerm}
            onChange={handleSearch}
            className="input-field pl-10"
          />
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sector
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleSectorChange('')}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedSector === ''
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {filters.sectors.map(sector => (
                  <button
                    key={sector}
                    onClick={() => handleSectorChange(sector)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedSector === sector
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {sector}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleSort('symbol')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'symbol'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Symbol {sortBy === 'symbol' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('currentPrice')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'currentPrice'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Price {sortBy === 'currentPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
                <button
                  onClick={() => handleSort('dayChangePercent')}
                  className={`px-3 py-1 rounded-md text-sm ${
                    sortBy === 'dayChangePercent'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  % Change {sortBy === 'dayChangePercent' && (sortOrder === 'asc' ? '↑' : '↓')}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Stocks Grid */}
      {stocks.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map(stock => (
              <StockCard key={stock._id} stock={stock} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.pages}
            onPageChange={setCurrentPage}
          />
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No stocks found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default StockMarket;