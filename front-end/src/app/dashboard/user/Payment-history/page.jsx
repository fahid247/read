"use client";

import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useAxiosSecure from "@/Hooks/UseAxiosSecure";
import useAuth from "@/Hooks/UseAuth";
import { 
  HiOutlineReceiptRefund, 
  HiOutlineCalendar, 
  HiOutlineCreditCard,
  HiOutlineCheckCircle,
  HiOutlineClock
} from "react-icons/hi";
import { BsBoxSeam } from "react-icons/bs";
import { TbCurrencyTaka } from "react-icons/tb";

const PaymentHistory = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const {
    data: payments = [],
    isLoading,
  } = useQuery({
    queryKey: ["my-payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/payments?customerEmail=${user.email}`
      );
      return res.data;
    },
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Skeleton height={60} width={400} className="mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-base-100 rounded-2xl shadow-lg p-6">
                <Skeleton height={24} width="60%" className="mb-4" />
                <Skeleton height={20} count={4} className="mb-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!payments.length) {
    return (
      <div className="min-h-screen bg-linear-to-br from-base-100 to-base-200 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="bg-base-100 rounded-2xl shadow-xl p-12">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineReceiptRefund className="text-5xl text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-3">No Payments Yet</h3>
            <p className="text-base-content/60 mb-6">
              Your payment history will appear here once you make your first purchase.
            </p>
            <button className="btn btn-primary px-8">
              Browse Books
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate statistics
  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);
  const successfulPayments = payments.filter(p => p.paymentStatus === 'Completed').length;
  const lastPayment = payments[0];

  return (
    <div className="min-h-screen bg-linear-to-br from-base-100 via-base-100 to-base-200 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold playfair">
              Payment<span className="text-primary"> History</span>
            </h1>
            <p className="text-base-content/60 mt-2 flex items-center gap-2">
              <HiOutlineClock className="text-lg" />
              Track all your transactions and receipts
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="flex gap-3">
            <div className="stats shadow-lg rounded-xl bg-base-100">
              <div className="stat">
                <div className="stat-title text-base-content/60">Total Spent</div>
                <div className="stat-value text-2xl text-primary flex items-center">
                  <TbCurrencyTaka className="text-3xl" />
                  {totalSpent.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="stats shadow-lg rounded-xl bg-base-100">
              <div className="stat">
                <div className="stat-title text-base-content/60">Transactions</div>
                <div className="stat-value text-2xl text-success">
                  {payments.length}
                </div>
                <div className="stat-desc text-xs">{successfulPayments} successful</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View - Card Layout */}
        <div className="grid gap-4 md:hidden">
          {payments.map((payment, index) => (
            <div
              key={payment._id}
              className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-200/50 hover:border-primary/20 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-linear-to-r from-primary/5 to-transparent p-4 border-b border-base-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <BsBoxSeam className="text-primary text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-base-content">Order #{index + 1}</p>
                      <p className="text-xs text-base-content/40">
                        {formatDate(payment.paidAt)}
                      </p>
                    </div>
                  </div>
                  <div className="badge rounded-xl badge-success badge-outline gap-1">
                    <HiOutlineCheckCircle />
                    {payment.paymentStatus}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 text-sm">Order Name</span>
                  <span className="font-medium text-base-content">{payment.orderName}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-base-content/60 text-sm flex items-center gap-1">
                    <HiOutlineCreditCard />
                    Transaction ID
                  </span>
                  <span className="font-mono text-xs bg-base-200 px-2 py-1 rounded-lg">
                    {payment.transactionId.slice(0, 12)}...
                  </span>
                </div>
                
                <div className="flex justify-between items-center pt-2 border-t border-base-200">
                  <span className="text-base-content/60 text-sm">Amount</span>
                  <span className="text-xl font-bold text-primary flex items-center">
                    <TbCurrencyTaka />
                    {payment.amount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View - Enhanced Table */}
        <div className="hidden md:block bg-base-100 rounded-2xl shadow-xl border border-base-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table table-lg">
              <thead>
                <tr className="bg-base-200/50">
                  <th className="text-base-content/60 font-medium">#</th>
                  <th className="text-base-content/60 font-medium">Order Details</th>
                  <th className="text-base-content/60 font-medium">Transaction ID</th>
                  <th className="text-base-content/60 font-medium">Amount</th>
                  <th className="text-base-content/60 font-medium">Status</th>
                  <th className="text-base-content/60 font-medium">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
                  <tr 
                    key={payment._id} 
                    className="group hover:bg-linear-to-r hover:from-primary/5 hover:to-transparent transition-all duration-200 cursor-pointer"
                  >
                    <td className="font-medium">
                      <span className="w-8 h-8 bg-base-200 rounded-lg flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all">
                        {index + 1}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                          <BsBoxSeam className="text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-base-content">{payment.orderName}</p>
                          <p className="text-xs text-base-content/40">Order #{payment._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <HiOutlineCreditCard className="text-base-content/40" />
                        <span className="font-mono text-sm bg-base-200 px-2 py-1 rounded-lg">
                          {payment.transactionId}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-xl font-bold text-primary flex items-center">
                        <TbCurrencyTaka />
                        {payment.amount}
                      </span>
                    </td>
                    <td>
                      <div className="badge rounded-sm badge-success gap-1 py-3 px-3">
                        <HiOutlineCheckCircle />
                        {payment.paymentStatus}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2 text-sm">
                        <HiOutlineCalendar className="text-base-content/40" />
                        <span>{formatDate(payment.paidAt)}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer */}
          <div className="bg-base-200/30 px-6 py-4 border-t border-base-200">
            <div className="flex items-center justify-between text-sm text-base-content/60">
              <span>Showing {payments.length} transactions</span>
              <span>Last updated: {formatDate(lastPayment.paidAt)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;