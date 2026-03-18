"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import { 
  BookOpen, 
  User, 
  Image as ImageIcon, 
  Folder, 
  DollarSign, 
  Star, 
  FileText, 
  Building, 
  Globe, 
  CheckCircle,
  Sparkles,
  BookMarked
} from "lucide-react";

const AddBooks = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handleAddBooks = async (data) => {
    setLoading(true);
    const bookData = {
      name: data.name,
      author: data.author,
      image: data.image,
      description: data.description,
      category: data.category,
      status: data.status,
      librarianEmail: user?.email,
      price: Number(data.price),
      rating: Number(data.rating),
      pages: Number(data.pages),
      publisher: data.publisher,
      language: data.language,
      createdAt: new Date().toISOString().split("T")[0],
    };

    try {
      await axiosSecure.post("/books", bookData);

      Swal.fire({
        icon: "success",
        title: "Book Added Successfully",
        text: "Your book has been added to the library",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });

      reset();
      router.push("/dashboard/librarian/my-books");
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Failed to Add Book",
        text: "Something went wrong. Please try again.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#EF4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-7xl mx-auto">
        <div className="relative mb-8 text-center">
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-0.5 bg-primary/30"></div>
              <BookMarked className="w-6 h-6 text-primary" />
              <div className="w-12 h-0.5 bg-primary/30"></div>
            </div>
            
            <h2 className="text-4xl md:text-5xl playfair font-bold text-base-content mb-3">
              Add New <span className="text-primary">Book</span>
            </h2>
            
            <p className="text-base-content/70 text-lg max-w-2xl mx-auto">
              Expand your library collection by adding a new literary treasure
            </p>

            <div className="flex justify-center mt-6">
              <div className="w-24 h-1 bg-linear-to-r from-primary  to-primary/80 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
          <div className="relative bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary to-primary/70"></div>
            
            <div className="p-8 md:p-10">
              <form
                onSubmit={handleSubmit(handleAddBooks)}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-base-300">
                      <BookOpen className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-base-content">Basic Information</h3>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Book Name
                      </label>
                      <div className="relative group">
                        <input
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                          placeholder="Enter book title"
                          {...register("name", { required: "Book name is required" })}
                          disabled={loading}
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-error flex items-center gap-1">
                            <span className="w-1 h-1 bg-error rounded-full"></span>
                            {errors.name.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <User className="w-4 h-4 text-primary" />
                        Author
                      </label>
                      <div className="relative group">
                        <input
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                          placeholder="Enter author name"
                          {...register("author", { required: "Author is required" })}
                          disabled={loading}
                        />
                        {errors.author && (
                          <p className="mt-2 text-sm text-error flex items-center gap-1">
                            <span className="w-1 h-1 bg-error rounded-full"></span>
                            {errors.author.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Image URL
                      </label>
                      <div className="relative group">
                        <input
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                          placeholder="https://example.com/book-cover.jpg"
                          {...register("image", { required: "Image URL is required" })}
                          disabled={loading}
                        />
                        {errors.image && (
                          <p className="mt-2 text-sm text-error flex items-center gap-1">
                            <span className="w-1 h-1 bg-error rounded-full"></span>
                            {errors.image.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Folder className="w-4 h-4 text-primary" />
                        Category
                      </label>
                      <div className="relative group">
                        <input
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                          placeholder="e.g., Fiction, Science, History"
                          {...register("category", { required: "Category is required" })}
                          disabled={loading}
                        />
                        {errors.category && (
                          <p className="mt-2 text-sm text-error flex items-center gap-1">
                            <span className="w-1 h-1 bg-error rounded-full"></span>
                            {errors.category.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                          <DollarSign className="w-4 h-4 text-primary" />
                          Price ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content"
                          placeholder="0.00"
                          {...register("price", { required: "Price is required" })}
                          disabled={loading}
                        />
                        {errors.price && (
                          <p className="mt-2 text-sm text-error">{errors.price.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                          <Star className="w-4 h-4 text-primary" />
                          Rating
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          max="5"
                          className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content"
                          placeholder="0.0 - 5.0"
                          {...register("rating")}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-base-300">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <h3 className="text-lg font-semibold text-base-content">Additional Details</h3>
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <FileText className="w-4 h-4 text-primary" />
                        Pages
                      </label>
                      <input
                        type="number"
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content"
                        placeholder="Number of pages"
                        {...register("pages")}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Building className="w-4 h-4 text-primary" />
                        Publisher
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content"
                        placeholder="Publisher name"
                        {...register("publisher")}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Globe className="w-4 h-4 text-primary" />
                        Language
                      </label>
                      <input
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content"
                        placeholder="e.g., English, Spanish"
                        {...register("language")}
                        disabled={loading}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Status
                      </label>
                      <select
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content cursor-pointer"
                        {...register("status", { required: "Status is required" })}
                        disabled={loading}
                      >
                        <option value="Published" className="bg-base-100">Published</option>
                        <option value="Unpublished" className="bg-base-100">Unpublished</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                    <FileText className="w-4 h-4 text-primary" />
                    Description
                  </label>
                  <textarea
                    rows="5"
                    className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40 resize-none"
                    placeholder="Write a compelling description of the book..."
                    {...register("description", { required: "Description is required" })}
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="mt-2 text-sm text-error flex items-center gap-1">
                      <span className="w-1 h-1 bg-error rounded-full"></span>
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-content font-semibold py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >

                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    

                    <div className="relative flex items-center justify-center gap-3">
                      {loading ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          <span>Adding Book...</span>
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-5 h-5" />
                          <span>Add Book to Library</span>
                        </>
                      )}
                    </div>
                  </button>
                </div>

                <p className="text-center text-sm text-base-content/60 mt-4">
                  * All fields marked as required must be filled
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBooks;