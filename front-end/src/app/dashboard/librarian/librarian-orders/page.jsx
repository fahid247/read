"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Loading from "@/app/Loading";
import { 
  Package, 
  User, 
  DollarSign, 
  CreditCard, 
  Truck, 
  CheckCircle, 
  XCircle,
  Clock,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  ShoppingBag,
  Calendar,
  Mail,
  Phone
} from "lucide-react";

const LibrarianOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["librarian-orders", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${user.email}/status`);
      return res.data;
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
      queryClient.invalidateQueries(["librarian-orders"]);
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to Cancel",
        text: "Something went wrong. Please try again.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#EF4444",
      });
    },
  });

  // Update status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/orders/${id}`, { orderStatus: status }),
    onSuccess: (_, variables) => {
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: `Order status changed to ${variables.status}`,
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 1500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["librarian-orders"]);
    },
  });

  const handleNext = (order) => {
    if (order.orderStatus === "pending") {
      statusMutation.mutate({ id: order._id, status: "shipped" });
    } else if (order.orderStatus === "shipped") {
      statusMutation.mutate({ id: order._id, status: "delivered" });
    }
  };

  const handlePrev = (order) => {
    if (order.orderStatus === "shipped") {
      statusMutation.mutate({ id: order._id, status: "pending" });
    }
  };

  // Filter orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.bookName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || order.orderStatus === statusFilter;
    const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "shipped":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "pending":
        return "bg-warning/10 text-warning border-warning/20";
      case "shipped":
        return "bg-info/10 text-info border-info/20";
      case "delivered":
        return "bg-success/10 text-success border-success/20";
      case "cancelled":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-base-300/10 text-base-content/60 border-base-300/20";
    }
  };

  const getPaymentBadgeClass = (status) => {
    return status === "paid" 
      ? "bg-success/10 text-success border-success/20"
      : "bg-warning/10 text-warning border-warning/20";
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-primary/30"></div>
              <ShoppingBag className="w-6 h-6 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl playfair font-bold mb-3">
              <span className="text-base-content">Order</span>{" "}
              <span className="text-primary">Management</span>
            </h2>
            
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              Track and manage all customer orders in one place
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{orders.length}</p>
              </div>
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Pending</p>
                <p className="text-3xl font-bold text-warning">
                  {orders.filter(o => o.orderStatus === "pending").length}
                </p>
              </div>
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Shipped</p>
                <p className="text-3xl font-bold text-info">
                  {orders.filter(o => o.orderStatus === "shipped").length}
                </p>
              </div>
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Delivered</p>
                <p className="text-3xl font-bold text-success">
                  {orders.filter(o => o.orderStatus === "delivered").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-base-100 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <ShoppingBag className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Orders Yet</h3>
              <p className="text-base-content/60">There are no orders to display at this moment.</p>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-base-100 rounded-2xl shadow-lg p-4 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by book, customer, or email..."
                    className="w-full pl-10 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                    <select
                      className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                    <select
                      className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                      value={paymentFilter}
                      onChange={(e) => setPaymentFilter(e.target.value)}
                    >
                      <option value="all">All Payments</option>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* DESKTOP TABLE  */}
            <div className="hidden md:block bg-base-100 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Book & Customer</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Price</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Payment</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Order Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {filteredOrders.map((order, index) => (
                      <tr key={order._id} className="hover:bg-base-200/50 transition-colors duration-200">
                        <td className="px-6 py-4 text-sm text-base-content/60">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-base-content">{order.bookName}</p>
                            <div className="flex items-center gap-1 mt-1 text-sm text-base-content/60">
                              <Mail className="w-3 h-3" />
                              <span>{order.email}</span>
                            </div>
                            {order.customerName && (
                              <div className="flex items-center gap-1 mt-1 text-sm text-base-content/60">
                                <User className="w-3 h-3" />
                                <span>{order.customerName}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="w-4 h-4" />
                            <span>{order.price}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getPaymentBadgeClass(order.paymentStatus)}`}>
                            <CreditCard className="w-3 h-3" />
                            {order.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(order.orderStatus)}`}>
                            {getStatusIcon(order.orderStatus)}
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {order.paymentStatus !== "paid" &&
                              order.orderStatus === "shipped" && (
                                <button
                                  className="p-2 bg-base-200 text-base-content/70 rounded-lg hover:bg-info hover:text-white transition-all duration-200"
                                  onClick={() => handlePrev(order)}
                                  title="Move to Previous Status"
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>
                              )}

                            {order.paymentStatus === "paid" &&
                              (order.orderStatus === "pending" ||
                                order.orderStatus === "shipped") && (
                                <button
                                  className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                  onClick={() => handleNext(order)}
                                  title="Move to Next Status"
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              )}

                            {order.orderStatus !== "cancelled" &&
                              order.orderStatus !== "delivered" &&
                              order.paymentStatus !== "paid" && (
                                <button
                                  className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-all duration-200"
                                  onClick={() => cancelMutation.mutate(order._id)}
                                  title="Cancel Order"
                                >
                                  <XCircle className="w-4 h-4" />
                                </button>
                              )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/*  MOBILE CARDS  */}
            <div className="block md:hidden space-y-4">
              {filteredOrders.map((order, index) => (
                <div
                  key={order._id}
                  className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-200 hover:border-primary/30 transition-all duration-300"
                >
                  <div className="bg-linear-to-r from-primary/5 to-secondary/5 p-4 border-b border-base-200">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        <span className="font-semibold text-base-content">Order #{index + 1}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(order.orderStatus)}`}>
                        {getStatusIcon(order.orderStatus)}
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <p className="text-sm text-base-content/60">Book</p>
                      <p className="font-semibold text-base-content">{order.bookName}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-primary" />
                        <span className="text-base-content/80">{order.email}</span>
                      </div>
                      {order.customerName && (
                        <div className="flex items-center gap-2 text-sm">
                          <User className="w-4 h-4 text-primary" />
                          <span className="text-base-content/80">{order.customerName}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between py-2 border-y border-base-200">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-primary" />
                        <span className="font-bold text-lg text-primary">৳{order.price}</span>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getPaymentBadgeClass(order.paymentStatus)}`}>
                        <CreditCard className="w-3 h-3" />
                        {order.paymentStatus}
                      </span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {order.paymentStatus !== "paid" &&
                        order.orderStatus === "shipped" && (
                          <button
                            className="flex-1 px-3 py-2 bg-base-200 text-base-content/70 rounded-xl hover:bg-info hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-1"
                            onClick={() => handlePrev(order)}
                          >
                            <ChevronLeft className="w-4 h-4" />
                            Previous
                          </button>
                        )}

                      {order.paymentStatus === "paid" &&
                        (order.orderStatus === "pending" ||
                          order.orderStatus === "shipped") && (
                          <button
                            className="flex-1 px-3 py-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-1"
                            onClick={() => handleNext(order)}
                          >
                            Next
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        )}

                      {order.orderStatus !== "cancelled" &&
                        order.orderStatus !== "delivered" &&
                        order.paymentStatus !== "paid" && (
                          <button
                            className="flex-1 px-3 py-2 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-1"
                            onClick={() => cancelMutation.mutate(order._id)}
                          >
                            <XCircle className="w-4 h-4" />
                            Cancel
                          </button>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredOrders.length < orders.length && (
              <div className="mt-4 text-center text-sm text-base-content/60">
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LibrarianOrders;