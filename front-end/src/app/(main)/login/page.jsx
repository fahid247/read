"use client";

import { useState } from "react";
import Image from "next/image";
import loginImg from "../../../../public/ChatGPT Image Mar 8, 2026, 02_12_44 PM.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import useAuth from "@/hooks/UseAuth";
import useAxiosSecure from "@/hooks/UseAxiosSecure";
import Swal from "sweetalert2";
import { Mail, Lock, ArrowRight, Github, Chrome } from "lucide-react";
import ReadMartLogo from "@/components/Logo/ReadMartLogo";

const Login = () => {
  const { signInGoogle, updateUserProfile, signInUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    { label: "Demo User", email: "user@gmail.com", password: "123456" },
    { label: "Librarian", email: "librarian@gmail.com", password: "123456" },
    { label: "Admin", email: "admin@gmail.com", password: "123456" },
  ];

  const handleGoogleSignIn = () => {
    setLoading(true);
    signInGoogle()
      .then((result) => {
        const userInfo = {
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        };

        axiosSecure.post("/users", userInfo).then(() => {
          const userProfile = { photoURL: result.user.photoURL };
          updateUserProfile(userProfile)
            .then(() => {
              Swal.fire({
                icon: "success",
                title: "Logged in successfully!",
                text: `Welcome back, ${result.user.displayName}`,
                timer: 2000,
                showConfirmButton: false,
                background: "#1a1a1a",
                color: "#fff",
              });
              router.push("/");
            })
            .catch((error) => console.log(error));
        });
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
          background: "#1a1a1a",
          color: "#fff",
        });
      })
      .finally(() => setLoading(false));
  };

  const handleDemoLogin = (email, password) => {
    setLoading(true);
    signInUser(email, password)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Logged in successfully!",
          text: `Welcome back, ${result.user.displayName || email}`,
          timer: 2000,
          showConfirmButton: false,
          background: "#1a1a1a",
          color: "#fff",
        });
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
          background: "#1a1a1a",
          color: "#fff",
        });
      })
      .finally(() => setLoading(false));
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    setLoading(true);
    signInUser(data.email, data.password)
      .then((result) => {
        Swal.fire({
          icon: "success",
          title: "Logged in successfully!",
          text: `Welcome back, ${result.user.displayName || data.email}`,
          timer: 2000,
          showConfirmButton: false,
          background: "#1a1a1a",
          color: "#fff",
        });
        router.push("/");
      })
      .catch((error) => {
        console.log(error);
        Swal.fire({
          icon: "error",
          title: "Login failed",
          text: error.message,
          background: "#1a1a1a",
          color: "#fff",
        });
      })
      .finally(() => setLoading(false));
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
            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
            <p className="text-gray-400 text-sm">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Demo Accounts Quick Access */}
          <div className="mb-6 flex flex-wrap gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                onClick={() => handleDemoLogin(acc.email, acc.password)}
                className="px-3 py-1.5 bg-[#1E2538] hover:bg-primary/20 text-gray-300 hover:text-primary text-sm rounded-full transition-all border border-[#2A3147] hover:border-primary/50"
                disabled={loading}
              >
                {acc.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-400 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-4 py-3 bg-[#1E2538] border border-[#2A3147] rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  {...register("password", { required: "Password is required" })}
                  disabled={loading}
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400">
                <input type="checkbox" className="rounded border-[#2A3147] bg-[#1E2538] text-primary focus:ring-primary" />
                <span>Remember me</span>
              </label>
              <a className="text-primary hover:text-primary/80 font-medium transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              className="w-full py-3 bg-primary hover:bg-primary/90 text-[#0A0F1E] font-semibold rounded-xl transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <span className="loading loading-spinner text-accent loading-xl"></span>
              ) : (
                <>
                  Sign In
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
             <span className="loading loading-spinner text-accent loading-xl"></span>
            ) : (
              <>
                <Chrome size={18} className="text-primary" />
                Google
              </>
            )}
          </button>

          {/* Sign Up Link */}
          <p className="text-sm text-center mt-8 text-gray-500">
            Don&apos;t have an account?{" "}
            <Link 
              href="/register" 
              className="text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Image Section */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center p-8">
        <div className="relative w-full h-full max-w-2xl">
          {/* Decorative Elements - Updated to match theme */}
          <div className="absolute -top-4 -left-4 w-72 h-72 bg-primary/10 rounded-full filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-primary/5 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          
          {/* Image Container */}
          <div className="relative mx-auto z-10 w-[80%] bg-[#1E2538]/50 backdrop-blur-lg rounded-3xl p-4 border border-[#2A3147] shadow-2xl">
            <Image
              src={loginImg}
              alt="Login"
              className="rounded-2xl w-full h-auto object-cover"
              priority
            />
          </div>
          
          {/* Stats Card */}
          <div className="absolute bottom-8 left-2 right-0 mx-auto w-64 transform translate-y-1/2 z-20">
            <div className="bg-[#1E2538]/90 backdrop-blur-lg rounded-xl p-4 border border-[#2A3147] shadow-xl">
              <p className="text-white text-sm font-medium">Trusted by 10,000+</p>
              <p className="text-gray-500 text-xs mt-1">Active users worldwide</p>
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

export default Login;