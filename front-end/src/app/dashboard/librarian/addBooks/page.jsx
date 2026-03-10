"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";


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
      });

      reset();
      router.push("/dashboard/librarian/my-books"); // Next.js navigation
    } catch (error) {
      console.error(error);
      Swal.fire("Error", "Failed to add book", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 flex justify-center bg-base-200 min-h-screen inter">
      <div className="w-full max-w-5xl bg-base-100 shadow-xl rounded-2xl p-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl playfair md:text-4xl font-bold text-base-content mb-2">
            Add New Book
          </h2>
          <p className="text-gray-500 inter text-sm md:text-base">
            Fill out the details below to add a new book to the library
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(handleAddBooks)}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <label className="label font-medium">Book Name</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("name", { required: "Book name is required" })}
                disabled={loading}
              />
              {errors.name && <p className="text-error text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="label font-medium">Author</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("author", { required: "Author is required" })}
                disabled={loading}
              />
              {errors.author && <p className="text-error text-sm">{errors.author.message}</p>}
            </div>

            <div>
              <label className="label font-medium">Image URL</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("image", { required: "Image URL is required" })}
                disabled={loading}
              />
              {errors.image && <p className="text-error text-sm">{errors.image.message}</p>}
            </div>

            <div>
              <label className="label font-medium">Category</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("category", { required: "Category is required" })}
                disabled={loading}
              />
              {errors.category && <p className="text-error text-sm">{errors.category.message}</p>}
            </div>

            <div>
              <label className="label font-medium">Price ($)</label>
              <input
                type="number"
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("price", { required: "Price is required" })}
                disabled={loading}
              />
              {errors.price && <p className="text-error text-sm">{errors.price.message}</p>}
            </div>

            <div>
              <label className="label font-medium">Rating</label>
              <input
                type="number"
                step="0.1"
                max="5"
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("rating")}
                disabled={loading}
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <label className="label font-medium">Pages</label>
              <input
                type="number"
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("pages")}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label font-medium">Publisher</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("publisher")}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label font-medium">Language</label>
              <input
                className="input input-bordered w-full focus:ring focus:ring-primary"
                {...register("language")}
                disabled={loading}
              />
            </div>

            <div>
              <label className="label font-medium">Status</label>
              <select
                className="select select-bordered w-full focus:ring focus:ring-primary"
                {...register("status", { required: "Status is required" })}
                disabled={loading}
              >
                <option value="Published">Published</option>
                <option value="Unpublished">Unpublished</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label font-medium">Description</label>
              <textarea
                className="textarea textarea-bordered w-full focus:ring focus:ring-primary"
                rows="5"
                {...register("description", { required: "Description is required" })}
                disabled={loading}
              />
              {errors.description && <p className="text-error text-sm">{errors.description.message}</p>}
            </div>
          </div>

          {/* Submit Button (Full Width) */}
          <div className="md:col-span-2 pt-4">
            <button
              type="submit"
              className={`btn btn-primary w-full ${loading ? "loading" : ""}`}
              disabled={loading}
            >
              {loading ? "Adding Book..." : "Add Book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBooks;