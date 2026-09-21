'use client';

import React, { useState } from 'react';
import {
  PackageCheck,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  AlertCircle,
  Eye,
  FileSpreadsheet,
  Download,
  Filter,
} from 'lucide-react';
import { OrderItem } from '@/lib/types';

interface OrdersViewProps {
  orders: OrderItem[];
  onUpdateOrders: (orders: OrderItem[]) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ orders, onUpdateOrders }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [activeOrder, setActiveOrder] = useState<OrderItem | null>(null);

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerPhone.includes(searchTerm) ||
      o.shippingAddress.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || o.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, newStatus: OrderItem['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    onUpdateOrders(updated);
    if (activeOrder && activeOrder.id === orderId) {
      setActiveOrder({ ...activeOrder, status: newStatus });
    }
  };

  const getStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'confirmed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-emerald-200 text-emerald-900 border-emerald-300';
      case 'pending_confirmation':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-zinc-100 text-zinc-800 border-zinc-200';
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Orders & Leads Captured</h1>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-indigo-200">
              AI Automated Checkout
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Orders generated directly from Facebook Messenger AI conversations with verified customer addresses and phone numbers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const headers = 'Order,Customer,Phone,Address,Total,Status\n';
              const rows = orders.map((o) => `"${o.orderNumber}","${o.customerName}","${o.customerPhone}","${o.shippingAddress}",${o.total},"${o.status}"`).join('\n');
              const blob = new Blob([headers + rows], { type: 'text/csv' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'Apex_Mart_Orders_2026.csv';
              a.click();
            }}
            className="px-3.5 py-1.5 bg-white border border-zinc-300 hover:bg-zinc-50 text-zinc-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-zinc-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-50/50">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-4 h-4 text-zinc-500" />
            <h2 className="text-sm font-bold text-zinc-900">Captured Orders List</h2>
            <span className="text-xs text-zinc-500">({filtered.length} total)</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter by order status"
              className="px-2.5 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs font-medium text-zinc-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="pending_confirmation">Pending Confirmation</option>
              <option value="confirmed">Confirmed</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>

            <div className="relative w-56 sm:w-64">
              <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search order #, name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-100/70 border-b border-zinc-200 text-zinc-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Items & Variant</th>
                <th className="py-2.5 px-3">Shipping Address</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => setActiveOrder(order)}
                  className="hover:bg-zinc-50/80 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-3 font-mono font-bold text-indigo-700">{order.orderNumber}</td>
                  <td className="py-3 px-3">
                    <div className="font-semibold text-zinc-900">{order.customerName}</div>
                    <div className="text-[11px] text-zinc-500 font-mono">{order.customerPhone}</div>
                  </td>
                  <td className="py-3 px-3">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="text-zinc-800">
                        <span className="font-semibold">{it.quantity}x {it.productName}</span>
                        <span className="text-[11px] text-zinc-500 ml-1">({it.variant})</span>
                      </div>
                    ))}
                  </td>
                  <td className="py-3 px-3 text-zinc-600 max-w-[200px] truncate">{order.shippingAddress}</td>
                  <td className="py-3 px-3 font-bold text-zinc-900">
                    ৳{order.total.toLocaleString()}
                    <div className="text-[10px] text-zinc-400 font-normal">
                      Incl. ৳{order.deliveryFee} delivery
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveOrder(order);
                      }}
                      className="p-1 text-zinc-400 hover:text-indigo-600 rounded"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {activeOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-zinc-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-zinc-900">Order #{activeOrder.orderNumber}</h3>
                <span className="text-[11px] text-zinc-500">{activeOrder.sourceChannel}</span>
              </div>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-zinc-400 hover:text-zinc-700 font-bold text-lg"
              >
                ×
              </button>
            </div>

            {/* Customer Details */}
            <div className="p-3.5 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Customer Name:</span>
                <span className="font-bold text-zinc-900">{activeOrder.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Mobile Phone:</span>
                <span className="font-mono text-zinc-900 font-semibold">{activeOrder.customerPhone}</span>
              </div>
              <div>
                <span className="text-zinc-500">Delivery Address:</span>
                <p className="font-medium text-zinc-800 mt-0.5">{activeOrder.shippingAddress}</p>
              </div>
            </div>

            {/* Items Breakdown */}
            <div className="space-y-2 text-xs">
              <div className="font-bold text-zinc-800 uppercase text-[10px] tracking-wider">
                Purchased Items
              </div>
              {activeOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-1 border-b border-zinc-100">
                  <div>
                    <span className="font-semibold text-zinc-900">{item.productName}</span>
                    <span className="text-zinc-500 text-[11px] ml-1.5">({item.variant})</span>
                  </div>
                  <span className="font-bold text-zinc-900">
                    {item.quantity} x ৳{item.price} = ৳{item.quantity * item.price}
                  </span>
                </div>
              ))}

              <div className="pt-2 flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span>৳{activeOrder.subtotal}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Delivery Charge (Dhaka/Outside)</span>
                <span>৳{activeOrder.deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-zinc-900 pt-1 border-t border-zinc-200">
                <span>Total Due (Cash on Delivery)</span>
                <span>৳{activeOrder.total}</span>
              </div>
            </div>

            {/* Status Changer */}
            <div className="pt-2 border-t border-zinc-100 flex items-center justify-between">
              <span className="text-xs text-zinc-500 font-medium">Update Status:</span>
              <select
                value={activeOrder.status}
                onChange={(e) => handleStatusChange(activeOrder.id, e.target.value as any)}
                aria-label="Update order status"
                className="px-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs font-semibold text-zinc-800 focus:outline-none"
              >
                <option value="pending_confirmation">Pending Confirmation</option>
                <option value="confirmed">Confirmed</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
