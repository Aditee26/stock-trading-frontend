import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  watchlist: null,
  stocks: [],
  isLoading: false,
  error: null
};

// Async thunks
export const getWatchlist = createAsyncThunk(
  'watchlist/getWatchlist',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/portfolio/watchlist');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch watchlist');
    }
  }
);

export const addToWatchlist = createAsyncThunk(
  'watchlist/addToWatchlist',
  async (stockId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/portfolio/watchlist/${stockId}`);
      toast.success('Added to watchlist');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add to watchlist');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const removeFromWatchlist = createAsyncThunk(
  'watchlist/removeFromWatchlist',
  async (stockId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/portfolio/watchlist/${stockId}`);
      toast.success('Removed from watchlist');
      return { stockId, data: response.data.data };
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to remove from watchlist');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const setPriceAlert = createAsyncThunk(
  'watchlist/setPriceAlert',
  async ({ stockId, targetPrice, condition }, { rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio/watchlist/alert', {
        stockId,
        targetPrice,
        condition
      });
      toast.success('Price alert set successfully');
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to set price alert');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Slice
const watchlistSlice = createSlice({
  name: 'watchlist',
  initialState,
  reducers: {
    updateWatchlistPrice: (state, action) => {
      const { symbol, price, change } = action.payload;
      if (state.stocks) {
        const stock = state.stocks.find(s => s.symbol === symbol);
        if (stock) {
          stock.currentPrice = price;
          stock.dayChange = change;
        }
      }
    },
    clearWatchlist: (state) => {
      state.watchlist = null;
      state.stocks = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Watchlist
      .addCase(getWatchlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getWatchlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.watchlist = action.payload;
        state.stocks = action.payload?.stocks || [];
      })
      .addCase(getWatchlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add to Watchlist
      .addCase(addToWatchlist.fulfilled, (state, action) => {
        state.watchlist = action.payload;
        state.stocks = action.payload?.stocks || [];
      })
      // Remove from Watchlist
      .addCase(removeFromWatchlist.fulfilled, (state, action) => {
        state.stocks = state.stocks.filter(s => s._id !== action.payload.stockId);
        if (state.watchlist) {
          state.watchlist.stocks = state.stocks;
        }
      });
  }
});

export const { updateWatchlistPrice, clearWatchlist } = watchlistSlice.actions;
export default watchlistSlice.reducer;