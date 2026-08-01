"use client";

import React, { useState, useEffect } from "react";
import { Printer, X, ShieldCheck, CheckCircle2, Download, AlertOctagon } from "lucide-react";
import { InvoiceMetadata } from "@/services/billing.service";

interface ThermalReceiptModalProps {
  orderId?: string;
  bookingId?: string;
  onClose: () => void;
}

export function ThermalReceiptModal({ orderId, bookingId, onClose }: ThermalReceiptModalProps) {
  const [invoice, setInvoice] = useState<InvoiceMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const [format, setFormat] = useState<"THERMAL" | "A4">("THERMAL");

  useEffect(() => {
    async function loadInvoice() {
      try {
        const query = orderId ? `orderId=${orderId}` : `bookingId=${bookingId}`;
        const res = await fetch(`/api/payments/invoice?${query}`);
        const json = await res.json();
        if (json.success && json.data) {
          setInvoice(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch invoice metadata:", err);
      } finally {
        setLoading(false);
      }
    }
    loadInvoice();
  }, [orderId, bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="text-white text-xs font-mono">Generating GST Tax Invoice...</div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-neutral-900 border border-white/10 p-6 rounded-xl text-center space-y-4 max-w-sm">
          <p className="text-red-400 text-xs">Failed to load invoice records.</p>
          <button onClick={onClose} className="px-4 py-2 bg-neutral-800 text-white rounded text-xs font-bold">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans select-none overflow-y-auto">
      <div className="max-w-md w-full bg-neutral-950 border border-white/10 rounded-2xl shadow-lux overflow-hidden flex flex-col my-auto">
        {/* Modal Controls Header */}
        <div className="p-4 bg-neutral-900 border-b border-white/10 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">GST Tax Receipt</span>
            <div className="flex bg-neutral-800 p-0.5 rounded text-[10px] font-mono">
              <button
                onClick={() => setFormat("THERMAL")}
                className={`px-2 py-0.5 rounded ${format === "THERMAL" ? "bg-[#C5A880] text-black font-bold" : "text-neutral-400"}`}
              >
                80mm POS
              </button>
              <button
                onClick={() => setFormat("A4")}
                className={`px-2 py-0.5 rounded ${format === "A4" ? "bg-[#C5A880] text-black font-bold" : "text-neutral-400"}`}
              >
                A4 Tax Sheet
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-[#C5A880] hover:bg-[#A37C40] text-black rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Reprint</span>
            </button>
            <button onClick={onClose} className="p-1.5 text-neutral-400 hover:text-white cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Container */}
        <div className="p-6 overflow-y-auto max-h-[75vh] print:max-h-none print:p-0 print:m-0">
          <div className="bg-white text-black p-6 rounded-lg shadow-md font-mono text-xs space-y-4 print:shadow-none print:w-full print:rounded-none">
            {/* Header Brand */}
            <div className="text-center space-y-1 border-b-2 border-dashed border-black pb-4">
              <h2 className="font-serif text-lg font-bold tracking-wider">{invoice.hotelDetails.name}</h2>
              <p className="text-[10px] leading-tight">{invoice.hotelDetails.address}</p>
              <p className="text-[10px]">GSTIN: <strong>{invoice.hotelDetails.gstin}</strong> | SAC: {invoice.sacCode}</p>
              <p className="text-[10px]">Ph: {invoice.hotelDetails.phone}</p>
            </div>

            {/* Bill Details */}
            <div className="flex justify-between text-[10px] border-b border-dashed border-gray-400 pb-3">
              <div>
                <p><strong>Inv No:</strong> {invoice.invoiceNumber}</p>
                <p><strong>Bill No:</strong> {invoice.billNumber}</p>
                <p><strong>Date:</strong> {new Date(invoice.issuedAt).toLocaleString()}</p>
              </div>
              <div className="text-right">
                <p><strong>Guest:</strong> {invoice.customerDetails.name}</p>
                <p><strong>Ph:</strong> {invoice.customerDetails.phone}</p>
                <p><strong>Status:</strong> <span className="uppercase">{invoice.paymentStatus}</span></p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-[10px] border-b-2 border-dashed border-black pb-3">
              <thead>
                <tr className="border-b border-black font-bold">
                  <th className="pb-1">Item Description</th>
                  <th className="pb-1 text-center">Qty</th>
                  <th className="pb-1 text-right">Price</th>
                  <th className="pb-1 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-1">{item.description}</td>
                    <td className="py-1 text-center">{item.quantity}</td>
                    <td className="py-1 text-right">₹{item.unitPrice}</td>
                    <td className="py-1 text-right">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* GST Tax Breakdown */}
            <div className="space-y-1 text-[10px] border-b-2 border-dashed border-black pb-3">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>₹{invoice.gst.subtotal.toFixed(2)}</span>
              </div>
              {invoice.gst.discount > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Discount:</span>
                  <span>-₹{invoice.gst.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>CGST (2.5%):</span>
                <span>₹{invoice.gst.cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST (2.5%):</span>
                <span>₹{invoice.gst.sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-xs pt-1 border-t border-black">
                <span>Grand Total (Incl. Taxes):</span>
                <span>₹{invoice.gst.grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* QR Code & Payment Method */}
            <div className="text-center pt-2 space-y-2">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=upi://pay?pa=yashgrand03nov@gmail.com&pn=HotelYashGrand&am=${invoice.gst.grandTotal}&cu=INR`}
                alt="UPI QR Code"
                className="mx-auto border border-black p-1 rounded h-20 w-20"
              />
              <p className="text-[9px] uppercase tracking-wider font-bold">Scan to Pay via UPI / Verify Tax Bill</p>
              <p className="text-[9px] italic text-gray-600">Thank you for dining & staying with Hotel Yash Grand!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
