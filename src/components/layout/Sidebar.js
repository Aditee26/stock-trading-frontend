import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  HomeIcon,
  ChartBarIcon,
  WalletIcon,
  ArrowPathIcon,
  StarIcon,
  UserGroupIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector(state => state.auth);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon },
    { name: 'Stock Market', href: '/stocks', icon: ChartBarIcon },
    { name: 'Portfolio', href: '/portfolio', icon: WalletIcon },
    { name: 'Transactions', href: '/transactions', icon: ArrowPathIcon },
    { name: 'Watchlist', href: '/watchlist', icon: StarIcon },
    ...(user?.role === 'admin' ? [
      { name: 'Admin Dashboard', href: '/admin', icon: UserGroupIcon },
      { name: 'Manage Stocks', href: '/admin/stocks', icon: Cog6ToothIcon },
      { name: 'Manage Users', href: '/admin/users', icon: UserGroupIcon }
    ] : [])
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16">
      <div className="flex-1 flex flex-col min-h-0 bg-white border-r border-gray-200">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  } group flex items-center px-2 py-2 text-sm font-medium rounded-md`}
                >
                  <item.icon
                    className={`${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                    } mr-3 flex-shrink-0 h-6 w-6`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Skill Wallet Section */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center w-full">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                <span className="text-indigo-600 font-bold text-sm">SW</span>
              </div>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-700">Skill Wallet</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
                  JWT
                </span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                  300 Credits
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;