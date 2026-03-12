import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import stockReducer from './slices/stockSlice';
import portfolioReducer from './slices/portfolioSlice';
import transactionReducer from './slices/transactionSlice';
import watchlistReducer from './slices/watchlistSlice';
import uiReducer from './slices/uiSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    stocks: stockReducer,
    portfolio: portfolioReducer,
    transactions: transactionReducer,
    watchlist: watchlistReducer,
    ui: uiReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
});