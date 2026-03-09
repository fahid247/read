"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import Swal from "sweetalert2";
import Loading from "@/app/Loading";
import useAuth from "@/hooks/UseAuth";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import { 
  ShoppingBag, 
  Calendar, 
  Clock, 
  CreditCard, 
  XCircle, 
  CheckCircle, 
  AlertCircle,
  Package,
  ChevronRight,
  BookOpen,
  Store,
  Eye,
  TrendingUp,
  DollarSign
} from "lucide-react";

const MyOrders = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["my-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders?email=${user.email}`);
      return res.data;
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.patch(`/orders/${id}`, { orderStatus: "cancelled" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-orders"]);
      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        text: "Your order has been successfully cancelled.",
        timer: 2000,
        showConfirmButton: false,
        background: 'var(--color-base-100)',
        color: 'var(--color-base-content)',
        confirmButtonColor: 'var(--color-primary)',
      });
    },
  });

  const handleCancel = (id) => {
    Swal.fire({
      title: "Cancel Order?",
      text: "This action cannot be undone",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-base-300)",
      confirmButtonText: "Yes, cancel order",
      cancelButtonText: "Keep order",
      background: 'var(--color-base-100)',
      color: 'var(--color-base-content)',
    }).then((result) => {
      if (result.isConfirmed) {
        cancelMutation.mutate(id);
      }
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-warning/10 text-warning border-warning/20",
        label: "Pending"
      },
      confirmed: {
        icon: CheckCircle,
        color: "bg-primary/10 text-primary border-primary/20",
        label: "Confirmed"
      },
      delivered: {
        icon: Package,
        color: "bg-success/10 text-success border-success/20",
        label: "Delivered"
      },
      cancelled: {
        icon: XCircle,
        color: "bg-error/10 text-error border-error/20",
        label: "Cancelled"
      }
    };
    return configs[status] || configs.pending;
  };

  const getPaymentConfig = (status) => {
    return status === "paid" 
      ? { icon: CheckCircle, color: "bg-success/10 text-success", label: "Paid" }
      : { icon: AlertCircle, color: "bg-warning/10 text-warning", label: "Unpaid" };
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200/50 py-8 sm:py-10 md:py-12 inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section - Responsive */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-primary/10 rounded-xl sm:rounded-2xl">
              <Store className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold playfair">
                <span className="text-base-content">My</span>{" "}
                <span className="text-primary">Orders</span>
              </h1>
              <p className="text-sm sm:text-base text-base-content/70 mt-0.5 sm:mt-1 flex items-center gap-1.5 sm:gap-2">
                <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="truncate">Track and manage your book orders</span>
              </p>
            </div>
          </div>
          <div className="h-0.5 sm:h-1 w-20 sm:w-32 bg-linear-to-r from-primary to-accent rounded-full"></div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12 sm:py-16 md:py-20 bg-base-100 rounded-2xl sm:rounded-3xl shadow-sm border border-base-300 mx-0">
            <div className="inline-flex p-4 sm:p-6 bg-base-200 rounded-full mb-4 sm:mb-6">
              <Package className="w-12 h-12 sm:w-16 sm:h-16 text-base-content/30" />
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-base-content mb-2 playfair px-4">No orders yet</h3>
            <p className="text-sm sm:text-base text-base-content/70 mb-6 sm:mb-8 px-4">Start your reading journey by exploring our collection</p>
            <Link 
              href="/books" 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary text-primary-content font-medium rounded-lg sm:rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg shadow-primary/25 text-sm sm:text-base"
            >
              Browse Books
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
          </div>
        ) : (
          <>
            {/* Stats Cards - Fully Responsive Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {/* Total Orders Card */}
              <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg sm:rounded-xl">
                    <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-xs sm:text-sm text-base-content/70 truncate">Total Orders</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">{orders.length}</p>
              </div>
              
              {/* Pending Card */}
              <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-warning/10 rounded-lg sm:rounded-xl">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-warning" />
                  </div>
                  <span className="text-xs sm:text-sm text-base-content/70 truncate">Pending</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  {orders.filter(o => o.orderStatus === "pending").length}
                </p>
              </div>
              
              {/* Delivered Card */}
              <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-base-300">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-success/10 rounded-lg sm:rounded-xl">
                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-success" />
                  </div>
                  <span className="text-xs sm:text-sm text-base-content/70 truncate">Delivered</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  {orders.filter(o => o.orderStatus === "delivered").length}
                </p>
              </div>
              
              {/* Total Spent Card */}
              <div className="bg-base-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 shadow-sm border border-base-300 col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                  <div className="p-1.5 sm:p-2 bg-accent/10 rounded-lg sm:rounded-xl">
                    <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <span className="text-xs sm:text-sm text-base-content/70 truncate">Total Spent</span>
                </div>
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-base-content">
                  ৳{orders.reduce((acc, order) => acc + (order.price || 0), 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Mobile View - Card Layout (hidden on md and above) */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 md:hidden">
              {orders.map((order) => {
                const StatusIcon = getStatusConfig(order.orderStatus).icon;
                const PaymentIcon = getPaymentConfig(order.paymentStatus).icon;
                
                return (
                  <div key={order._id} className="bg-base-100 rounded-xl sm:rounded-2xl shadow-sm border border-base-300 overflow-hidden hover:shadow-md transition-all duration-300">
                    <div className="p-4 sm:p-5">
                      <div className="flex gap-3 sm:gap-4">
                        {/* Book Image */}
                        <div className="shrink-0">
                          <div className="w-16 h-20 sm:w-20 sm:h-24 bg-base-200 rounded-lg sm:rounded-xl overflow-hidden border border-base-300">
                            {order.bookImage ? (
                              <Image 
                                src={order.bookImage} 
                                alt={order.bookName}
                                width={80}
                                height={96}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-primary/30" />
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Order Details */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base-content text-base sm:text-lg mb-1 line-clamp-2 playfair">
                            {order.bookName}
                          </h3>
                          
                          <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-base-content/70 mb-2">
                            <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                            <span className="truncate">{new Date(order.orderedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}</span>
                          </div>

                          <div className="flex flex-wrap gap-1.5 sm:gap-2">
                            <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getStatusConfig(order.orderStatus).color}`}>
                              <StatusIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="capitalize text-xs">{order.orderStatus}</span>
                            </div>
                            <div className={`inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getPaymentConfig(order.paymentStatus).color}`}>
                              <PaymentIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                              <span className="capitalize text-xs">{order.paymentStatus}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price and Actions */}
                      <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-base-300">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs sm:text-sm text-base-content/70">Total Amount</span>
                          <span className="text-lg sm:text-xl font-bold text-primary">৳{order.price}</span>
                        </div>

                        {order.orderStatus === "pending" && (
                          <div className="flex flex-col xs:flex-row gap-2">
                            <button
                              onClick={() => handleCancel(order._id)}
                              className="flex-1 px-3 sm:px-4 py-2.5 bg-error/10 hover:bg-error/20 text-error font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                            >
                              <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                              Cancel Order
                            </button>

                            {order.paymentStatus === "unpaid" && (
                              <Link
                                href={`/dashboard/user/payment/${order._id}`}
                                className="flex-1 px-3 sm:px-4 py-2.5 bg-primary hover:bg-primary/90 text-primary-content font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 shadow-lg shadow-primary/25 text-xs sm:text-sm"
                              >
                                <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
                                Pay Now
                              </Link>
                            )}
                          </div>
                        )}

                        {order.orderStatus !== "pending" && (
                          <Link
                            href={`/book-details/${order.bookId}`}
                            className="w-full px-3 sm:px-4 py-2.5 bg-base-200 hover:bg-base-300 text-base-content font-medium rounded-lg sm:rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm"
                          >
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                            View Book Details
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop View - Table (hidden on mobile, visible on md and above) */}
            <div className="hidden md:block bg-base-100 rounded-2xl shadow-sm border border-base-300 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-225 lg:min-w-0">
                  <thead>
                    <tr className="bg-base-200 border-b border-base-300">
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Book</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Title & Order ID</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Order Date</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Status</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Payment</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Amount</th>
                      <th className="px-4 lg:px-6 py-4 lg:py-5 text-left text-xs font-semibold text-base-content/70 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-300">
                    {orders.map((order) => {
                      const StatusIcon = getStatusConfig(order.orderStatus).icon;
                      const PaymentIcon = getPaymentConfig(order.paymentStatus).icon;
                      
                      return (
                        <tr key={order._id} className="hover:bg-base-200/50 transition-colors duration-200">
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            <div className="w-12 h-16 bg-base-200 rounded-lg overflow-hidden border border-base-300">
                              {order.bookImage ? (
                                <Image 
                                  src={order.bookImage} 
                                  alt={order.bookName}
                                  width={48}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/5">
                                  <BookOpen className="w-5 h-5 text-primary/30" />
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5">
                            <div className="text-sm font-medium text-base-content playfair max-w-50 lg:max-w-none">
                              {order.bookName}
                            </div>
                            <div className="text-xs text-base-content/70 mt-1">
                              #{order._id.slice(-8)}
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-base-content/70">
                              <Calendar className="w-4 h-4 shrink-0" />
                              <span className="text-xs lg:text-sm">
                                {new Date(order.orderedAt).toLocaleDateString('en-US', { 
                                  month: 'short', 
                                  day: 'numeric', 
                                  year: 'numeric' 
                                })}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs font-medium border ${getStatusConfig(order.orderStatus).color}`}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              <span className="capitalize text-xs">{order.orderStatus}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            <div className={`inline-flex items-center gap-1.5 px-2 lg:px-3 py-1 lg:py-1.5 rounded-full text-xs font-medium ${getPaymentConfig(order.paymentStatus).color}`}>
                              <PaymentIcon className="w-3.5 h-3.5" />
                              <span className="capitalize text-xs">{order.paymentStatus}</span>
                            </div>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            <span className="text-sm font-semibold text-primary">৳{order.price}</span>
                          </td>
                          <td className="px-4 lg:px-6 py-4 lg:py-5 whitespace-nowrap">
                            {order.orderStatus === "pending" ? (
                              <div className="flex flex-col lg:flex-row gap-2">
                                <button
                                  onClick={() => handleCancel(order._id)}
                                  className="px-3 lg:px-4 py-1.5 lg:py-2 bg-error/10 hover:bg-error/20 text-error font-medium rounded-lg transition-all duration-200 text-xs flex items-center justify-center gap-1.5"
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                  <span className="hidden xl:inline">Cancel</span>
                                </button>

                                {order.paymentStatus === "unpaid" && (
                                  <Link
                                    href={`/dashboard/user/payment/${order._id}`}
                                    className="px-3 lg:px-4 py-1.5 lg:py-2 bg-primary hover:bg-primary/90 text-primary-content font-medium rounded-lg transition-all duration-200 text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25"
                                  >
                                    <CreditCard className="w-3.5 h-3.5" />
                                    <span className="hidden xl:inline">Pay</span>
                                  </Link>
                                )}
                              </div>
                            ) : (
                              <Link
                                href={`/book-details/${order.bookId}`}
                                className="px-3 lg:px-4 py-1.5 lg:py-2 bg-base-200 hover:bg-base-300 text-base-content font-medium rounded-lg transition-all duration-200 text-xs flex items-center gap-1.5 w-fit"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span className="hidden xl:inline">View</span>
                              </Link>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyOrders;