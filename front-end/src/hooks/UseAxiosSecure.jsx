"use client";

import axios from "axios";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import UseAuth from "./UseAuth";

const axiosSecureInstance = axios.create({
  baseURL: "https://back-end-xi-lake.vercel.app/",
//   baseURL: "http://localhost:5000/",
});

const UseAxiosSecure = () => {
  const { user, logOut, loading } = UseAuth();
  const router = useRouter();

  const axiosInstance = useMemo(() => axiosSecureInstance, []);

  useEffect(() => {
    // 🚀 Wait until auth finishes loading
    if (loading) return;

    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        if (!loading && (status === 401 || status === 403) && user) {
          try {
            await logOut();
            router.replace("/login");
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, router, axiosInstance, loading]);

  return axiosInstance;
};

export default UseAxiosSecure;