"use client";

import React from "react";
import useAuth from "@/Hooks/UseAuth";
import useAxiosSecure from "@/Hooks/UseAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaHeartBroken, FaRegHeart } from "react-icons/fa";
import { MdDeleteOutline, MdOutlineBookmarkAdded } from "react-icons/md";
import { HiOutlineShoppingBag } from "react-icons/hi";
import Image from "next/image";
import Link from "next/link";
import Swal from "sweetalert2";

const MyWishList = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const {
    data: wishList = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["wish", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/wishlist/${user.email}`);
      return res.data;
    },
  });

  // ✅ Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.delete(`/wishlist/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["wish", user?.email]);

      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Item removed from wishlist",
        timer: 1500,
        showConfirmButton: false,
        background: "var(--color-base-100)",
        color: "var(--color-base-content)",
        iconColor: "var(--color-primary)",
      });
    },
  });

  const handleDelete = (id, bookName) => {
    Swal.fire({
      title: "Remove from wishlist?",
      text: `"${bookName}" will be removed from your wishlist`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--color-error)",
      cancelButtonColor: "var(--color-info)",
      confirmButtonText: "Yes, remove it",
      background: "var(--color-base-100)",
      color: "var(--color-base-content)",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/60 animate-pulse">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8 bg-error/10 rounded-2xl">
          <div className="text-error text-6xl mb-4">⚠️</div>
          <h3 className="text-2xl font-bold text-error mb-2">Oops!</h3>
          <p className="text-base-content/70">
            Failed to load your wishlist. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-secondary px-4 py-2 rounded-full mb-4">
            <MdOutlineBookmarkAdded className="text-primary text-xl" />
            <span className="text-sm font-medium text-secondary-content">
              {wishList.length} {wishList.length === 1 ? 'Item' : 'Items'} Saved
            </span>
          </div>
          
          <h1 className="text-5xl font-bold playfair mb-4">
            <span className="text-base-content">My</span>{" "}
            <span className="text-primary">Wish</span>{" "}
            <span className="text-base-content">List</span>
          </h1>
          
          <p className="text-base-content/60 max-w-2xl mx-auto">
            Books you&apos;ve saved for later. Ready to add one to your collection?
          </p>
        </div>

        {wishList.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="bg-base-100 rounded-full p-8 mb-6 shadow-inner">
              <FaHeartBroken className="text-7xl text-base-content/20" />
            </div>
            <h3 className="text-2xl font-bold playfair text-base-content mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-base-content/60 text-center mb-8 max-w-md">
              Start adding books you love to your wishlist. They&apos;ll be waiting for you here!
            </p>
            <Link 
              href="/books" 
              className="btn btn-primary px-8 rounded-full shadow-lg shadow-primary/20 hover:shadow-xl transition-all duration-300"
            >
              Browse Books
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishList.map((item) => (
              <div
                key={item._id}
                className="group bg-base-100 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-300/50 hover:border-primary/30"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-linear-to-br from-secondary to-base-200 overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-base-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
                  
                  <div className="relative w-full h-full transform group-hover:scale-105 transition-transform duration-500">
                    <Image
                      src={item.BookImage}
                      alt={item.bookName}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-contain p-4"
                      priority={false}
                    />
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 z-20">
                    <button
                      onClick={() => handleDelete(item._id, item.bookName)}
                      className="btn btn-sm btn-circle bg-base-100 hover:bg-error hover:text-error-content border-none shadow-lg"
                      title="Remove from wishlist"
                    >
                      <MdDeleteOutline size={18} />
                    </button>
                  </div>

                  {/* Wish Date Badge */}
                  <div className="absolute bottom-3 left-3 z-20">
                    <div className="badge badge-sm bg-base-100/90 backdrop-blur-sm border-none text-base-content/70 shadow-sm">
                      {new Date(item.wishedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Book Title */}
                  <h3 className="text-lg font-semibold playfair line-clamp-2 mb-2 min-h-14 group-hover:text-primary transition-colors">
                    {item.bookName}
                  </h3>

                  {/* Author if available */}
                  {item.author && (
                    <p className="text-sm text-base-content/60 mb-3">
                      by {item.author}
                    </p>
                  )}

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-base-300/50">
                    <div className="flex flex-col">
                      <span className="text-xs text-base-content/40">Price</span>
                      <span className="text-2xl font-bold text-primary">
                        ৳ {item.price}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(item._id, item.bookName)}
                        className="btn btn-sm btn-ghost text-error hover:bg-error/10"
                        title="Remove"
                      >
                        <MdDeleteOutline size={18} />
                      </button>
                      
                      <Link
                        href={`/book-details/${item.bookId}`}
                        className="btn btn-sm btn-primary  shadow-lg shadow-primary/20 hover:shadow-primary/30"
                      >
                        <HiOutlineShoppingBag size={16} />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWishList;