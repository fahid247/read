"use client";

import axios from "axios";
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import UseAuth from "./UseAuth";

const axiosSecureInstance = axios.create({
  //   baseURL: "https://back-end-xi-lake.vercel.app/",
  baseURL: "http://localhost:5000/",
});

const UseAxiosSecure = () => {
  const { user, logOut } = UseAuth();
  const router = useRouter();

  const axiosInstance = useMemo(() => axiosSecureInstance, []);

  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        if (user?.accessToken) {
          config.headers.Authorization = `Bearer ${user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    const responseInterceptor = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error?.response?.status;

        // 🚀 Only redirect if user already exists
        if ((status === 401 || status === 403) && user) {
          try {
            await logOut();
            router.replace("/login");
          } catch (logoutError) {
            console.error("Logout failed:", logoutError);
          }
        }

        return Promise.reject(error);
      },
    );

    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut, router, axiosInstance]);

  return axiosInstance;
};

export default UseAxiosSecure;
