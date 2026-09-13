"use client";

import React from "react";

interface OrderDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  order: any; 
  onStartPicking?: (id: string) => void;
  onCancelOrder?: (id: string) => void;
}

export function OrderDetailDrawer({ isOpen, onClose, order, onStartPicking, onCancelOrder }: OrderDetailDrawerProps) {
  const [showCancelConfirm, setShowCancelConfirm] = React.useState(false);

  // Reset confirm state when order changes
  React.useEffect(() => {
    setShowCancelConfirm(false);
  }, [order]);
  if (!isOpen || !order) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 transition-opacity" 
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div 
        className="relative z-10 w-[500px] h-full flex flex-col shadow-2xl transition-transform transform overflow-y-auto"
        style={{ backgroundColor: "#f8f9fc" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Order {order.id}</h2>
            <p className="text-xs text-gray-500 mt-1">Channel: <span className="font-medium text-gray-700">{order.channel}</span> • Due Date: {new Date(order.due).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold uppercase tracking-wider">
              {order.status}
            </span>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          
          {/* Customer Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">person</span>
              Customer Details
            </h3>
            <p className="text-sm font-medium text-gray-800 mb-1">{order.customer}</p>
            <p className="text-xs text-gray-600">Email: {order.customer.toLowerCase().replace(' ', '.')}@example.com</p>
            <p className="text-xs text-gray-600">Phone: +1 (555) 019-8234</p>
          </div>

          {/* Shipping Address */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">local_shipping</span>
              Shipping Address
            </h3>
            <p className="text-sm text-gray-700">1234 Logistics Blvd, Suite 200</p>
            <p className="text-sm text-gray-700">Miami, FL 33101</p>
            <p className="text-sm text-gray-700">United States</p>
          </div>

          {/* Items */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">inventory_2</span>
              Items ({order.items})
            </h3>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">image</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Widget Pro Max</p>
                      <p className="text-xs text-gray-500">SKU: WGT-99{i}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">Qty: {i}</p>
                    <p className="text-xs text-gray-500">$120.00</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between">
              <span className="font-semibold text-gray-700">Total</span>
              <span className="font-bold text-[#00b894]">{order.total}</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">history</span>
              Order Timeline
            </h3>
            <div className="relative border-l border-gray-200 ml-3 space-y-4">
              <div className="relative pl-6">
                <div className="absolute w-2.5 h-2.5 bg-blue-500 rounded-full -left-[5px] top-1 border-2 border-white"></div>
                <p className="text-[10px] text-gray-400 mb-0.5">Today, 10:30 AM</p>
                <p className="text-xs text-gray-600">Order allocated to warehouse</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-2.5 h-2.5 bg-gray-300 rounded-full -left-[5px] top-1 border-2 border-white"></div>
                <p className="text-[10px] text-gray-400 mb-0.5">Today, 08:15 AM</p>
                <p className="text-xs text-gray-600">Payment received via {order.channel}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0">
          {showCancelConfirm ? (
            <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex flex-col gap-3">
              <p className="text-sm text-red-800 font-medium text-center">Are you sure you want to cancel this order?</p>
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-1.5 rounded shadow-sm hover:bg-gray-50 transition-colors text-sm"
                >
                  No, Keep It
                </button>
                <button 
                  onClick={() => {
                    onCancelOrder?.(order.id);
                    setShowCancelConfirm(false);
                  }}
                  className="flex-1 bg-red-600 text-white font-medium py-1.5 rounded shadow-sm hover:bg-red-700 transition-colors text-sm"
                >
                  Yes, Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowCancelConfirm(true)}
                className="flex-1 bg-white border border-gray-300 text-red-600 font-medium py-2 rounded shadow-sm hover:bg-red-50 transition-colors"
              >
                Cancel Order
              </button>
              <button 
                onClick={() => onStartPicking?.(order.id)}
                className="flex-1 bg-[#00b894] text-white font-medium py-2 rounded shadow-sm hover:bg-[#00a383] transition-colors"
              >
                Start Picking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
