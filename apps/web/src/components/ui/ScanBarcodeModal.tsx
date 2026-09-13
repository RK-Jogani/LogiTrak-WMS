"use client";

import React, { useState, useEffect } from "react";

interface ScanBarcodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (sku: string) => void;
  title?: string;
  description?: string;
}

const MOCK_DB: Record<string, any> = {
  "SKU-992-8A": { name: "Ergonomic Office Chair", location: "Zone 4", qty: 142, owner: "Office Depot", status: "AVAILABLE" },
  "SKU-411-2B": { name: "Wireless Keyboard", location: "Zone 1", qty: 85, owner: "Tech Corp", status: "AVAILABLE" },
  "SKU-105-9C": { name: "USB-C Monitor", location: "Zone 2", qty: 24, owner: "Dell", status: "LOW STOCK" },
  "SKU-780-4D": { name: "Standing Desk", location: "Zone 4", qty: 12, owner: "IKEA", status: "LOW STOCK" },
  "SKU-330-7E": { name: "Noise Cancelling Headphones", location: "Zone 3", qty: 200, owner: "Sony", status: "AVAILABLE" },
};

export function ScanBarcodeModal({ isOpen, onClose, onSuccess, title = "Scan Barcode", description = "Scan barcode to validate items." }: ScanBarcodeModalProps) {
  const [skuInput, setSkuInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ success: boolean; data?: any; error?: string } | null>(null);

  // Reset state when opened
  useEffect(() => {
    if (isOpen) {
      setSkuInput("");
      setIsScanning(false);
      setScanResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTrigger = () => {
    if (!skuInput) return;
    setIsScanning(true);
    setScanResult(null);

    // Simulate 800ms scan process
    setTimeout(() => {
      setIsScanning(false);
      const data = MOCK_DB[skuInput];
      if (data) {
        setScanResult({ success: true, data: { sku: skuInput, ...data } });
      } else {
        setScanResult({ success: false, error: "Product not found in system." });
      }
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full bg-[#00b894]" />
            <h3 className="text-[15px] font-semibold text-gray-800">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="flex items-center justify-center w-7 h-7 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
        
        <div className="px-5 py-5 space-y-4">
          <p className="text-[13px] text-gray-500">{description}</p>
          
          <input 
            type="text" 
            value={skuInput} 
            onChange={(e) => setSkuInput(e.target.value)}
            placeholder="Enter SKU/Barcode"
            className="w-full h-10 px-3 rounded-lg border border-gray-200 text-[14px] font-mono text-center font-bold tracking-widest bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#00b894] focus:ring-2 focus:ring-[#00b894]/20 transition-all"
            onKeyDown={(e) => e.key === "Enter" && handleTrigger()}
          />
          
          <button 
            onClick={handleTrigger}
            disabled={isScanning || !skuInput}
            className="w-full h-10 rounded-lg text-[13px] font-semibold bg-[#091426] text-white hover:bg-[#1a2b4c] disabled:opacity-50 transition-colors shadow-sm"
          >
            Trigger Scan Sensor
          </button>

          {/* Scan Animation Area */}
          <div className="relative w-full h-24 bg-gray-900 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
            {isScanning ? (
              <>
                <div className="absolute inset-0 bg-[#00b894]/10" />
                <div className="absolute top-0 bottom-0 left-0 w-1 bg-[#00b894] shadow-[0_0_15px_#00b894] animate-[sweep_0.8s_ease-in-out_infinite]" />
                <span className="text-[#00b894] text-xs font-mono animate-pulse">SCANNING...</span>
              </>
            ) : (
              <span className="text-gray-600 text-xs font-mono">SENSOR IDLE</span>
            )}
          </div>

          {/* Results */}
          {scanResult && scanResult.success && (
            <div className="p-4 rounded-xl border border-green-200 bg-green-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined text-green-500 text-[20px] mt-0.5">check_circle</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-green-800 truncate">{scanResult.data.name}</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-2 text-[12px]">
                    <div className="text-gray-500">Loc: <span className="font-medium text-gray-700">{scanResult.data.location}</span></div>
                    <div className="text-gray-500">Qty: <span className="font-medium text-gray-700">{scanResult.data.qty}</span></div>
                    <div className="text-gray-500">Owner: <span className="font-medium text-gray-700 truncate">{scanResult.data.owner}</span></div>
                    <div className="text-gray-500">Status: <span className="font-medium text-gray-700">{scanResult.data.status}</span></div>
                  </div>
                  <button
                    onClick={() => onSuccess(scanResult.data.sku)}
                    className="w-full mt-3 h-8 rounded-md bg-[#00b894] text-white text-[12px] font-semibold hover:bg-[#00a383] transition-colors"
                  >
                    Use this product
                  </button>
                </div>
              </div>
            </div>
          )}

          {scanResult && !scanResult.success && (
            <div className="p-3 rounded-xl border border-red-200 bg-red-50 flex items-center gap-2 text-red-700 text-[13px] font-medium animate-in fade-in slide-in-from-bottom-2">
              <span className="material-symbols-outlined text-red-500 text-[18px]">error</span>
              {scanResult.error}
            </div>
          )}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes sweep {
          0% { transform: translateX(0); }
          50% { transform: translateX(330px); }
          100% { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
