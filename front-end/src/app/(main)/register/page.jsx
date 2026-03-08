"use client";

import React from "react";
import Image from "next/image";
import registerImg from "../../../public/ChatGPT Image Mar 8, 2026, 02_12_44 PM.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import axios from "axios";
import { Mail, Lock, ArrowRight, User, Chrome, Image as ImageIcon } from "lucide-react";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import useAuth from "@/hooks/UseAuth";
import ReadMartLogo from "@/components/Logo/ReadMartLogo";

const Register = () => {
  const { registerUser, updateUserProfile, signInGoogle } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInGoogle()
      .then((result) => {
        console.log(result.user.photoURL);

        // create user in the database
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).then((res) => {
          console.log("user data has been stored", res.data);
        });

        const userProfile = {
          photoURL: result.user.photoURL,
        };

        updateUserProfile(userProfile)
          .then(() => {
            router.push("/");
          })
          .catch((error) => console.log(error));
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false));
  };

  const handleRegistration = (data) => {
    setLoading(true);
    const profileImg = data.photo[0];

    registerUser(data.email, data.password)
      .then(() => {
        // 1. store the image in form data
        const formData = new FormData();
        formData.append("image", profileImg);

        // 2. send the photo to store and get the ul
        const image_API_URL = `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGE_HOST_KEY}`;

        axios
          .post(image_API_URL, formData)
          .then((res) => {
            const photoURL = res.data.data.url;

            // create user in the database
            const userInfo = {
              email: data.email,
              displayName: data.name,
              photoURL: photoURL,
            };
            axiosSecure.post("/users", userInfo).then((res) => {
              if (res.data.insertedId) {
                console.log("user created in the database");
              }
            });

            // update user profile to firebase
            const userProfile = {
              displayName: data.name,
              photoURL: photoURL,
            };

            updateUserProfile(userProfile)
              .then(() => {
                router.push("/");
              })
              .catch((error) => console.log(error))
              .finally(() => setLoading(false));
          })
          .catch((error) => {
            console.log(error);
            setLoading(false);
          });
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  return (
    <div className="flex min-h-screen bg-[#0A0F1E]">
      {/* Left Form Section */}
      <div className="flex-1 flex items-center justify-center px-4 lg:px-8 py-12">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="mb-8">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
              <span className="text-[#0A0F1E] font-bold text-xl"><ReadMartLogo></ReadMartLogo></span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400 text-sm">
              Join us today and start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(handleRegistration)} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="w-full pl-10 pr-4 py-3 bg-[#1E2538] border border-[#2A3147] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("name", { required: "Name is required" })}
                  disabled={loading}
                />
              </div>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Photo Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Profile Photo</label>
              <div className="relative">
                <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 z-10" size={18} />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full pl-10 pr-4 py-3 bg-[#1E2538] border border-[#2A3147] rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-[#0A0F1E] hover:file:bg-primary/90 file:cursor-pointer file:transition-all"
                  {...register("photo", { required: "Profile photo is required" })}
                  disabled={loading}
                />
              </div>
              {errors.photo && (
                <p className="text-red-400 text-xs mt-1">{errors.photo.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 bg-[#1E2538] border border-[#2A3147] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("email", { required: "Email is required" })}
                  disabled={loading}
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  placeholder="Create a password"
                  className="w-full pl-10 pr-4 py-3 bg-[#1E2538] border border-[#2A3147] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("password", { 
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters"
                    }
                  })}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              className="w-full py-3 bg-primary hover:bg-primary/90 text-[#0A0F1E] font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2 mt-6"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-[#0A0F1E] border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign Up
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2A3147]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-[#0A0F1E] text-gray-500">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 bg-[#1E2538] hover:bg-[#2A3147] text-white border border-[#2A3147] rounded-xl transition-all flex items-center justify-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <Chrome size={18} className="text-primary" />
                Google
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-sm text-center mt-8 text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          {/* Decorative Elements */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/5 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>

          {/* Image Container */}
          <div className="relative z-10 bg-[#1E2538]/50 backdrop-blur-lg rounded-3xl p-4 border border-[#2A3147] shadow-2xl">
            <Image
              src={registerImg}
              alt="Register"
              className="rounded-2xl w-full h-auto object-cover"
              priority
            />
          </div>

          {/* Stats Card */}
          <div className="absolute bottom-0 left-0 right-0 mx-auto w-64 transform translate-y-1/2 z-20">
            <div className="bg-[#1E2538]/90 backdrop-blur-lg rounded-xl p-4 border border-[#2A3147] shadow-xl">
              <p className="text-white text-sm font-medium">Join 10,000+ readers</p>
              <p className="text-gray-500 text-xs mt-1">Start your reading journey</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default Register;