"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useRole from "@/Hooks/UseRole";
import Loading from "@/app/Loading";

const RoleGuard = ({ allowedRoles, children }) => {
  const { role, roleLoading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (!roleLoading && !allowedRoles.includes(role)) {
      router.replace("/forbidden");
    }
  }, [role, roleLoading, allowedRoles, router]);

  if (roleLoading) {
    return <p className="p-6"><Loading></Loading></p>;
  }

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return children;
};

export default RoleGuard;