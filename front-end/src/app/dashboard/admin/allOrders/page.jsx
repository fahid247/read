'use client'

import Loading from '@/app/Loading';
import useAuth from '@/hooks/UseAuth';
import useAxiosSecure from '@/hooks/UseAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import Swal from 'sweetalert2';
import {
  ShoppingBag,
  Package,
  User,
  Mail,
  DollarSign,
  CreditCard,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  ChevronDown,
  ChevronUp,
  MapPin,
  Phone,
  Hash
} from 'lucide-react';

const AllOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Fetch all orders
  const {
    data: orders = [],
    isLoading,
  } = useQuery({
    queryKey: ["all-orders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/orders/allOrders");
      return res.data;
    },
  });

  // Update order status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/orders/${id}`, { orderStatus: status }),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Order status has been updated successfully.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
      queryClient.invalidateQueries(["all-orders"]);
    },
  });

  // Cancel order
  const cancelMutation = useMutation({
    mutationFn: async (id) =>
      axiosSecure.patch(`/orders/${id}`, { orderStatus: "cancelled" }),
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        text: "The order has been cancelled successfully.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
      queryClient.invalidateQueries(["all-orders"]);
    },
  });

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'bg-warning/10 text-warning border-warning/20';
      case 'shipped': return 'bg-info/10 text-info border-info/20';
      case 'delivered': return 'bg-success/10 text-success border-success/20';
      case 'cancelled': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-base-300/10 text-base-content/60 border-base-300/20';
    }
  };

  const getPaymentBadgeClass = (status) => {
    return status?.toLowerCase() === 'paid' 
      ? 'bg-success/10 text-success border-success/20'
      : 'bg-warning/10 text-warning border-warning/20';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const formatAddress = (address) => {
    if (!address) return 'N/A';
    // Remove newlines and trim
    return address.replace(/\n/g, ', ').trim();
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Calculate simple statistics
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + (Number(order.price) || 0), 0);
  const pendingOrders = orders.filter(o => o.orderStatus?.toLowerCase() === 'pending').length;

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-7xl mx-auto">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-0.5 bg-primary/30"></div>
            <ShoppingBag className="w-6 h-6 text-primary" />
            <div className="w-12 h-0.5 bg-primary/30"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl playfair font-bold mb-3">
            <span className="text-base-content">All</span>{' '}
            <span className="text-primary">Orders</span>
          </h2>
          
          <div className="flex flex-wrap justify-center gap-4 text-base-content/70">
            <p>Total Orders: <span className="font-semibold text-primary">{totalOrders}</span></p>
            <p>Total Revenue: <span className="font-semibold text-success">৳{totalRevenue}</span></p>
            <p>Pending: <span className="font-semibold text-warning">{pendingOrders}</span></p>
          </div>
        </div>

        {/* Orders Table */}
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-base-100 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Orders Found</h3>
              <p className="text-base-content/60">There are no orders in the system yet.</p>
            </div>
          </div>
        ) : (
          <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-base-200">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Order Details</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Customer</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Payment</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200">
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-base-200/50 transition-colors duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-base-content">{order.bookName || 'N/A'}</p>
                              <p className="text-xs text-base-content/40 flex items-center gap-1">
                                <Hash className="w-3 h-3" />
                                {order.trackingId || order._id?.slice(-8)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-base-content">{order.name || 'N/A'}</p>
                            <p className="text-sm text-base-content/60 flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {order.email || 'N/A'}
                            </p>
                            {order.phone && (
                              <p className="text-sm text-base-content/60 flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {order.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="w-4 h-4" />
                            <span>৳{order.price || 0}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getPaymentBadgeClass(order.paymentStatus)}`}>
                            <CreditCard className="w-3 h-3" />
                            {order.paymentStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 text-sm text-base-content/60">
                            <Calendar className="w-3 h-3" />
                            <span>{formatDate(order.orderedAt)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleOrderExpand(order._id)}
                              className="p-2 bg-base-200 text-base-content/70 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                              title="View Details"
                            >
                              {expandedOrder === order._id ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </button>
                            
                            {order.orderStatus?.toLowerCase() !== 'cancelled' && 
                             order.orderStatus?.toLowerCase() !== 'delivered' && (
                              <>
                                {order.orderStatus?.toLowerCase() === 'pending' && (
                                  <button
                                    onClick={() => statusMutation.mutate({ id: order._id, status: 'shipped' })}
                                    className="p-2 bg-info/10 text-info rounded-lg hover:bg-info hover:text-white transition-all duration-200"
                                    title="Mark as Shipped"
                                  >
                                    <Truck className="w-4 h-4" />
                                  </button>
                                )}
                                {order.orderStatus?.toLowerCase() === 'shipped' && (
                                  <button
                                    onClick={() => statusMutation.mutate({ id: order._id, status: 'delivered' })}
                                    className="p-2 bg-success/10 text-success rounded-lg hover:bg-success hover:text-white transition-all duration-200"
                                    title="Mark as Delivered"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                  </button>
                                )}
                                {order.paymentStatus?.toLowerCase() !== 'paid' && 
                                 order.orderStatus?.toLowerCase() !== 'cancelled' && (
                                  <button
                                    onClick={() => cancelMutation.mutate(order._id)}
                                    className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-all duration-200"
                                    title="Cancel Order"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                      {/* Expanded Details Row */}
                      {expandedOrder === order._id && (
                        <tr className="bg-base-200/50">
                          <td colSpan="7" className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                  <Package className="w-4 h-4 text-primary" />
                                  Order Information
                                </h4>
                                <p className="text-sm"><span className="font-medium">Order ID:</span> {order._id}</p>
                                <p className="text-sm"><span className="font-medium">Tracking ID:</span> {order.trackingId || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Book Name:</span> {order.bookName || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Book ID:</span> {order.bookId || 'N/A'}</p>
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                  <User className="w-4 h-4 text-primary" />
                                  Customer Details
                                </h4>
                                <p className="text-sm"><span className="font-medium">Name:</span> {order.name || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Email:</span> {order.email || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Phone:</span> {order.phone || 'N/A'}</p>
                                {order.address && (
                                  <p className="text-sm flex items-start gap-1">
                                    <span className="font-medium">Address:</span>
                                    <span className="text-base-content/70">{formatAddress(order.address)}</span>
                                  </p>
                                )}
                              </div>
                              <div className="space-y-2">
                                <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                  <DollarSign className="w-4 h-4 text-primary" />
                                  Payment Details
                                </h4>
                                <p className="text-sm"><span className="font-medium">Amount:</span> ৳{order.price || 0}</p>
                                <p className="text-sm"><span className="font-medium">Payment Status:</span> {order.paymentStatus || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Order Status:</span> {order.orderStatus || 'N/A'}</p>
                                <p className="text-sm"><span className="font-medium">Order Date:</span> {formatDate(order.orderedAt)}</p>
                                <p className="text-sm"><span className="font-medium">Librarian:</span> {order.librarianEmail || 'N/A'}</p>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllOrders;