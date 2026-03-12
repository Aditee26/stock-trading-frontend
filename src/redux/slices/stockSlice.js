import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  stocks: [],
  currentStock: null,
  marketMovers: {
    gainers: [],
    losers: []
  },
  filters: {
    sectors: []
  },
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  isLoading: false,
  error: null
};

// Async thunks
export const getStocks = createAsyncThunk(
  'stocks/getStocks',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await api.get('/stocks', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stocks');
    }
  }
);

export const getStockBySymbol = createAsyncThunk(
  'stocks/getStockBySymbol',
  async (symbol, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stocks/${symbol}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stock');
    }
  }
);

export const getStockHistory = createAsyncThunk(
  'stocks/getStockHistory',
  async ({ symbol, period }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stocks/${symbol}/history`, { params: { period } });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch history');
    }
  }
);

export const getMarketMovers = createAsyncThunk(
  'stocks/getMarketMovers',
  async (_, { rejectWithValue }) => {
    try {
      const [gainers, losers] = await Promise.all([
        api.get('/stocks/movers/gainers?limit=5'),
        api.get('/stocks/movers/losers?limit=5')
      ]);
      
      return {
        gainers: gainers.data.data,
        losers: losers.data.data
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch market movers');
    }
  }
);

export const searchStocks = createAsyncThunk(
  'stocks/searchStocks',
  async (query, { rejectWithValue }) => {
    try {
      const response = await api.get(`/stocks/search/${query}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Search failed');
    }
  }
);

// Slice
const stockSlice = createSlice({
  name: 'stocks',
  initialState,
  reducers: {
    clearCurrentStock: (state) => {
      state.currentStock = null;
    },
    updateStockPrice: (state, action) => {
      const { symbol, price, change } = action.payload;
      
      // Update in stocks list
      const stockIndex = state.stocks.findIndex(s => s.symbol === symbol);
      if (stockIndex !== -1) {
        state.stocks[stockIndex].currentPrice = price;
        state.stocks[stockIndex].dayChange = change;
      }
      
      // Update in current stock
      if (state.currentStock?.symbol === symbol) {
        state.currentStock.currentPrice = price;
        state.currentStock.dayChange = change;
      }
      
      // Update in market movers
      ['gainers', 'losers'].forEach(category => {
        const moverIndex = state.marketMovers[category].findIndex(s => s.symbol === symbol);
        if (moverIndex !== -1) {
          state.marketMovers[category][moverIndex].currentPrice = price;
          state.marketMovers[category][moverIndex].dayChange = change;
        }
      });
    }
  },
  extraReducers: (builder) => {
    builder
      // Get stocks
      .addCase(getStocks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStocks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stocks = action.payload.data;
        state.filters = action.payload.filters || state.filters;
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getStocks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get single stock
      .addCase(getStockBySymbol.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getStockBySymbol.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStock = action.payload;
      })
      .addCase(getStockBySymbol.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Get market movers
      .addCase(getMarketMovers.fulfilled, (state, action) => {
        state.marketMovers = action.payload;
      })
      // Search stocks
      .addCase(searchStocks.fulfilled, (state, action) => {
        state.stocks = action.payload;
      });
  }
});

export const { clearCurrentStock, updateStockPrice } = stockSlice.actions;
export default stockSlice.reducer;