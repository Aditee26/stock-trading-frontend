import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  transactions: [],
  currentTransaction: null,
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  }
};

// Async thunks
export const getTransactions = createAsyncThunk(
  'transactions/getTransactions',
  async ({ page = 1, limit = 20, type, symbol } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      params.append('page', page);
      params.append('limit', limit);
      if (type) params.append('type', type);
      if (symbol) params.append('symbol', symbol);
      
      const response = await api.get(`/transactions?${params.toString()}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions');
    }
  }
);

export const buyStock = createAsyncThunk(
  'transactions/buyStock',
  async ({ stockId, quantity, orderType = 'MARKET', limitPrice, stopPrice }, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions/buy', {
        stockId,
        quantity,
        orderType,
        limitPrice,
        stopPrice
      });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to buy stock');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const sellStock = createAsyncThunk(
  'transactions/sellStock',
  async ({ stockId, quantity, orderType = 'MARKET', limitPrice, stopPrice }, { rejectWithValue }) => {
    try {
      const response = await api.post('/transactions/sell', {
        stockId,
        quantity,
        orderType,
        limitPrice,
        stopPrice
      });
      toast.success(response.data.message);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to sell stock');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

export const getTransaction = createAsyncThunk(
  'transactions/getTransaction',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transactions/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transaction');
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    clearCurrentTransaction: (state) => {
      state.currentTransaction = null;
    },
    clearTransactions: (state) => {
      state.transactions = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Transactions
      .addCase(getTransactions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTransactions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(getTransactions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Buy Stock
      .addCase(buyStock.fulfilled, (state, action) => {
        if (action.payload?.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      // Sell Stock
      .addCase(sellStock.fulfilled, (state, action) => {
        if (action.payload?.transaction) {
          state.transactions.unshift(action.payload.transaction);
        }
      })
      // Get Single Transaction
      .addCase(getTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTransaction = action.payload;
      })
      .addCase(getTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentTransaction, clearTransactions } = transactionSlice.actions;
export default transactionSlice.reducer;