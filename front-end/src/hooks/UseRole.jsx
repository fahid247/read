import { useQuery } from "@tanstack/react-query";
import useAuth from "./UseAuth";
import useAxiosSecure from "./UseAxiosSecure";

const UseRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading: roleLoading, data: role = "user" } = useQuery({
    queryKey: ["user-role", user?.email],
    enabled: !!user?.email, // wait for user
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}/role`);
      return res.data?.role || "user";
    },

    // 🚀 important settings
    staleTime: Infinity,      // never becomes stale
    cacheTime: Infinity,      // keep in cache
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  return { role, roleLoading };
};

export default UseRole;