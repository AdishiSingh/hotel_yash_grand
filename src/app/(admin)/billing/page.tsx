"use client";

import React, { useState } from "react";
import { INITIAL_ORDERS, POSOrder } from "@/data/admin";
import { Receipt, Calendar, User, Printer, CreditCard, ChevronRight, Sparkles } from "lucide-react";

export default function BillingPage() {
  const [orders, setOrders] = useState<POSOrder[]>(INITIAL_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<POSOrder | null>(INITIAL_ORDERS[0]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 text-neutral-100 pb-12 select-none">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6 text-left">
        <div>
          <h3 className="font-serif text-2xl text-white">Invoicing & Billing</h3>
          <p className="text-xs text-neutral-500 font-sans">
            Review restaurant tickets, banquet invoices, and generate thermal receipts.
          </p>
        </div>
      </div>

      {/* Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Invoice list */}
        <div className="lg:col-span-6 border border-neutral-800 bg-neutral-900/20 rounded-xl p-6 space-y-6 text-left">
          <div className="flex justify-between items-center border-b border-neutral-800 pb-3">
            <h4 className="font-serif text-base text-white font-medium">Recent POS Billings</h4>
            <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold">POS Logs</span>
          </div>

          <div className="space-y-3">
            {orders.map((ord) => (
              <div
                key={ord.id}
                onClick={() => setSelectedOrder(ord)}
                className={`p-4 border rounded-lg flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 ${
                  selectedOrder?.id === ord.id
                    ? "bg-[#DFBA73]/10 border-[#DFBA73]"
                    : "bg-neutral-950/40 border-neutral-800 hover:border-neutral-700"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{ord.id}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#DFBA73] font-bold px-1.5 py-0.5 bg-[#DFBA73]/10 border border-[#DFBA73]/15 rounded-[3px]">
                      {ord.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 block select-text">Guest: {ord.customerName}</span>
                  <span className="text-[10px] text-neutral-500 block font-mono">{ord.time}</span>
                </div>

                <div className="text-right flex items-center gap-3">
                  <div className="space-y-0.5">
                    <span className="text-sm font-mono text-white font-bold block">₹{ord.total.toFixed(2)}</span>
                    <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">{ord.payment}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-neutral-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Thermal Receipt Preview */}
        <div className="lg:col-span-6 space-y-6">
          {selectedOrder ? (
            <div className="space-y-4">
              {/* Thermal Invoice Casing */}
              <div className="border border-neutral-800 bg-neutral-950 p-6 rounded-xl shadow-lux font-mono text-xs text-neutral-300 max-w-sm mx-auto border-t-4 border-t-gold relative text-left">
                {/* Visual thermal cut patterns */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-neutral-950 flex justify-between overflow-hidden select-none pointer-events-none -translate-y-1">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-neutral-900 rotate-45 transform -translate-y-1" />
                  ))}
                </div>

                {/* Receipt header */}
                <div className="text-center space-y-1 pb-4 border-b border-dashed border-neutral-800">
                  <h3 className="font-serif text-base text-white tracking-wider font-bold">HOTEL YASH GRAND</h3>
                  <p className="text-[10px] text-neutral-500 leading-normal">
                    Restaurant & Banquet Facility <br />
                    Near SMS College, Varanasi, UP <br />
                    GSTIN: 09AAPHY1234F1Z8 (MOCK)
                  </p>
                </div>

                {/* Metadata */}
                <div className="py-4 border-b border-dashed border-neutral-800 space-y-1 text-[10.5px]">
                  <div className="flex justify-between select-text">
                    <span>INVOICE: {selectedOrder.id}</span>
                    <span>TABLE: {selectedOrder.table}</span>
                  </div>
                  <div className="flex justify-between select-text">
                    <span>DATE: {selectedOrder.time}</span>
                    <span>TYPE: {selectedOrder.type.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between select-text">
                    <span>GUEST: {selectedOrder.customerName}</span>
                    <span>PHONE: {selectedOrder.customerPhone}</span>
                  </div>
                </div>

                {/* Items grid */}
                <div className="py-4 border-b border-dashed border-neutral-800 space-y-2.5">
                  <div className="flex justify-between text-neutral-500 font-bold">
                    <span className="w-1/2">Item Name</span>
                    <span className="w-1/6 text-center">Qty</span>
                    <span className="w-1/3 text-right">Price</span>
                  </div>

                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-baseline select-text">
                      <span className="w-1/2 text-white font-medium">{item.name}</span>
                      <span className="w-1/6 text-center">{item.qty}</span>
                      <span className="w-1/3 text-right">₹{(item.qty * item.price).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="py-4 space-y-2 border-b border-dashed border-neutral-800 text-[11px]">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{selectedOrder.discount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%)</span>
                    <span>₹{selectedOrder.gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-white text-sm font-bold pt-1">
                    <span>Grand Total</span>
                    <span>₹{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Receipt footer */}
                <div className="text-center pt-4 space-y-2">
                  <div className="flex justify-center items-center gap-1.5 text-[10px] text-neutral-500">
                    <CreditCard className="h-3.5 w-3.5" />
                    <span>Paid via {selectedOrder.payment.toUpperCase()}</span>
                  </div>
                  <p className="text-[10px] text-[#DFBA73] font-serif italic">
                    Thank You! Visit Again
                  </p>
                </div>
              </div>

              {/* Print buttons */}
              <div className="flex justify-center gap-4 font-buttons">
                <button
                  onClick={handlePrint}
                  className="px-8 py-3 bg-[#DFBA73] hover:bg-[#8B5E3C] border-none text-[#0F1115] hover:text-white text-[9.5px] uppercase tracking-widest font-bold rounded-sm flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-sm"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 border border-dashed border-neutral-800 text-center rounded-xl">
              <span className="text-sm text-neutral-500 uppercase tracking-widest block">No Invoice Selected</span>
              <p className="text-xs text-neutral-600 mt-1">Select an invoice on the left to see the receipt preview.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
