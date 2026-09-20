import React, { useState, useMemo } from 'react';
import { 
  Package, Search, Filter, Eye, Printer, MessageSquare, Phone, 
  CheckCircle2, Clock, Truck, AlertTriangle, X, ShieldCheck, ArrowUpRight,
  ChevronDown, Calendar, CreditCard, ShoppingBag, MapPin, User, Mail, DollarSign,
  Tag, Download, Archive, RefreshCw, Layers
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

const ORDER_STATUS_OPTIONS = [
  'Order Received',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled',
  'Returned'
];

const PAYMENT_STATUS_OPTIONS = [
  'Paid',
  'Pending',
  'Failed',
  'Refunded',
  'Cash on Delivery'
];

export const OrdersManager = () => {
  const { orders, updateOrderStatus, archiveOrder, showToast } = useStore();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [showArchived, setShowArchived] = useState(false);

  // Modals state
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
  const [invoiceOrder, setInvoiceOrder] = useState(null);

  // Filtered and Sorted Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Archive filter
      if (showArchived) {
        if (!order.isArchived) return false;
      } else {
        if (order.isArchived) return false;
      }

      // Search term (Order ID, Customer Name, Phone, Email)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const idMatch = (order.id || order.orderNumber || '').toLowerCase().includes(query);
        const nameMatch = (order.customerName || order.address?.fullName || '').toLowerCase().includes(query);
        const phoneMatch = (order.customerPhone || order.address?.phone || '').toLowerCase().includes(query);
        const emailMatch = (order.customerEmail || order.address?.email || '').toLowerCase().includes(query);
        if (!idMatch && !nameMatch && !phoneMatch && !emailMatch) return false;
      }

      // Status filter
      if (statusFilter !== 'All') {
        const currentStatus = order.orderStatus || order.status || 'Order Received';
        if (statusFilter === 'New Orders') {
          if (currentStatus !== 'Order Received') return false;
        } else if (currentStatus !== statusFilter) {
          return false;
        }
      }

      // Payment Status filter
      if (paymentFilter !== 'All') {
        const pStatus = order.paymentStatus || 'Pending';
        if (pStatus !== paymentFilter) return false;
      }

      // Date filter
      if (dateFilter !== 'All') {
        const orderDate = new Date(order.createdAt || Date.now());
        const now = new Date();
        if (dateFilter === 'Today') {
          if (orderDate.toDateString() !== now.toDateString()) return false;
        } else if (dateFilter === 'Last7Days') {
          const diffDays = (now - orderDate) / (1000 * 60 * 60 * 24);
          if (diffDays > 7) return false;
        } else if (dateFilter === 'ThisMonth') {
          if (orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      const dateA = new Date(a.createdAt || 0).getTime();
      const dateB = new Date(b.createdAt || 0).getTime();
      const amountA = Number(a.totalAmount || a.total || 0);
      const amountB = Number(b.totalAmount || b.total || 0);

      if (sortBy === 'newest') return dateB - dateA;
      if (sortBy === 'oldest') return dateA - dateB;
      if (sortBy === 'amount_high') return amountB - amountA;
      if (sortBy === 'amount_low') return amountA - amountB;
      return dateB - dateA;
    });
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, showArchived]);

  // Dashboard Stat Cards Counts
  const activeOrdersCount = orders.filter(o => !o.isArchived).length;
  const newOrdersCount = orders.filter(o => !o.isArchived && (o.orderStatus === 'Order Received' || o.status === 'Order Received')).length;
  const pendingOrdersCount = orders.filter(o => !o.isArchived && (o.paymentStatus === 'Pending' || o.orderStatus === 'Processing')).length;
  const deliveredOrdersCount = orders.filter(o => !o.isArchived && (o.orderStatus === 'Delivered' || o.status === 'Delivered')).length;
  const cancelledOrdersCount = orders.filter(o => !o.isArchived && (o.orderStatus === 'Cancelled' || o.status === 'Cancelled')).length;
  const totalSalesAmount = orders.filter(o => !o.isArchived && o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + Number(o.totalAmount || o.total || 0), 0);

  // Helper for Payment Status Badge formatting
  const renderPaymentBadge = (paymentStatus) => {
    const status = paymentStatus || 'Pending';
    if (status === 'Paid') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-emerald-500/20 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Paid
        </span>
      );
    }
    if (status === 'Pending') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full border border-amber-500/30">
          <Clock className="w-3 h-3 text-amber-400" />
          Pending
        </span>
      );
    }
    if (status === 'Failed') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-rose-500/20 text-rose-300 px-2.5 py-1 rounded-full border border-rose-500/30">
          <AlertTriangle className="w-3 h-3 text-rose-400" />
          Failed
        </span>
      );
    }
    if (status === 'Refunded') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-purple-500/20 text-purple-300 px-2.5 py-1 rounded-full border border-purple-500/30">
          <RefreshCw className="w-3 h-3 text-purple-400" />
          Refunded
        </span>
      );
    }
    if (status === 'Cash on Delivery') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-sky-500/20 text-sky-300 px-2.5 py-1 rounded-full border border-sky-500/30">
          <DollarSign className="w-3 h-3 text-sky-400" />
          COD
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-extrabold bg-stone-800 text-stone-300 px-2.5 py-1 rounded-full border border-stone-700">
        {status}
      </span>
    );
  };

  // Helper for Order Status Badge formatting
  const getOrderStatusColor = (orderStatus) => {
    const s = orderStatus || 'Order Received';
    switch (s) {
      case 'Order Received': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      case 'Confirmed': return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Processing': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Packed': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Shipped': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Out for Delivery': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Delivered': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Cancelled': return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      case 'Returned': return 'bg-amber-600/20 text-amber-400 border-amber-600/30';
      default: return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  // WhatsApp Deep Link Helper
  const handleWhatsAppCustomer = (order) => {
    const rawPhone = order.customerPhone || order.address?.phone || '';
    const cleanPhone = rawPhone.replace(/[^\d]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    
    const customerName = order.customerName || order.address?.fullName || 'Customer';
    const orderId = order.id || order.orderNumber || '';
    const currentStatus = order.orderStatus || order.status || 'Order Received';
    const amount = Number(order.totalAmount || order.total || 0).toLocaleString('en-IN');

    const message = `Hello *${customerName}*,\n\nGreetings from *FUNRADO Luxury Toys*! 🎈\n\nHere is an update regarding your Order *#${orderId}*:\n\n📌 *Current Order Status:* ${currentStatus}\n💰 *Final Order Amount:* ₹${amount}\n\nThank you for shopping with FUNRADO! If you have any questions, feel free to reply to this message.`;

    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">

      {/* Top Banner & Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-white">Customer Orders Management</h3>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2.5 py-0.5 rounded-full font-mono">
              {filteredOrders.length} {showArchived ? 'Archived' : 'Active'} Orders
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            Real-time customer checkout orders synchronized with live database tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer ${
              showArchived 
                ? 'bg-amber-500 text-stone-950 border-amber-500 shadow-md font-extrabold' 
                : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
            }`}
          >
            <Archive className="w-3.5 h-3.5" />
            <span>{showArchived ? 'View Active Orders' : 'View Archived Orders'}</span>
          </button>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Total Orders */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Orders</div>
          <div className="text-2xl font-black text-white">{activeOrdersCount}</div>
          <span className="text-[10px] text-amber-400 font-medium block">All Recorded</span>
        </div>

        {/* New Orders */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">New Received</div>
          <div className="text-2xl font-black text-sky-400">{newOrdersCount}</div>
          <span className="text-[10px] text-sky-300 font-medium block">Requires Action</span>
        </div>

        {/* Pending Orders */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Pending Orders</div>
          <div className="text-2xl font-black text-amber-300">{pendingOrdersCount}</div>
          <span className="text-[10px] text-amber-400 font-medium block">In Processing</span>
        </div>

        {/* Delivered Orders */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Delivered</div>
          <div className="text-2xl font-black text-emerald-400">{deliveredOrdersCount}</div>
          <span className="text-[10px] text-emerald-300 font-medium block">Fulfilled</span>
        </div>

        {/* Cancelled Orders */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Cancelled</div>
          <div className="text-2xl font-black text-rose-400">{cancelledOrdersCount}</div>
          <span className="text-[10px] text-rose-300 font-medium block">Voided</span>
        </div>

        {/* Total Sales */}
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Total Sales</div>
          <div className="text-xl font-black text-amber-300 truncate">₹{totalSalesAmount.toLocaleString('en-IN')}</div>
          <span className="text-[10px] text-amber-400 font-medium block">Confirmed Revenue</span>
        </div>

      </div>

      {/* Filters & Search Controls Toolbar */}
      <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl space-y-3 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search Order ID, Customer Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 outline-none focus:border-amber-500/60"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Order Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-xs text-stone-300 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500/60 cursor-pointer font-bold"
            >
              <option value="All">All Order Statuses</option>
              <option value="New Orders">New Orders (Received)</option>
              {ORDER_STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-xs text-stone-300 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500/60 cursor-pointer font-bold"
            >
              <option value="All">All Payment Statuses</option>
              {PAYMENT_STATUS_OPTIONS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Sort Option */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 text-xs text-stone-300 rounded-xl px-3 py-2.5 outline-none focus:border-amber-500/60 cursor-pointer font-bold"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="amount_high">Sort Amount: High to Low</option>
              <option value="amount_low">Sort Amount: Low to High</option>
            </select>
          </div>

        </div>

        {/* Date Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-800/80">
          <span className="text-[11px] font-bold text-stone-400 mr-2">Filter Date:</span>
          {[
            { id: 'All', label: 'All Time' },
            { id: 'Today', label: 'Today' },
            { id: 'Last7Days', label: 'Last 7 Days' },
            { id: 'ThisMonth', label: 'This Month' },
          ].map(d => (
            <button
              key={d.id}
              onClick={() => setDateFilter(d.id)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all ${
                dateFilter === d.id 
                  ? 'bg-amber-500 text-stone-950 font-black' 
                  : 'bg-stone-950 text-stone-400 hover:text-white border border-stone-800'
              }`}
            >
              {d.label}
            </button>
          ))}

          {(searchTerm || statusFilter !== 'All' || paymentFilter !== 'All' || dateFilter !== 'All') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setPaymentFilter('All');
                setDateFilter('All');
              }}
              className="text-[11px] font-bold text-rose-400 hover:underline ml-auto"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-stone-950 text-stone-400 border-b border-stone-800 uppercase font-bold text-[10px]">
                <th className="py-4 px-4">Order ID</th>
                <th className="py-4 px-4">Date & Time</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Delivery Address</th>
                <th className="py-4 px-4 text-center">Items</th>
                <th className="py-4 px-4 text-right">Total Amount</th>
                <th className="py-4 px-4 text-center">Payment</th>
                <th className="py-4 px-4 text-center">Order Status</th>
                <th className="py-4 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/80 text-stone-300 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="py-16 text-center text-stone-500 font-bold">
                    <Package className="w-12 h-12 text-stone-700 mx-auto mb-2 opacity-50" />
                    <p className="text-stone-400 text-sm">No customer orders match your search criteria.</p>
                    <p className="text-xs text-stone-500 mt-1">Try adjusting your status or search filters.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const orderIdStr = order.id || order.orderNumber || order._id;
                  const customerName = order.customerName || order.address?.fullName || 'Customer';
                  const customerPhone = order.customerPhone || order.address?.phone || 'N/A';
                  const customerEmail = order.customerEmail || order.address?.email || '';
                  const totalItems = (order.items || order.products || []).reduce((acc, item) => acc + (item.quantity || 1), 0);
                  const calculatedTotal = Number(order.totalAmount || order.total || 0);

                  const street = order.address?.street || order.shippingAddress?.street || '';
                  const city = order.address?.city || order.shippingAddress?.city || '';
                  const state = order.address?.state || order.shippingAddress?.state || '';
                  const pincode = order.address?.pincode || order.shippingAddress?.pincode || '';
                  const addressStr = `${street ? street + ', ' : ''}${city}${state ? ', ' + state : ''}${pincode ? ' - ' + pincode : ''}`;

                  const currentOrderStatus = order.orderStatus || order.status || 'Order Received';
                  const currentPaymentStatus = order.paymentStatus || 'Pending';

                  return (
                    <tr key={orderIdStr} className="hover:bg-stone-800/40 transition-colors group">
                      
                      {/* Order ID */}
                      <td className="py-4 px-4 font-mono font-black text-amber-300 whitespace-nowrap">
                        #{orderIdStr}
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-stone-400 whitespace-nowrap text-[11px]">
                        <div>{new Date(order.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                        <div className="text-[10px] text-stone-500">{new Date(order.createdAt || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-white max-w-[160px] truncate">{customerName}</div>
                        <div className="text-[11px] text-stone-400 font-mono">{customerPhone}</div>
                        {customerEmail && <div className="text-[10px] text-stone-500 truncate max-w-[160px]">{customerEmail}</div>}
                      </td>

                      {/* Address */}
                      <td className="py-4 px-4">
                        <div className="text-[11px] text-stone-300 max-w-[200px] line-clamp-2" title={addressStr || 'Address Not Available'}>
                          {addressStr || 'Address Not Available'}
                        </div>
                      </td>

                      {/* Items */}
                      <td className="py-4 px-4 text-center font-mono font-bold text-stone-300">
                        {totalItems}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 text-right font-black text-amber-300 whitespace-nowrap text-sm">
                        ₹{calculatedTotal.toLocaleString('en-IN')}
                      </td>

                      {/* Payment Status */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        {renderPaymentBadge(currentPaymentStatus)}
                        <div className="text-[10px] text-stone-500 mt-1 uppercase font-semibold">
                          {order.paymentMethod || 'UPI'}
                        </div>
                      </td>

                      {/* Order Status Dropdown */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <select
                          value={currentOrderStatus}
                          onChange={(e) => updateOrderStatus(orderIdStr, e.target.value)}
                          className={`text-xs font-extrabold rounded-lg px-2.5 py-1.5 border outline-none cursor-pointer ${getOrderStatusColor(currentOrderStatus)} bg-stone-950`}
                        >
                          {ORDER_STATUS_OPTIONS.map(opt => (
                            <option key={opt} value={opt} className="bg-stone-950 text-white font-medium">
                              {opt}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          
                          {/* View Details */}
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded-lg transition-colors cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* WhatsApp Customer */}
                          <button
                            onClick={() => handleWhatsAppCustomer(order)}
                            className="p-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg transition-colors cursor-pointer"
                            title="Message Customer on WhatsApp"
                          >
                            <MessageSquare className="w-4 h-4 text-emerald-400" />
                          </button>

                          {/* Call Customer */}
                          {customerPhone && customerPhone !== 'N/A' && (
                            <a
                              href={`tel:${customerPhone}`}
                              className="p-1.5 bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 rounded-lg transition-colors"
                              title="Call Customer"
                            >
                              <Phone className="w-4 h-4 text-sky-400" />
                            </a>
                          )}

                          {/* Print Invoice */}
                          <button
                            onClick={() => setInvoiceOrder(order)}
                            className="p-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                            title="Print Tax Invoice"
                          >
                            <Printer className="w-4 h-4 text-amber-400" />
                          </button>

                          {/* Archive Order */}
                          <button
                            onClick={() => archiveOrder(orderIdStr)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              order.isArchived 
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                                : 'bg-stone-800 text-stone-400 hover:text-white border-stone-700'
                            }`}
                            title={order.isArchived ? "Unarchive Order" : "Archive Order"}
                          >
                            <Archive className="w-4 h-4" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW ORDER DETAILS MODAL */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-stone-900 border border-stone-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="bg-stone-950 px-6 py-4 border-b border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/20 p-2.5 rounded-2xl border border-amber-500/30 text-amber-300">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-white">Order Details #{selectedOrderDetails.id || selectedOrderDetails.orderNumber}</h2>
                    {renderPaymentBadge(selectedOrderDetails.paymentStatus)}
                  </div>
                  <p className="text-xs text-stone-400">
                    Placed on {new Date(selectedOrderDetails.createdAt || Date.now()).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              
              {/* Customer & Delivery Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Customer Details Box */}
                <div className="bg-stone-950 border border-stone-800/80 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    <User className="w-4 h-4" />
                    <span>Customer Details</span>
                  </div>
                  <div className="space-y-1 text-xs text-stone-300">
                    <p className="font-bold text-white text-sm">
                      {selectedOrderDetails.customerName || selectedOrderDetails.address?.fullName || 'Valued Customer'}
                    </p>
                    <p className="flex items-center gap-2 font-mono text-stone-300">
                      <Phone className="w-3.5 h-3.5 text-stone-400" />
                      {selectedOrderDetails.customerPhone || selectedOrderDetails.address?.phone || 'N/A'}
                    </p>
                    <p className="flex items-center gap-2 text-stone-400">
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      {selectedOrderDetails.customerEmail || selectedOrderDetails.address?.email || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Delivery Address Box */}
                <div className="bg-stone-950 border border-stone-800/80 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-amber-400">
                    <MapPin className="w-4 h-4" />
                    <span>Full Delivery Address</span>
                  </div>
                  <div className="space-y-0.5 text-xs text-stone-300 font-medium">
                    <p className="text-white font-bold">{selectedOrderDetails.address?.street || selectedOrderDetails.shippingAddress?.street || 'Address Street'}</p>
                    <p>{selectedOrderDetails.address?.city || selectedOrderDetails.shippingAddress?.city || 'City'}, {selectedOrderDetails.address?.state || selectedOrderDetails.shippingAddress?.state || 'State'}</p>
                    <p className="font-mono text-amber-300 font-bold">Pincode: {selectedOrderDetails.address?.pincode || selectedOrderDetails.shippingAddress?.pincode || 'N/A'}</p>
                    {selectedOrderDetails.address?.type && (
                      <span className="inline-block text-[10px] bg-stone-800 text-stone-300 px-2 py-0.5 rounded font-bold uppercase mt-1">
                        Type: {selectedOrderDetails.address.type}
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Order Meta Info Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950 p-4 rounded-2xl border border-stone-800/80 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Payment Method</span>
                  <span className="font-bold text-white">{selectedOrderDetails.paymentMethod || 'UPI'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Transaction Ref</span>
                  <span className="font-mono text-amber-300 font-bold text-[11px] truncate block">
                    {selectedOrderDetails.transactionRef || 'N/A'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Current Order Status</span>
                  <span className="font-bold text-sky-400">{selectedOrderDetails.orderStatus || selectedOrderDetails.status || 'Order Received'}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">Payment Status</span>
                  <span className="font-bold text-emerald-400">{selectedOrderDetails.paymentStatus || 'Pending'}</span>
                </div>
              </div>

              {/* Products Ordered Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-400 flex items-center justify-between">
                  <span>Products Ordered ({(selectedOrderDetails.items || selectedOrderDetails.products || []).length})</span>
                </h4>

                <div className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden divide-y divide-stone-800">
                  {(selectedOrderDetails.items || selectedOrderDetails.products || []).map((item, idx) => {
                    const originalPrice = item.originalPrice || Math.round((item.price || 0) * 1.25);
                    const sellingPrice = item.price || item.sellingPrice || 0;
                    const qty = item.quantity || 1;
                    const itemTotal = sellingPrice * qty;

                    return (
                      <div key={idx} className="p-4 flex items-center gap-4">
                        <img 
                          src={item.image || 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80'} 
                          alt={item.name} 
                          className="w-16 h-16 rounded-xl object-contain bg-stone-900 border border-stone-800 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{item.name || 'FUNRADO Product'}</h5>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <span className="text-[10px] font-mono text-stone-400 bg-stone-900 border border-stone-800 px-2 py-0.5 rounded">
                              SKU: {item.sku || `SKU-${item.id || idx}`}
                            </span>
                            {item.selectedColor && (
                              <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                Color: {item.selectedColor}
                              </span>
                            )}
                            {item.selectedSize && (
                              <span className="text-[10px] font-bold text-sky-300 bg-sky-500/10 border border-sky-500/20 px-2 py-0.5 rounded">
                                Size: {item.selectedSize}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-stone-400">
                            <span className="line-through text-stone-500 mr-1.5">₹{originalPrice.toLocaleString('en-IN')}</span>
                            <span className="font-bold text-white">₹{sellingPrice.toLocaleString('en-IN')}</span> × {qty}
                          </div>
                          <div className="text-sm font-black text-amber-300 mt-0.5">
                            Total: ₹{itemTotal.toLocaleString('en-IN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Price Summary Box */}
              <div className="bg-stone-950 border border-stone-800 p-5 rounded-2xl space-y-2 text-xs">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-400 mb-3">Order Price Summary</h4>
                
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">₹{Number(selectedOrderDetails.subtotal || selectedOrderDetails.totalAmount || 0).toLocaleString('en-IN')}</span>
                </div>

                {selectedOrderDetails.discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount {selectedOrderDetails.couponUsed ? `(${selectedOrderDetails.couponUsed})` : ''}</span>
                    <span className="font-bold">-₹{Number(selectedOrderDetails.discount || 0).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-400">
                  <span>Delivery Charges</span>
                  <span className="font-bold text-emerald-400">
                    {selectedOrderDetails.shippingFee === 0 ? 'FREE' : `₹${selectedOrderDetails.shippingFee}`}
                  </span>
                </div>

                {selectedOrderDetails.taxAmount > 0 && (
                  <div className="flex justify-between text-stone-400">
                    <span>GST Tax (18% Itemized)</span>
                    <span className="font-bold text-stone-300">₹{Number(selectedOrderDetails.taxAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-stone-800">
                  <span>Final Amount</span>
                  <span className="text-amber-300 font-mono text-base">
                    ₹{Number(selectedOrderDetails.totalAmount || selectedOrderDetails.total || 0).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

            </div>

            {/* Modal Footer Actions */}
            <div className="bg-stone-950 p-4 border-t border-stone-800 flex flex-wrap items-center justify-between gap-3">
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-400">Update Status:</span>
                <select
                  value={selectedOrderDetails.orderStatus || selectedOrderDetails.status || 'Order Received'}
                  onChange={(e) => {
                    updateOrderStatus(selectedOrderDetails.id || selectedOrderDetails.orderNumber, e.target.value);
                    setSelectedOrderDetails({ ...selectedOrderDetails, orderStatus: e.target.value, status: e.target.value });
                  }}
                  className="bg-stone-900 border border-stone-800 text-xs font-extrabold text-white rounded-xl px-3 py-2 outline-none cursor-pointer"
                >
                  {ORDER_STATUS_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleWhatsAppCustomer(selectedOrderDetails)}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-400" />
                  <span>WhatsApp Customer</span>
                </button>

                <button
                  onClick={() => {
                    setInvoiceOrder(selectedOrderDetails);
                    setSelectedOrderDetails(null);
                  }}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-extrabold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Tax Invoice</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* PRINTABLE TAX INVOICE MODAL */}
      {invoiceOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in">
          <div className="bg-white text-stone-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            
            {/* Invoice Controls Header */}
            <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-amber-300" />
                <span className="font-extrabold text-sm">Official Tax Invoice Preview</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setInvoiceOrder(null)}
                  className="p-2 text-stone-400 hover:text-white rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Invoice Sheet */}
            <div className="p-8 overflow-y-auto space-y-6 font-sans select-text">
              
              {/* Header Info */}
              <div className="flex justify-between items-start border-b border-stone-200 pb-6">
                <div>
                  <div className="text-2xl font-black text-[#581C25] tracking-tight">FUNRADO</div>
                  <p className="text-xs text-stone-500 font-semibold">Luxury Kids Ride-Ons & Toys</p>
                  <p className="text-[11px] text-stone-500 mt-1">GSTIN: 27AAAAA0000A1Z5 • Support: care@funrado.com</p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-black uppercase text-stone-400 tracking-wider">TAX INVOICE</div>
                  <div className="text-base font-extrabold font-mono text-stone-900">#{invoiceOrder.id || invoiceOrder.orderNumber}</div>
                  <p className="text-xs text-stone-500 mt-1">Date: {new Date(invoiceOrder.createdAt || Date.now()).toLocaleDateString('en-IN')}</p>
                </div>
              </div>

              {/* Addresses Grid */}
              <div className="grid grid-cols-2 gap-6 text-xs">
                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h5 className="font-extrabold uppercase text-[10px] tracking-wider text-stone-500 mb-1">Customer & Billing Info</h5>
                  <p className="font-extrabold text-stone-900 text-sm">{invoiceOrder.customerName || invoiceOrder.address?.fullName || 'Customer'}</p>
                  <p className="text-stone-600 font-mono mt-0.5">{invoiceOrder.customerPhone || invoiceOrder.address?.phone}</p>
                  <p className="text-stone-600 truncate">{invoiceOrder.customerEmail || invoiceOrder.address?.email}</p>
                </div>

                <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
                  <h5 className="font-extrabold uppercase text-[10px] tracking-wider text-stone-500 mb-1">Shipping Destination</h5>
                  <p className="font-bold text-stone-900">{invoiceOrder.address?.street || invoiceOrder.shippingAddress?.street}</p>
                  <p className="text-stone-600">{invoiceOrder.address?.city || invoiceOrder.shippingAddress?.city}, {invoiceOrder.address?.state || invoiceOrder.shippingAddress?.state}</p>
                  <p className="font-mono text-stone-900 font-bold">Pincode: {invoiceOrder.address?.pincode || invoiceOrder.shippingAddress?.pincode}</p>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] border-b border-stone-200">
                      <th className="py-3 px-4">Item & SKU</th>
                      <th className="py-3 px-4 text-center">Color / Size</th>
                      <th className="py-3 px-4 text-center">Qty</th>
                      <th className="py-3 px-4 text-right">Unit Price</th>
                      <th className="py-3 px-4 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 text-stone-800 font-medium">
                    {(invoiceOrder.items || invoiceOrder.products || []).map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3 px-4">
                          <div className="font-bold text-stone-900">{item.name}</div>
                          <div className="text-[10px] font-mono text-stone-500">{item.sku || `SKU-${idx + 100}`}</div>
                        </td>
                        <td className="py-3 px-4 text-center text-stone-600 text-[11px]">
                          {item.selectedColor || 'Standard'} / {item.selectedSize || 'Standard'}
                        </td>
                        <td className="py-3 px-4 text-center font-bold font-mono">
                          {item.quantity || 1}
                        </td>
                        <td className="py-3 px-4 text-right font-mono">
                          ₹{(item.price || item.sellingPrice || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 text-right font-bold font-mono text-stone-900">
                          ₹{((item.price || item.sellingPrice || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Breakdown & Signature */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="text-xs space-y-2">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                    <span className="font-extrabold block">Payment Info:</span>
                    <p>Method: {invoiceOrder.paymentMethod || 'UPI'}</p>
                    <p>Status: <span className="font-bold">{invoiceOrder.paymentStatus || 'Paid'}</span></p>
                    <p className="font-mono text-[10px] text-emerald-700">Ref: {invoiceOrder.transactionRef || 'N/A'}</p>
                  </div>
                  <p className="text-[10px] text-stone-400 italic">This is a computer generated invoice and does not require a physical signature.</p>
                </div>

                <div className="space-y-2 text-xs text-stone-700 font-medium">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-bold text-stone-900">₹{Number(invoiceOrder.subtotal || invoiceOrder.totalAmount || 0).toLocaleString('en-IN')}</span>
                  </div>

                  {invoiceOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Discount:</span>
                      <span className="font-bold">-₹{Number(invoiceOrder.discount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Delivery Charges:</span>
                    <span className="font-bold text-emerald-600">{invoiceOrder.shippingFee === 0 ? 'FREE' : `₹${invoiceOrder.shippingFee}`}</span>
                  </div>

                  {invoiceOrder.taxAmount > 0 && (
                    <div className="flex justify-between">
                      <span>GST (18% Itemized):</span>
                      <span className="font-bold">₹{Number(invoiceOrder.taxAmount).toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm font-black text-[#581C25] pt-2 border-t border-stone-300">
                    <span>Grand Total:</span>
                    <span className="font-mono">₹{Number(invoiceOrder.totalAmount || invoiceOrder.total || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
