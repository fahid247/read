"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import Swal from "sweetalert2";
import Image from "next/image";
import Loading from "@/app/Loading";
import Link from "next/link";
import { 
  BookOpen, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Trash2,
  Edit,
  User,
  Mail,
  Calendar,
  ChevronDown,
  ChevronUp,
  Library,
  BookMarked,
  AlertCircle
} from "lucide-react";

const ManageBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedBook, setExpandedBook] = useState(null);

  const {
    data: books = [],
    isLoading,
  } = useQuery({
    queryKey: ["all-books", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get("/books");
      return res.data;
    },
  });

  // Publish/Unpublish mutation
  const publishMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const newStatus = status === "Published" ? "unpublished" : "Published";
      return axiosSecure.patch(`/books/${id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-books"]);
      Swal.fire({
        icon: "success",
        title: "Status Updated",
        text: "Book status has been changed successfully.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return axiosSecure.delete(`/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["all-books"]);
      Swal.fire({
        icon: "success",
        title: "Book Deleted",
        text: "The book has been removed successfully.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
    },
  });

  const handlePublishToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "Published" ? "unpublished" : "Published";
    
    const result = await Swal.fire({
      title: "Change Status?",
      text: `Are you sure you want to ${newStatus === "Published" ? "publish" : "unpublish"} this book?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, proceed",
      background: "#FAFAFA",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      publishMutation.mutate({ id, status: currentStatus });
    }
  };

  const handleDelete = async (id, bookName) => {
    const result = await Swal.fire({
      title: "Delete Book?",
      text: `Are you sure you want to delete "${bookName}"? This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#4CAF50",
      confirmButtonText: "Yes, delete it",
      background: "#FAFAFA",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      deleteMutation.mutate(id);
    }
  };

  // Filter books
  const filteredBooks = books.filter(book => {
    const matchesSearch = 
      book.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.librarianEmail?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "published" && book.status === "Published") ||
      (statusFilter === "unpublished" && book.status === "unpublished");
    
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const totalBooks = books.length;
  const publishedBooks = books.filter(b => b.status === "Published").length;
  const unpublishedBooks = books.filter(b => b.status === "unpublished").length;

  const getStatusIcon = (status) => {
    return status === "Published" 
      ? <Eye className="w-4 h-4" /> 
      : <EyeOff className="w-4 h-4" />;
  };

  const getStatusBadgeClass = (status) => {
    return status === "Published"
      ? "bg-success/10 text-success border-success/20"
      : "bg-warning/10 text-warning border-warning/20";
  };

  const toggleBookExpand = (bookId) => {
    setExpandedBook(expandedBook === bookId ? null : bookId);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="relative mb-8">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-primary/30"></div>
              <Library className="w-6 h-6 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl playfair font-bold mb-3">
              <span className="text-base-content">Manage</span>{' '}
              <span className="text-primary">Books</span>
            </h2>
            
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              View and manage all books in the library collection
            </p>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Total Books</p>
                <p className="text-3xl font-bold text-primary">{totalBooks}</p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Published</p>
                <p className="text-3xl font-bold text-success">{publishedBooks}</p>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-base-100 rounded-2xl p-6 shadow-lg border border-base-300/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/60">Unpublished</p>
                <p className="text-3xl font-bold text-warning">{unpublishedBooks}</p>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center">
                <EyeOff className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-base-100 rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by book name, author, or librarian..."
                className="w-full pl-10 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
              <select
                className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Books</option>
                <option value="published">Published</option>
                <option value="unpublished">Unpublished</option>
              </select>
            </div>
          </div>
        </div>

        {/* Books List */}
        {filteredBooks.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-base-100 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Books Found</h3>
              <p className="text-base-content/60">No books match your current filters.</p>
            </div>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block bg-base-100 rounded-2xl shadow-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-base-200">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">#</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Book</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Author</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Librarian</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Status</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-base-200">
                    {filteredBooks.map((book, index) => (
                      <React.Fragment key={book._id}>
                        <tr className="hover:bg-base-200/50 transition-colors duration-200">
                          <td className="px-6 py-4 text-sm text-base-content/60">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-md shrink-0">
                                <Image
                                  src={book.image || '/placeholder-book.jpg'}
                                  alt={book.name}
                                  fill
                                  className="object-cover"
                                  onError={(e) => e.target.src = '/placeholder-book.jpg'}
                                />
                              </div>
                              <div>
                                <p className="font-semibold text-base-content">{book.name}</p>
                                <p className="text-xs text-base-content/40">ID: {book._id?.slice(-8)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-primary/60" />
                              <span>{book.author || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-primary/60" />
                              <span className="text-sm">{book.librarianEmail || 'N/A'}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(book.status)}`}>
                              {getStatusIcon(book.status)}
                              {book.status || 'N/A'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleBookExpand(book._id)}
                                className="p-2 bg-base-200 text-base-content/70 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                title="View Details"
                              >
                                {expandedBook === book._id ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </button>
                              
                              <button
                                onClick={() => handlePublishToggle(book._id, book.status)}
                                className={`p-2 rounded-lg transition-all duration-200 ${
                                  book.status === "Published"
                                    ? "bg-warning/10 text-warning hover:bg-warning hover:text-white"
                                    : "bg-success/10 text-success hover:bg-success hover:text-white"
                                }`}
                                title={book.status === "Published" ? "Unpublish" : "Publish"}
                              >
                                {book.status === "Published" ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </button>

                              <button
                                onClick={() => handleDelete(book._id, book.name)}
                                className="p-2 bg-error/10 text-error rounded-lg hover:bg-error hover:text-white transition-all duration-200"
                                title="Delete Book"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                        {/* Expanded Details Row */}
                        {expandedBook === book._id && (
                          <tr className="bg-base-200/50">
                            <td colSpan="6" className="px-6 py-4">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                    <BookMarked className="w-4 h-4 text-primary" />
                                    Book Information
                                  </h4>
                                  <p className="text-sm"><span className="font-medium">Book ID:</span> {book._id}</p>
                                  <p className="text-sm"><span className="font-medium">Name:</span> {book.name}</p>
                                  <p className="text-sm"><span className="font-medium">Author:</span> {book.author || 'N/A'}</p>
                                  <p className="text-sm"><span className="font-medium">Category:</span> {book.category || 'N/A'}</p>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                    <User className="w-4 h-4 text-primary" />
                                    Library Details
                                  </h4>
                                  <p className="text-sm"><span className="font-medium">Librarian:</span> {book.librarianEmail || 'N/A'}</p>
                                  <p className="text-sm"><span className="font-medium">Price:</span> ৳{book.price || 0}</p>
                                  <p className="text-sm"><span className="font-medium">Pages:</span> {book.pages || 'N/A'}</p>
                                  <p className="text-sm"><span className="font-medium">Language:</span> {book.language || 'N/A'}</p>
                                </div>
                                <div className="space-y-2">
                                  <h4 className="font-semibold text-sm text-base-content/60 flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-primary" />
                                    Additional Info
                                  </h4>
                                  <p className="text-sm"><span className="font-medium">Publisher:</span> {book.publisher || 'N/A'}</p>
                                  <p className="text-sm"><span className="font-medium">Rating:</span> {book.rating || 'N/A'}/5</p>
                                  {book.description && (
                                    <p className="text-sm">
                                      <span className="font-medium">Description:</span>{' '}
                                      <span className="text-base-content/70 line-clamp-2">{book.description}</span>
                                    </p>
                                  )}
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

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4">
              {filteredBooks.map((book) => (
                <div
                  key={book._id}
                  className="bg-base-100 rounded-2xl shadow-lg overflow-hidden border border-base-200"
                >
                  {/* Card Header */}
                  <div className="p-4">
                    <div className="flex gap-4">
                      <div className="relative w-20 h-24 rounded-lg overflow-hidden shadow-md shrink-0">
                        <Image
                          src={book.image || '/placeholder-book.jpg'}
                          alt={book.name}
                          fill
                          className="object-cover"
                          onError={(e) => e.target.src = '/placeholder-book.jpg'}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base-content truncate">{book.name}</h3>
                        <p className="text-sm text-base-content/60 flex items-center gap-1 mt-1">
                          <User className="w-3 h-3" />
                          {book.author || 'N/A'}
                        </p>
                        <p className="text-sm text-base-content/60 flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          <span className="truncate">{book.librarianEmail || 'N/A'}</span>
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(book.status)}`}>
                            {getStatusIcon(book.status)}
                            {book.status || 'N/A'}
                          </span>
                          <button
                            onClick={() => toggleBookExpand(book._id)}
                            className="p-1.5 bg-base-200 rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                          >
                            {expandedBook === book._id ? (
                              <ChevronUp className="w-4 h-4" />
                            ) : (
                              <ChevronDown className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {expandedBook === book._id && (
                    <div className="px-4 pb-4 pt-2 border-t border-base-200">
                      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                        <div>
                          <p className="text-base-content/60">Price</p>
                          <p className="font-semibold text-primary">৳{book.price || 0}</p>
                        </div>
                        <div>
                          <p className="text-base-content/60">Pages</p>
                          <p className="font-semibold">{book.pages || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-base-content/60">Category</p>
                          <p>{book.category || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-base-content/60">Language</p>
                          <p>{book.language || 'N/A'}</p>
                        </div>
                      </div>

                      {book.description && (
                        <p className="text-sm text-base-content/70 mb-4">
                          <span className="font-medium text-base-content">Description:</span>{' '}
                          {book.description}
                        </p>
                      )}

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePublishToggle(book._id, book.status)}
                          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                            book.status === "Published"
                              ? "bg-warning/10 text-warning hover:bg-warning hover:text-white"
                              : "bg-success/10 text-success hover:bg-success hover:text-white"
                          }`}
                        >
                          {book.status === "Published" ? (
                            <>
                              <EyeOff className="w-4 h-4" />
                              Unpublish
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4" />
                              Publish
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDelete(book._id, book.name)}
                          className="flex-1 py-2 bg-error/10 text-error rounded-xl hover:bg-error hover:text-white transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Summary Footer */}
        {filteredBooks.length > 0 && (
          <div className="mt-4 text-center text-sm text-base-content/60">
            Showing {filteredBooks.length} of {books.length} books
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooks;