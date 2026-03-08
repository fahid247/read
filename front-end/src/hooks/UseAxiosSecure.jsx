"use client";

import axios from "axios";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import UseAuth from "./UseAuth";

// Create a stable axios instance outside the hook
const axiosSecureInstance = axios.create({
  baseURL: "https://back-end-xi-lake.vercel.app/",
});

const UseAxiosSecure = () => {
  const { user, logOut } = UseAuth(); // ✅ hook at top level
  const router = useRouter(); // ✅ hook at top level

  // Memoize axios instance to prevent recreating every render
  const axiosInstance = useMemo(() => axiosSecureInstance, []);

  useEffect(() => {
    // Request interceptor
    const reqInterceptor = axiosInstance.interceptors.request.use((config) => {
      if (user?.accessToken) {
        config.headers.Authorization = `Bearer ${user.accessToken}`;
      }
      return config;
    });

    // Response interceptor
    const resInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const statusCode = error.response?.status;
        if (statusCode === 401 || statusCode === 403) {
          logOut().then(() => router.push("/login"));
        }
        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      axiosInstance.interceptors.request.eject(reqInterceptor);
      axiosInstance.interceptors.response.eject(resInterceptor);
    };
  }, [user, logOut, router, axiosInstance]);

  return axiosInstance;
};

export default UseAxiosSecure;