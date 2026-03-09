"use client";

import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import useAxiosSecure from '@/hooks/UseAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import useAuth from '@/hooks/UseAuth';
import { 
  CreditCard, 
  BookOpen, 
  Package, 
  ArrowLeft,
  Shield,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Payment = () => {
  const { id } = useParams();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/orders/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  console.log(order)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200/50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 p-8">
            <Skeleton count={6} height={40} className="mb-4" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-base-200/50 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-base-100 rounded-3xl shadow-lg border border-base-300 p-12">
            <div className="inline-flex p-4 bg-error/10 rounded-full mb-4">
              <AlertCircle className="w-12 h-12 text-error" />
            </div>
            <h2 className="text-2xl font-bold text-base-content mb-2">Order Not Found</h2>
            <p className="text-base-content/70 mb-6">The order you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link 
              href="/dashboard/user/my-orders" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-content rounded-xl hover:bg-primary/90 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to My Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    const paymentInfo = {
      name: order.bookName,
      price: order.price,
      email: user.email,
      orderId: order._id,
    };

    const res = await axiosSecure.post('/payments/create-checkout-session',paymentInfo);

    // Redirect to Stripe
    window.location.replace(res.data.url);
  };

  // Check if order is already paid or cancelled
  const isDisabled = order.paymentStatus === 'paid' || order.orderStatus === 'cancelled';
  
  let statusMessage = '';
  if (order.paymentStatus === 'paid') {
    statusMessage = 'This order has already been paid for.';
  } else if (order.orderStatus === 'cancelled') {
    statusMessage = 'This order has been cancelled and cannot be paid.';
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-base-200 via-base-100/50 to-base-200 py-12 inter">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Back Button */}
        <div className="mb-8">
          <Link 
            href="/dashboard/my-orders" 
            className="inline-flex items-center gap-2 text-base-content/70 hover:text-primary transition-colors group"
          >
            <div className="p-2 bg-base-300 rounded-xl group-hover:bg-primary/10 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>Back to My Orders</span>
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Payment Card */}
          <div className="lg:col-span-2">
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 overflow-hidden">
              {/* Header */}
              <div className="p-8 border-b border-base-300 bg-linear-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-primary/10 rounded-2xl">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold playfair">
                      <span className="text-base-content">Complete</span>{" "}
                      <span className="text-primary">Payment</span>
                    </h1>
                    <p className="text-base-content/70 mt-1">Secure checkout powered by Stripe</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-8">
                <h2 className="text-xl font-semibold text-base-content mb-6 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Order Summary
                </h2>

                <div className="bg-base-200/50 rounded-2xl p-6 border border-base-300">
                  <div className="flex gap-6">
                    {/* Book Image */}
                    <div className="shrink-0">
                      <div className="w-24 h-32 bg-base-300 rounded-xl overflow-hidden border border-base-300 shadow-lg">
                        {order.bookImage ? (
                          <Image 
                            src={order.bookImage} 
                            alt={order.bookName}
                            width={96}
                            height={128}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-primary/5">
                            <BookOpen className="w-8 h-8 text-primary/30" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold text-base-content playfair mb-1">
                          {order.bookName}
                        </h3>
                        <p className="text-sm text-base-content/70">
                          Order ID: <span className="font-mono">{order._id.slice(-12)}</span>
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-base-100 rounded-xl p-3 border border-base-300">
                          <p className="text-xs text-base-content/70 mb-1">Price</p>
                          <p className="text-xl font-bold text-primary">
                            ৳{order.price}
                          </p>
                        </div>
                        <div className="bg-base-100 rounded-xl p-3 border border-base-300">
                          <p className="text-xs text-base-content/70 mb-1">Order Date</p>
                          <p className="text-sm font-medium text-base-content">
                            {new Date(order.orderedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric' 
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Status Badges */}
                      <div className="flex gap-2">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                          order.orderStatus === 'pending' 
                            ? 'bg-warning/10 text-warning border-warning/20'
                            : order.orderStatus === 'cancelled'
                            ? 'bg-error/10 text-error border-error/20'
                            : 'bg-success/10 text-success border-success/20'
                        }`}>
                          {order.orderStatus === 'pending' && <AlertCircle className="w-3.5 h-3.5" />}
                          {order.orderStatus === 'cancelled' && <AlertCircle className="w-3.5 h-3.5" />}
                          {order.orderStatus === 'confirmed' && <CheckCircle className="w-3.5 h-3.5" />}
                          {order.orderStatus === 'delivered' && <CheckCircle className="w-3.5 h-3.5" />}
                          <span className="capitalize">{order.orderStatus}</span>
                        </div>

                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${
                          order.paymentStatus === 'paid'
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        }`}>
                          {order.paymentStatus === 'paid' 
                            ? <CheckCircle className="w-3.5 h-3.5" />
                            : <AlertCircle className="w-3.5 h-3.5" />
                          }
                          <span className="capitalize">{order.paymentStatus}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Button Section */}
                <div className="mt-8">
                  {statusMessage ? (
                    <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
                        <p className="text-sm text-base-content/80">{statusMessage}</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="bg-primary/5 rounded-xl p-4 mb-4 border border-primary/10">
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-primary" />
                          <p className="text-sm text-base-content/80">
                            Your payment is secured by <span className="font-semibold text-primary">Stripe</span>. We never store your card information.
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={handlePayment}
                        disabled={isDisabled}
                        className="w-full px-6 py-4 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-primary-content font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-primary/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-primary disabled:hover:to-primary/80"
                      >
                        <CreditCard className="w-5 h-5" />
                        Proceed to Payment (৳{order.price})
                      </button>
                    </>
                  )}

                  {!statusMessage && (
                    <p className="text-xs text-center text-base-content/50 mt-4 flex items-center justify-center gap-1">
                      <Lock className="w-3 h-3" />
                      Secure SSL Encrypted Payment
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-base-100 rounded-3xl shadow-xl border border-base-300 p-6 sticky top-24">
              <h3 className="font-semibold text-base-content mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                Payment Security
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-success/10 rounded-lg">
                    <Lock className="w-4 h-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">256-bit Encryption</p>
                    <p className="text-xs text-base-content/60">Your data is fully encrypted</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-primary/10 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">PCI Compliant</p>
                    <p className="text-xs text-base-content/60">Meets security standards</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 bg-accent/10 rounded-lg">
                    <CreditCard className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-base-content">Multiple Payment Methods</p>
                    <p className="text-xs text-base-content/60">Credit card, debit card, & more</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-base-300">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-base-content/70">Subtotal</span>
                  <span className="font-semibold text-base-content">৳{order.price}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-base-content/70">Tax</span>
                  <span className="text-sm text-base-content/70">Included</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-base-300 mt-2">
                  <span className="font-semibold text-base-content">Total</span>
                  <span className="text-xl font-bold text-primary">৳{order.price}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="mt-6 text-center">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-base-200 rounded-full">
                  <Lock className="w-3 h-3 text-primary" />
                  <span className="text-xs text-base-content/70">Trusted Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-sm text-base-content/60">
            Having trouble?{" "}
            <Link href="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;