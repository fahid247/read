"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Loading from "@/app/Loading";


const LibrarianOrders = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth();

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
      Swal.fire("Cancelled!", "Order has been cancelled.", "success");
      queryClient.invalidateQueries(["librarian-orders"]);
    },
  });

  // Update status
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) =>
      axiosSecure.patch(`/orders/${id}`, { orderStatus: status }),
    onSuccess: () => {
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

  if (isLoading) return <Loading />;

  return (
    <section className="p-4 md:p-6 inter">
      <h2 className="text-4xl text-primary my-8 underline font-bold text-center playfair">
        <span className="text-base-content">Librarian</span>{" "}
        <span className="text-base-content">Orders</span>
      </h2>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order, index) => (
              <tr key={order._id}>
                <th>{index + 1}</th>
                <td>{order.bookName}</td>
                <td>{order.email}</td>
                <td>৳{order.price}</td>

                <td>
                  <span
                    className={`badge ${
                      order.paymentStatus === "paid"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </td>

                <td>
                  <span
                    className={`badge ${
                      order.orderStatus === "pending"
                        ? "badge-warning"
                        : order.orderStatus === "shipped"
                        ? "badge-info"
                        : order.orderStatus === "delivered"
                        ? "badge-success"
                        : "badge-error"
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </td>

                <td>
                  <div className="flex gap-2">
                    {order.paymentStatus !== "paid" &&
                      order.orderStatus === "shipped" && (
                        <button
                          className="btn btn-xs btn-outline"
                          onClick={() => handlePrev(order)}
                        >
                          Prev
                        </button>
                      )}

                    {order.paymentStatus === "paid" &&
                      (order.orderStatus === "pending" ||
                        order.orderStatus === "shipped") && (
                        <button
                          className="btn btn-primary btn-xs"
                          onClick={() => handleNext(order)}
                        >
                          Next
                        </button>
                      )}

                    {order.orderStatus !== "cancelled" &&
                      order.orderStatus !== "delivered" &&
                      order.paymentStatus !== "paid" && (
                        <button
                          className="btn btn-xs btn-error"
                          onClick={() => cancelMutation.mutate(order._id)}
                        >
                          Cancel
                        </button>
                      )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="block md:hidden space-y-4">
        {orders.map((order, index) => (
          <div key={order._id} className="card bg-base-100 shadow border">
            <div className="card-body p-4 space-y-2">
              <div className="flex justify-between">
                <h3 className="font-semibold">{order.bookName}</h3>
                <span className="text-sm text-gray-500">#{index + 1}</span>
              </div>

              <p className="text-sm">
                <span className="font-medium">Customer:</span> {order.email}
              </p>

              <p className="text-sm">
                <span className="font-medium">Price:</span> ৳{order.price}
              </p>

              <div className="flex gap-2 flex-wrap">
                <span
                  className={`badge ${
                    order.paymentStatus === "paid"
                      ? "badge-success"
                      : "badge-warning"
                  }`}
                >
                  {order.paymentStatus}
                </span>

                <span
                  className={`badge ${
                    order.orderStatus === "pending"
                      ? "badge-warning"
                      : order.orderStatus === "shipped"
                      ? "badge-info"
                      : order.orderStatus === "delivered"
                      ? "badge-success"
                      : "badge-error"
                  }`}
                >
                  {order.orderStatus}
                </span>
              </div>

              <div className="flex gap-2 pt-2">
                {order.paymentStatus !== "paid" &&
                  order.orderStatus === "shipped" && (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handlePrev(order)}
                    >
                      Prev
                    </button>
                  )}

                {order.paymentStatus === "paid" &&
                  (order.orderStatus === "pending" ||
                    order.orderStatus === "shipped") && (
                    <button
                      className="btn btn-xs btn-outline"
                      onClick={() => handleNext(order)}
                    >
                      Next
                    </button>
                  )}

                {order.orderStatus !== "cancelled" &&
                  order.orderStatus !== "delivered" &&
                  order.paymentStatus !== "paid" && (
                    <button
                      className="btn btn-xs btn-error"
                      onClick={() => cancelMutation.mutate(order._id)}
                    >
                      Cancel
                    </button>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LibrarianOrders;