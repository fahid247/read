"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Loading from "@/app/Loading";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import { 
  BookOpen, 
  Edit, 
  Eye, 
  EyeOff, 
  ChevronLeft, 
  ChevronRight,
  Search,
  Filter,
  Grid3x3,
  Table as TableIcon,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";

const MyBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState("table"); // "table" or "grid"
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const { data: books = [], isLoading } = useQuery({
    queryKey: ["my-books", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/books?librarianEmail=${user.email}`);
      return res.data;
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async ({ id, newStatus }) => {
      return axiosSecure.patch(`/books/${id}`, { status: newStatus });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["my-books"]);
    },
  });

 
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.author?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || book.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusIcon = (status) => {
    switch(status) {
      case "Published":
        return <CheckCircle className="w-4 h-4" />;
      case "Unpublished":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status) {
      case "Published":
        return "bg-success/10 text-success border-success/20";
      case "Unpublished":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-base-300/10 text-base-content/60 border-base-300/20";
    }
  };

  if (isLoading) {
    return <Loading />;
  }

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
              <BookOpen className="w-6 h-6 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl playfair font-bold mb-3">
              <span className="text-base-content">My</span>{" "}
              <span className="text-primary">Book</span>{" "}
              <span className="text-base-content">Collection</span>
            </h2>
            
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              Manage and monitor all the books you&apos;ve added to the library
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Total Books</p>
                <p className="text-3xl font-bold text-primary">{books.length}</p>
              </div>
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Published</p>
                <p className="text-3xl font-bold text-success">
                  {books.filter(b => b.status === "Published").length}
                </p>
              </div>
              <div className="bg-base-100 rounded-2xl px-6 py-4 shadow-lg border border-base-300/50">
                <p className="text-sm text-base-content/60">Unpublished</p>
                <p className="text-3xl font-bold text-warning">
                  {books.filter(b => b.status === "Unpublished").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {books.length === 0 ? (
          <div className="text-center py-20">
            <div className="bg-base-100 rounded-3xl p-12 shadow-xl max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-primary/30 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-base-content mb-2">No Books Yet</h3>
              <p className="text-base-content/60 mb-6">You haven&apos;t added any books to your collection.</p>
              <Link 
                href="/dashboard/librarian/add-books" 
                className="btn btn-primary px-8 rounded-full"
              >
                Add Your First Book
              </Link>
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
                    placeholder="Search by book name or author..."
                    className="w-full pl-10 pr-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>


                <div className="flex gap-2">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/40 w-4 h-4" />
                    <select
                      className="pl-10 pr-8 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="all">All Status</option>
                      <option value="Published">Published</option>
                      <option value="Unpublished">Unpublished</option>
                    </select>
                  </div>


                  <div className="flex bg-base-200 rounded-xl p-1">
                    <button
                      onClick={() => setViewMode("table")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "table" 
                          ? "bg-primary text-white" 
                          : "text-base-content/60 hover:text-primary"
                      }`}
                    >
                      <TableIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        viewMode === "grid" 
                          ? "bg-primary text-white" 
                          : "text-base-content/60 hover:text-primary"
                      }`}
                    >
                      <Grid3x3 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>


            {viewMode === "table" && (
              <div className="bg-base-100 rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-base-200">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">#</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Book Cover</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Book Details</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Status</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-base-content/80">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-base-200">
                      {paginatedBooks.map((book, index) => (
                        <tr key={book._id} className="hover:bg-base-200/50 transition-colors duration-200">
                          <td className="px-6 py-4 text-sm text-base-content/60">
                            {(currentPage - 1) * itemsPerPage + index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden shadow-md">
                              <Image
                                src={book.image}
                                alt={book.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-semibold text-base-content">{book.name}</p>
                              <p className="text-sm text-base-content/60">by {book.author || "Unknown"}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusBadgeClass(book.status)}`}>
                              {getStatusIcon(book.status)}
                              {book.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <Link
                                href={`/dashboard/librarian/edit-book/${book._id}`}
                                className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200"
                                title="Edit Book"
                              >
                                <Edit className="w-4 h-4" />
                              </Link>
                              <button
                                onClick={() =>
                                  toggleStatusMutation.mutate({
                                    id: book._id,
                                    newStatus:
                                      book.status === "Published" ? "Unpublished" : "Published",
                                  })
                                }
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
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}


            {viewMode === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedBooks.map((book) => (
                  <div
                    key={book._id}
                    className="group bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-base-200 hover:border-primary/30"
                  >

                    <div className="relative h-48 bg-linear-to-br from-primary/5 to-secondary/5">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-24 h-32 rounded-lg overflow-hidden shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                          <Image
                            src={book.image}
                            alt={book.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                      
 
                      <div className="absolute top-3 right-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClass(book.status)}`}>
                          {getStatusIcon(book.status)}
                          {book.status}
                        </span>
                      </div>
                    </div>


                    <div className="p-5">
                      <h3 className="font-semibold text-base-content mb-1 line-clamp-1">
                        {book.name}
                      </h3>
                      <p className="text-sm text-base-content/60 mb-4">
                        by {book.author || "Unknown"}
                      </p>


                      <div className="flex items-center justify-between pt-3 border-t border-base-200">
                        <Link
                          href={`/dashboard/librarian/edit-book/${book._id}`}
                          className="flex-1 mr-2 px-3 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 text-sm font-medium text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() =>
                            toggleStatusMutation.mutate({
                              id: book._id,
                              newStatus:
                                book.status === "Published" ? "Unpublished" : "Published",
                            })
                          }
                          className={`flex-1 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                            book.status === "Published"
                              ? "bg-warning/10 text-warning hover:bg-warning hover:text-white"
                              : "bg-success/10 text-success hover:bg-success hover:text-white"
                          }`}
                        >
                          {book.status === "Published" ? "Unpublish" : "Publish"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}


            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-base-100 border border-base-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg transition-all duration-200 ${
                      currentPage === i + 1
                        ? "bg-primary text-white"
                        : "bg-base-100 border border-base-300 hover:border-primary text-base-content"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-base-100 border border-base-300 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBooks;