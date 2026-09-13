"use client";

import React, { useState } from "react";

interface CustomerDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer: any;
  onAddActivity?: (customerId: string, note: string, type: string) => void;
}

export function CustomerDetailDrawer({ isOpen, onClose, customer, onAddActivity }: CustomerDetailDrawerProps) {
  const [showActivityForm, setShowActivityForm] = useState(false);
  const [activityNote, setActivityNote] = useState("");
  const [activityType, setActivityType] = useState("Note");

  React.useEffect(() => {
    setShowActivityForm(false);
    setActivityNote("");
  }, [customer]);
  if (!isOpen || !customer) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/60 transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-[450px] h-full flex flex-col shadow-2xl transition-transform transform overflow-y-auto bg-[#f8f9fc]">
        
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{customer.name}</h2>
              <p className="text-sm text-gray-500 mt-0.5">{customer.company || "Independent Customer"}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 p-6 space-y-6">
          
          {/* Contact Info */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">contact_page</span>
              Contact Information
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[16px]">mail</span>
                {customer.email || "No email provided"}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-gray-400 text-[16px]">call</span>
                {customer.phone || "No phone provided"}
              </p>
              <p className="text-sm text-gray-700 flex items-center gap-2 mt-2">
                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  Status: {customer.status}
                </span>
              </p>
            </div>
          </div>

          {/* Account Manager */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Account Manager</p>
              <p className="text-sm font-medium text-gray-800">Sarah Jenkins</p>
            </div>
            <button className="text-[#00b894] hover:bg-[#e6f4f1] px-2 py-1 rounded text-xs font-medium transition-colors">
              Reassign
            </button>
          </div>

          {/* Recent Orders */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">shopping_cart</span>
              Recent Orders
            </h3>
            <div className="space-y-3">
              {[
                { id: "ORD-2026-991", total: "$1,240.00", status: "Delivered", date: "Jul 2, 2026" },
                { id: "ORD-2026-882", total: "$450.00", status: "Processing", date: "Jul 5, 2026" },
              ].map((ord) => (
                <div key={ord.id} className="flex justify-between items-center border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-sm font-medium text-[#00b894] cursor-pointer hover:underline">{ord.id}</p>
                    <p className="text-xs text-gray-500">{ord.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-800">{ord.total}</p>
                    <p className="text-xs text-gray-500">{ord.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-3 py-1.5 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 rounded transition-colors">
              View All Orders
            </button>
          </div>

          {/* Returns */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">assignment_return</span>
              Recent Returns
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-red-500 cursor-pointer hover:underline">RTN-9912</p>
                  <p className="text-xs text-gray-500">Defective item</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-800">1 Item</p>
                  <p className="text-xs text-gray-500">Processed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity History */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-gray-400 text-[18px]">history</span>
              Recent Activity
            </h3>
            <div className="space-y-3">
              {(customer.activities || []).length > 0 ? (
                customer.activities.map((act: any, idx: number) => (
                  <div key={idx} className="flex gap-3 border-b border-gray-50 pb-2 last:border-0 last:pb-0">
                    <div className="mt-0.5">
                      <span className={`material-symbols-outlined text-[16px] ${act.type === 'Call' ? 'text-blue-500' : 'text-orange-500'}`}>
                        {act.type === 'Call' ? 'phone_in_talk' : 'sticky_note_2'}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-800">{act.note}</p>
                      <p className="text-xs text-gray-500">{new Date(act.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No recent activity.</p>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-gray-200 shrink-0 flex flex-col gap-3">
          {showActivityForm ? (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col gap-3">
              <h4 className="text-sm font-semibold text-gray-800">Add Activity</h4>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Type</label>
                <select value={activityType} onChange={e => setActivityType(e.target.value)} className="w-full h-8 px-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-brand">
                  <option>Note</option>
                  <option>Call</option>
                  <option>Meeting</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Details</label>
                <textarea 
                  value={activityNote} 
                  onChange={e => setActivityNote(e.target.value)} 
                  className="w-full h-20 p-2 border border-gray-300 rounded bg-white text-sm focus:outline-none focus:border-brand resize-none"
                  placeholder="Enter notes here..."
                />
              </div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => setShowActivityForm(false)} className="flex-1 bg-white border border-gray-300 text-gray-700 text-sm font-medium py-1.5 rounded hover:bg-gray-100 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (activityNote.trim()) {
                      onAddActivity?.(customer.id, activityNote, activityType);
                      setShowActivityForm(false);
                      setActivityNote("");
                    }
                  }} 
                  className="flex-1 bg-[#00b894] text-white text-sm font-medium py-1.5 rounded hover:bg-[#00a383] transition-colors disabled:opacity-50"
                  disabled={!activityNote.trim()}
                >
                  Save Activity
                </button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button className="flex-1 bg-white border border-gray-300 text-gray-700 font-medium py-2 rounded shadow-sm hover:bg-gray-50 transition-colors flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">edit</span> Edit
              </button>
              <button onClick={() => setShowActivityForm(true)} className="flex-1 bg-[#00b894] text-white font-medium py-2 rounded shadow-sm hover:bg-[#00a383] transition-colors flex justify-center items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_comment</span> Add Activity
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
