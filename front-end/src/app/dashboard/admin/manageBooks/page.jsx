"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import Image from "next/image";

import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Loading from "@/app/Loading";

const ManageBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user, loading: authLoading } = useAuth(); // include loading from auth

  // Wait for user to load
  if (authLoading) return <Loading />;
  if (!user) return <p className="text-center mt-8">You must be logged in to see your books.</p>;

  // React Query to fetch books
  const {
    data: books = [],
    isLoading,
    isError,
    refetch,
  // eslint-disable-next-line react-hooks/rules-of-hooks
  } = useQuery({
    queryKey: ["all-books", user.email],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/books?librarianEmail=${user.email}`);
        return res.data;
      } catch (err) {
        console.error("Failed to fetch books:", err);
        return [];
      }
    },
  });

  // Loading state
  if (isLoading) return <Loading />;
  if (isError) return <p className="text-center mt-8 text-red-500">Failed to load books.</p>;

  // Publish / Unpublish
  const handlePublishToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "unpublished" : "Published";
    try {
      await axiosSecure.patch(`/books/${id}`, { status: newStatus });
      refetch();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update book status", "error");
    }
  };

  // Delete book
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the book and all related orders!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });

    if (result.isConfirmed) {
      try {
        await axiosSecure.delete(`/books/${id}`);
        refetch();
        Swal.fire("Deleted!", "Book and orders removed.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to delete book", "error");
      }
    }
  };

  return (
    <div className="p-4 md:p-6 inter">
      <h2 className="text-4xl playfair text-primary my-8 underline font-bold text-center">
        <span className="text-base-content">Manage</span>{" "}
        <span className="text-base-content">Books</span>
      </h2>

      <h2 className="text-xl font-medium mb-6">
        Total Books ({books.length})
      </h2>

      {books.length === 0 && (
        <p className="text-center mt-4 text-gray-500">No books found.</p>
      )}

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>#</th>
              <th>Book</th>
              <th>Author</th>
              <th>Librarian Email</th>
              <th>Status</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {books.map((book, index) => (
              <tr key={book._id}>
                <td>{index + 1}</td>
                <td className="flex items-center gap-3">
                  <Image
                    src={book.image || "/placeholder.png"}
                    alt={book.name || "Book Image"}
                    width={50}
                    height={70}
                    className="rounded object-cover"
                  />
                  <span className="font-medium">{book.name || "Untitled"}</span>
                </td>
                <td>{book.author || "Unknown"}</td>
                <td>{book.librarianEmail}</td>
                <td>
                  <span
                    className={`badge mt-4 text-[12px] ${
                      book.status === "Published"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {book.status || "unpublished"}
                  </span>
                </td>
                <td className="flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      handlePublishToggle(book._id, book.status)
                    }
                    className="btn btn-xs btn-info"
                  >
                    {book.status === "Published" ? "Unpublish" : "Publish"}
                  </button>

                  <button
                    onClick={() => handleDelete(book._id)}
                    className="btn btn-xs btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="grid gap-4 md:hidden">
        {books.map((book) => (
          <div key={book._id} className="card bg-base-100 shadow">
            <div className="card-body p-4">
              <div className="flex gap-4">
                <Image
                  src={book.image || "/placeholder.png"}
                  alt={book.name || "Book Image"}
                  width={80}
                  height={110}
                  className="rounded object-cover"
                />

                <div>
                  <h3 className="font-bold">{book.name || "Untitled"}</h3>
                  <p className="text-sm">Author: {book.author || "Unknown"}</p>
                  <p className="text-sm">
                    Librarian: {book.librarianEmail}
                  </p>

                  <span
                    className={`badge mt-2 ${
                      book.status === "Published"
                        ? "badge-success"
                        : "badge-warning"
                    }`}
                  >
                    {book.status || "unpublished"}
                  </span>
                </div>
              </div>

              <div className="card-actions justify-end mt-4">
                <button
                  onClick={() =>
                    handlePublishToggle(book._id, book.status)
                  }
                  className="btn btn-sm btn-info"
                >
                  {book.status === "Published" ? "Unpublish" : "Publish"}
                </button>

                <button
                  onClick={() => handleDelete(book._id)}
                  className="btn btn-sm btn-error"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageBooks;