import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const TradeModal = ({ stock, type, onClose, onConfirm, userBalance }) => {
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState('MARKET');
  const [limitPrice, setLimitPrice] = useState(stock.currentPrice);
  const [stopPrice, setStopPrice] = useState(stock.currentPrice);

  const totalAmount = quantity * (orderType === 'MARKET' ? stock.currentPrice : limitPrice);
  const isBuy = type === 'BUY';
  const hasEnoughBalance = isBuy ? userBalance >= totalAmount : true;

  const handleConfirm = () => {
    onConfirm(quantity, orderType, limitPrice, stopPrice);
  };

  const maxQuantity = isBuy 
    ? Math.floor(userBalance / stock.currentPrice)
    : 1000; // This should be based on actual holdings

  return (
    <Transition appear show={true} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-lg font-semibold">
                    {isBuy ? 'Buy' : 'Sell'} {stock.symbol}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* Stock Info */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-600">{stock.companyName}</p>
                  <p className="text-2xl font-bold mt-1">${stock.currentPrice.toFixed(2)}</p>
                </div>

                {/* Order Type */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type
                  </label>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setOrderType('MARKET')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        orderType === 'MARKET'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Market
                    </button>
                    <button
                      onClick={() => setOrderType('LIMIT')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        orderType === 'LIMIT'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Limit
                    </button>
                    <button
                      onClick={() => setOrderType('STOP')}
                      className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${
                        orderType === 'STOP'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      Stop
                    </button>
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={maxQuantity}
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="input-field"
                    />
                    <button
                      onClick={() => setQuantity(maxQuantity)}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
                    >
                      Max
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Max: {maxQuantity} shares
                  </p>
                </div>

                {/* Limit Price (if limit order) */}
                {orderType === 'LIMIT' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Limit Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={limitPrice}
                        onChange={(e) => setLimitPrice(parseFloat(e.target.value))}
                        className="input-field pl-7"
                      />
                    </div>
                  </div>
                )}

                {/* Stop Price (if stop order) */}
                {orderType === 'STOP' && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stop Price
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        min="0.01"
                        step="0.01"
                        value={stopPrice}
                        onChange={(e) => setStopPrice(parseFloat(e.target.value))}
                        className="input-field pl-7"
                      />
                    </div>
                  </div>
                )}

                {/* Order Summary */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Price per share</span>
                    <span className="font-medium">
                      ${(orderType === 'MARKET' ? stock.currentPrice : limitPrice).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Quantity</span>
                    <span className="font-medium">{quantity}</span>
                  </div>
                  <div className="border-t border-gray-200 my-2 pt-2">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Balance Warning */}
                {isBuy && !hasEnoughBalance && (
                  <p className="text-red-600 text-sm mb-4">
                    Insufficient balance. You need ${totalAmount.toFixed(2)} but have ${userBalance.toFixed(2)}.
                  </p>
                )}

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={onClose}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirm}
                    disabled={!hasEnoughBalance}
                    className={`flex-1 ${isBuy ? 'btn-primary' : 'btn-danger'} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {isBuy ? 'Buy' : 'Sell'}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default TradeModal;