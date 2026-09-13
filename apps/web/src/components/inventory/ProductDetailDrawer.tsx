"use client";

import React, { useState } from "react";

interface ProductDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: any;
  onAdjustStock?: (sku: string, newQty: number, reason: string) => void;
}

export function ProductDetailDrawer({ isOpen, onClose, product, onAdjustStock }: ProductDetailDrawerProps) {
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustQty, setAdjustQty] = useState<number | "">("");
  const [adjustReason, setAdjustReason] = useState("Cycle Count");

  // Reset modal state when product changes
  React.useEffect(() => {
    setShowAdjustModal(false);
    if (product) {
      setAdjustQty(product.qty || product.available);
    }
  }, [product]);
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-[500px] h-full flex flex-col shadow-2xl transition-transform transform overflow-y-auto bg-[#f8f9fc]">
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-200">
          <div>
            <h2 className="text-xl font-bold text-gray-800">{product.sku}</h2>
            <p className="text-sm text-gray-500 mt-1">{product.name}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
             <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total Available</p>
                <p className="text-2xl font-bold text-gray-800">{product.available}</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Reserved</p>
                <p className="text-xl font-bold text-gray-600">{product.reserved}</p>
             </div>
             <div className="text-right">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Status</p>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  product.status === "In Stock" ? "bg-green-100 text-green-700" :
                  product.status === "Low Stock" ? "bg-orange-100 text-orange-700" :
                  "bg-red-100 text-red-700"
                }`}>{product.status}</span>
             </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">location_on</span>
              Stock by Zone
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center border-b border-gray-50 pb-2">
                <div>
                  <p className="text-sm font-medium text-gray-700">Zone A (Aisle 4)</p>
                  <p className="text-xs text-gray-400">Location A-12-B</p>
                </div>
                <p className="text-sm font-bold text-gray-800">{Math.floor(product.available * 0.7)} units</p>
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-700">Zone B (Aisle 12)</p>
                  <p className="text-xs text-gray-400">Location B-04-C</p>
                </div>
                <p className="text-sm font-bold text-gray-800">{Math.ceil(product.available * 0.3)} units</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">settings</span>
              Reorder Settings
            </h3>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Reorder Point</span>
              <span className="text-sm font-bold text-gray-800">50 units</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Reorder Quantity</span>
              <span className="text-sm font-bold text-gray-800">200 units</span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-sm text-gray-600">Lead Time</span>
              <span className="text-sm font-bold text-gray-800">14 Days</span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Barcode</p>
            <div className="inline-block p-2 border border-gray-200 rounded">
               <div className="flex gap-0.5 h-12 w-48 bg-white justify-center">
                 <div className="w-1 bg-black h-full"></div>
                 <div className="w-0.5 bg-black h-full"></div>
                 <div className="w-2 bg-black h-full"></div>
                 <div className="w-1 bg-black h-full"></div>
                 <div className="w-1.5 bg-black h-full"></div>
                 <div className="w-0.5 bg-black h-full"></div>
                 <div className="w-2 bg-black h-full"></div>
                 <div className="w-1 bg-black h-full"></div>
                 <div className="w-1.5 bg-black h-full"></div>
                 <div className="w-0.5 bg-black h-full"></div>
                 <div className="w-1 bg-black h-full"></div>
                 <div className="w-2 bg-black h-full"></div>
               </div>
               <p className="text-[10px] font-mono mt-1 text-gray-600">{product.sku}-001</p>
            </div>
          </div>

        </div>

        <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex flex-col gap-3">
          {showAdjustModal ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-800">Adjust Stock</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">Current Qty</label>
                  <input type="text" readOnly value={product.qty || product.available} className="w-full h-8 px-2 border border-gray-300 rounded bg-gray-100 text-sm text-gray-600 font-mono" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 block mb-1">New Qty</label>
                  <input type="number" value={adjustQty} onChange={e => setAdjustQty(e.target.value === "" ? "" : Number(e.target.value))} className="w-full h-8 px-2 border border-gray-300 rounded bg-white text-sm font-mono focus:outline-none focus:border-brand" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Reason</label>
                <select value={adjustReason} onChange={e => setAdjustReason(e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-brand">
                  <option>Cycle Count</option>
                  <option>Damage</option>
                  <option>Found Stock</option>
                  <option>System Correction</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowAdjustModal(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-1.5 rounded hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (typeof adjustQty === 'number') {
                      onAdjustStock?.(product.sku, adjustQty, adjustReason);
                      setShowAdjustModal(false);
                    }
                  }} 
                  className="flex-1 bg-[#00b894] text-white text-sm font-medium py-1.5 rounded hover:bg-[#00a383] transition-colors"
                >
                  Confirm Adjustment
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded shadow-sm hover:bg-gray-50 transition-colors">
                Print Labels
              </button>
              <button onClick={() => setShowAdjustModal(true)} className="flex-1 bg-[#00b894] text-white font-medium py-2 rounded shadow-sm hover:bg-[#00a383] transition-colors">
                Adjust Stock
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
