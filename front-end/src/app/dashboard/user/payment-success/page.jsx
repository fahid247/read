"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  HiOutlineCheckCircle, 
  HiOutlineShoppingBag, 
  HiOutlineHome,
  HiOutlineReceiptRefund,
  HiOutlineMail,
  HiOutlineArrowLeft
} from "react-icons/hi";
import useAxiosSecure from "@/Hooks/UseAxiosSecure";

const PaymentSuccess = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const axiosSecure = useAxiosSecure();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (sessionId) {
      axiosSecure
        .patch(`/payments/payment-success?session_id=${sessionId}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => console.log(err));
    }
  }, [sessionId, axiosSecure]);


  return (
    <div className="min-h-screen bg-base-100">

      {/* Main content */}
      <div className="flex items-center justify-center px-4 py-12">
        <div className="relative w-full max-w-2xl">
          {/* Success badge */}
          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-primary rounded-full p-4 shadow-lg animate-bounce">
              <HiOutlineCheckCircle className="w-12 h-12 text-primary-content" />
            </div>
          </div>

          {/* Card */}
          <div className="bg-base-100 rounded-3xl shadow-2xl overflow-hidden border border-base-300">
            {/* Header with gradient */}
            <div className="bg-linear-to-r from-primary to-green-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-primary-content text-center playfair">
                Payment Successful!
              </h1>
              <p className="text-primary-content/80 text-center mt-2 text-lg inter">
                Your transaction has been completed
              </p>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Success animation */}
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20"></div>
                  <div className="relative bg-linear-to-r from-primary to-green-600 rounded-full p-4">
                    <HiOutlineCheckCircle className="w-16 h-16 text-primary-content" />
                  </div>
                </div>
              </div>

              {/* Thank you message */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-base-content mb-3 playfair">
                  Thank You for Your Purchase!
                </h2>
                <p className="text-base-content/70 text-lg inter">
                  Your order has been placed successfully and is being processed.
                </p>
              </div>

              {/* Order details card */}
              <div className="bg-base-200 rounded-2xl p-6 mb-8 border border-base-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-secondary rounded-lg p-2">
                      <HiOutlineReceiptRefund className="w-5 h-5 text-secondary-content" />
                    </div>
                    <span className="font-semibold text-base-content inter">Order Summary</span>
                  </div>
                  <span className="badge badge-primary badge-outline">Confirmed</span>
                </div>
                
                <div className="space-y-3 inter">
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">Transaction ID:</span>
                    <span className="font-mono font-medium text-base-content">{sessionId?.slice(0, 20)}...</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/60">Date:</span>
                    <span className="font-medium text-base-content">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                <Link 
                  href="/dashboard/user/my-orders" 
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-content font-semibold rounded-xl hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inter"
                >
                  <HiOutlineShoppingBag className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  View My Orders
                  <span className="ml-2 text-xs bg-primary-content/20 px-2 py-1 rounded-full">
                    {countdown}s
                  </span>
                </Link>

                <Link 
                  href="/" 
                  className="group relative inline-flex items-center justify-center px-6 py-3 bg-base-100 text-base-content font-semibold rounded-xl border-2 border-base-300 hover:bg-base-200 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl inter"
                >
                  <HiOutlineHome className="w-5 h-5 mr-2 group-hover:-translate-y-1 transition-transform" />
                  Return to Home
                </Link>
              </div>

              {/* Additional info */}
              <div className="text-center">
                <p className="text-sm text-base-content/60 flex items-center justify-center gap-2 inter">
                  <HiOutlineMail className="w-4 h-4" />
                  A confirmation email has been sent to your inbox
                </p>
              </div>
            </div>
          </div>

          {/* Help link */}
          <div className="text-center mt-6">
            <Link 
              href="/support" 
              className="text-sm text-base-content/60 hover:text-primary underline decoration-base-300 hover:decoration-primary transition-colors inter"
            >
              Need help with your order?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;