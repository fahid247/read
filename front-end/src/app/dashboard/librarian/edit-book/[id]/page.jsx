"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Loading from "@/app/Loading";
import Link from "next/link";
import { 
  BookOpen, 
  User, 
  Image as ImageIcon, 
  FileText, 
  Folder, 
  DollarSign, 
  FileDigit, 
  Building, 
  Globe,
  ArrowLeft,
  Save,
  XCircle
} from "lucide-react";
import Image from "next/image";

const EditBook = () => {
  const { id } = useParams();
  const router = useRouter();
  const axiosSecure = useAxiosSecure();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

 
  const { data: book, isLoading } = useQuery({
    queryKey: ["book", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/books/${id}`);
      return res.data;
    },
  });


  useEffect(() => {
    if (book) {
      reset({
        name: book.name,
        author: book.author,
        image: book.image,
        description: book.description,
        category: book.category,
        price: book.price,
        pages: book.pages,
        publisher: book.publisher,
        language: book.language,
      });
    }
  }, [book, reset]);


  const updateMutation = useMutation({
    mutationFn: async (updatedBook) => {
      return axiosSecure.patch(`/AllBooks/${id}`, updatedBook);
    },
    onSuccess: () => {
      Swal.fire({
        icon: "success",
        title: "Book Updated Successfully",
        text: "Your book has been updated in the library",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#4CAF50",
        timer: 2000,
        timerProgressBar: true,
      });
      router.push("/dashboard/librarian/my-books");
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong. Please try again.",
        background: "#FAFAFA",
        confirmButtonColor: "#4CAF50",
        iconColor: "#EF4444",
      });
    },
  });

  const onSubmit = (data) => {
    updateMutation.mutate({
      name: data.name,
      author: data.author,
      image: data.image,
      description: data.description,
      category: data.category,
      price: Number(data.price),
      pages: Number(data.pages),
      publisher: data.publisher,
      language: data.language,
    });
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4 sm:px-6 lg:px-8 inter">
      <div className="max-w-4xl mx-auto">

        <div className="mb-6">
          <Link
            href="/dashboard/librarian/my-books"
            className="inline-flex items-center gap-2 text-base-content/60 hover:text-primary transition-colors duration-200 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>Back to My Books</span>
          </Link>
        </div>

        <div className="relative">
          <div className="absolute -top-4 -right-4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/5 rounded-full blur-3xl"></div>

          <div className="relative bg-base-100 rounded-3xl shadow-2xl overflow-hidden">
            <div className="h-2 bg-linear-to-r from-primary  to-primary/80"></div>
            
            <div className="p-8 md:p-10">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center gap-2 mb-4">
                  <div className="w-12 h-0.5 bg-primary/30"></div>
                  <BookOpen className="w-6 h-6 text-primary" />
                  <div className="w-12 h-0.5 bg-primary/30"></div>
                </div>
                
                <h2 className="text-3xl md:text-4xl playfair font-bold text-base-content mb-3">
                  Edit <span className="text-primary">Book</span>
                </h2>
                
                <p className="text-base-content/70">
                  Updating: <span className="font-semibold text-primary">{book?.name}</span>
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <BookOpen className="w-4 h-4 text-primary" />
                        Book Name
                      </label>
                      <input
                        {...register("name", { required: "Book name is required" })}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="Enter book title"
                      />
                      {errors.name && (
                        <p className="text-sm text-error mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <User className="w-4 h-4 text-primary" />
                        Author
                      </label>
                      <input
                        {...register("author", { required: "Author is required" })}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="Enter author name"
                      />
                      {errors.author && (
                        <p className="text-sm text-error mt-1">{errors.author.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <ImageIcon className="w-4 h-4 text-primary" />
                        Image URL
                      </label>
                      <input
                        {...register("image", { required: "Image URL is required" })}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="https://example.com/book-cover.jpg"
                      />
                      {errors.image && (
                        <p className="text-sm text-error mt-1">{errors.image.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Folder className="w-4 h-4 text-primary" />
                        Category
                      </label>
                      <input
                        {...register("category", { required: "Category is required" })}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="e.g., Fiction, Science, History"
                      />
                      {errors.category && (
                        <p className="text-sm text-error mt-1">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <DollarSign className="w-4 h-4 text-primary" />
                        Price ($)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        {...register("price", { required: "Price is required" })}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="0.00"
                      />
                      {errors.price && (
                        <p className="text-sm text-error mt-1">{errors.price.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <FileDigit className="w-4 h-4 text-primary" />
                        Pages
                      </label>
                      <input
                        type="number"
                        {...register("pages")}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="Number of pages"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Building className="w-4 h-4 text-primary" />
                        Publisher
                      </label>
                      <input
                        {...register("publisher")}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="Publisher name"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                        <Globe className="w-4 h-4 text-primary" />
                        Language
                      </label>
                      <input
                        {...register("language")}
                        className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40"
                        placeholder="e.g., English, Spanish"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-base-content/80">
                    <FileText className="w-4 h-4 text-primary" />
                    Description
                  </label>
                  <textarea
                    rows="5"
                    {...register("description", { required: "Description is required" })}
                    className="w-full px-4 py-3 bg-base-200 border border-base-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 text-base-content placeholder-base-content/40 resize-none"
                    placeholder="Write a compelling description of the book..."
                  />
                  {errors.description && (
                    <p className="text-sm text-error mt-1">{errors.description.message}</p>
                  )}
                </div>

                {book?.image && (
                  <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden shadow-md">
                      <Image 
                      width={300}
                      height={300}
                        src={book.image} 
                        alt={book.name}
                        className="object-cover"
                        onError={(e) => e.target.src = '/placeholder-book.jpg'}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-base-content">Current Cover</p>
                      <p className="text-xs text-base-content/60">Update the URL above to change the cover image</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 group relative overflow-hidden rounded-xl bg-primary hover:bg-primary/90 text-primary-content font-semibold py-4 px-6 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    
                    <div className="relative flex items-center justify-center gap-3">
                      {updateMutation.isPending ? (
                        <>
                          <span className="loading loading-spinner loading-sm"></span>
                          <span>Updating Book...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          <span>Update Book</span>
                        </>
                      )}
                    </div>
                  </button>

                  <Link
                    href="/dashboard/librarian/my-books"
                    className="px-6 py-4 rounded-xl border-2 border-base-300 bg-base-100 hover:bg-base-200 text-base-content font-semibold transition-all duration-200 text-center flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-5 h-5" />
                    <span>Cancel</span>
                  </Link>
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

export default EditBook;