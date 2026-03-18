"use client";

import React from "react";
import Link from "next/link";
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";

const PaymentCancelled = () => {
  return (
    <div className="min-h-[80vh] bg-base-200 flex items-center justify-center p-4 inter">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-error/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-warning/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-md w-full">
        {/* Card */}
        <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
          {/* Header Gradient */}
          <div className="h-2 bg-linear-to-r from-error to-warning"></div>
          
          <div className="p-8 text-center">
            {/* Icon */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-24 h-24 bg-error/10 rounded-full blur-xl"></div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center animate-pulse">
                  <XCircle className="w-10 h-10 text-error" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h2 className="text-3xl playfair font-bold text-base-content mb-2">
              Payment <span className="text-error">Cancelled</span>
            </h2>

            {/* Message */}
            <div className="space-y-2 mb-8">
              <p className="text-base-content/70">
                Your payment was cancelled. No charges have been made.
              </p>
              <p className="text-sm text-base-content/60 flex items-center justify-center gap-1">
                <RefreshCw className="w-3 h-3" />
                You can try again anytime
              </p>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-base-300"></div>
              <span className="text-xs text-base-content/40">What would you like to do?</span>
              <div className="flex-1 h-px bg-base-300"></div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link
                href="/dashboard/my-orders"
                className="group relative w-full overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-content font-semibold py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {/* Button Background Animation */}
                <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Button Content */}
                <div className="relative flex items-center gap-2">
                  <RefreshCw className="w-5 h-5" />
                  <span>Try Again</span>
                </div>
              </Link>

              <Link
                href="/"
                className="w-full px-6 py-4 rounded-xl border-2 border-base-300 bg-base-100 hover:bg-base-200 text-base-content font-semibold transition-all duration-200 flex items-center justify-center gap-2 group"
              >
                <Home className="w-5 h-5 group-hover:text-primary transition-colors" />
                <span>Go to Homepage</span>
              </Link>

              <Link
                href="/books"
                className="w-full px-6 py-4 rounded-xl bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content transition-all duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Continue Shopping</span>
              </Link>
            </div>

            {/* Support Info */}
            <p className="mt-6 text-xs text-base-content/40">
              Need help? Contact our support team
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -z-10 -bottom-4 -right-4 w-32 h-32 bg-error/10 rounded-full blur-2xl"></div>
        <div className="absolute -z-10 -top-4 -left-4 w-32 h-32 bg-warning/10 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default PaymentCancelled;