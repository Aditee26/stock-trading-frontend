import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  portfolio: null,
  holdings: [],
  performance: {
    totalValue: 0,
    totalInvestment: 0,
    totalProfitLoss: 0,
    totalProfitLossPercent: 0,
    dayProfitLoss: 0,
    dayProfitLossPercent: 0
  },
  isLoading: false,
  error: null
};

// Async thunks
export const getPortfolio = createAsyncThunk(
  'portfolio/getPortfolio',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/portfolio');
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch portfolio');
    }
  }
);

export const addFunds = createAsyncThunk(
  'portfolio/addFunds',
  async (amount, { rejectWithValue }) => {
    try {
      const response = await api.post('/portfolio/add-funds', { amount });
      toast.success(`$${amount} added successfully!`);
      return response.data.data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add funds');
      return rejectWithValue(error.response?.data?.message);
    }
  }
);

// Slice
const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateHoldingPrice: (state, action) => {
      const { symbol, price, change } = action.payload;
      if (state.holdings) {
        const holding = state.holdings.find(h => h.stock?.symbol === symbol);
        if (holding) {
          holding.currentValue = price * holding.quantity;
          holding.profitLoss = holding.currentValue - holding.totalInvestment;
          holding.profitLossPercent = (holding.profitLoss / holding.totalInvestment) * 100;
          holding.dayChange = change * holding.quantity;
        }
      }
    },
    clearPortfolio: (state) => {
      state.portfolio = null;
      state.holdings = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Portfolio
      .addCase(getPortfolio.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPortfolio.fulfilled, (state, action) => {
        state.isLoading = false;
        state.portfolio = action.payload;
        state.holdings = action.payload?.holdings || [];
        state.performance = {
          totalValue: action.payload?.totalValue || 0,
          totalInvestment: action.payload?.totalInvestment || 0,
          totalProfitLoss: action.payload?.totalProfitLoss || 0,
          totalProfitLossPercent: action.payload?.totalProfitLossPercent || 0,
          dayProfitLoss: action.payload?.dayProfitLoss || 0,
          dayProfitLossPercent: action.payload?.dayProfitLossPercent || 0
        };
      })
      .addCase(getPortfolio.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Add Funds
      .addCase(addFunds.fulfilled, (state, action) => {
        if (state.portfolio) {
          state.portfolio.cashBalance = action.payload.newBalance;
        }
      });
  }
});

export const { updateHoldingPrice, clearPortfolio } = portfolioSlice.actions;
export default portfolioSlice.reducer;