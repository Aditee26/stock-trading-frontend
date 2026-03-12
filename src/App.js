import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import StockMarket from './pages/StockMarket';
import StockDetails from './pages/StockDetails';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import Watchlist from './pages/Watchlist';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminStocks from './pages/admin/AdminStocks';
import AdminUsers from './pages/admin/AdminUsers';

// Redux
import { loadUser } from './redux/slices/authSlice';
import { initializeSocket } from './services/socket';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, user, isLoading } = useSelector(state => state.auth);

  // Load user only once when app starts
  useEffect(() => {
    if (localStorage.getItem('token')) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  // Initialize socket only when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      initializeSocket(user.token);
    }
  }, [isAuthenticated, user]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {isAuthenticated && <Navbar />}
        <div className="flex">
          {isAuthenticated && <Sidebar />}
          <main className={`flex-1 ${isAuthenticated ? 'p-6' : ''}`}>
            <Routes>
              {/* Public Routes - only accessible when NOT authenticated */}
              <Route 
                path="/login" 
                element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/register" 
                element={!isAuthenticated ? <Register /> : <Navigate to="/" />} 
              />
              
              {/* Private Routes - only accessible when authenticated */}
              <Route 
                path="/" 
                element={<PrivateRoute><Dashboard /></PrivateRoute>} 
              />
              <Route 
                path="/stocks" 
                element={<PrivateRoute><StockMarket /></PrivateRoute>} 
              />
              <Route 
                path="/stocks/:symbol" 
                element={<PrivateRoute><StockDetails /></PrivateRoute>} 
              />
              <Route 
                path="/portfolio" 
                element={<PrivateRoute><Portfolio /></PrivateRoute>} 
              />
              <Route 
                path="/transactions" 
                element={<PrivateRoute><Transactions /></PrivateRoute>} 
              />
              <Route 
                path="/watchlist" 
                element={<PrivateRoute><Watchlist /></PrivateRoute>} 
              />
              
              {/* Admin Routes */}
              <Route 
                path="/admin" 
                element={<AdminRoute><AdminDashboard /></AdminRoute>} 
              />
              <Route 
                path="/admin/stocks" 
                element={<AdminRoute><AdminStocks /></AdminRoute>} 
              />
              <Route 
                path="/admin/users" 
                element={<AdminRoute><AdminUsers /></AdminRoute>} 
              />
              
              {/* Catch all - redirect to home */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>
        <ToastContainer 
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </Router>
  );
}

export default App;