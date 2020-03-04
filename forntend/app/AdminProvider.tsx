"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin") === "true";

    if (!isAdmin) {
      router.push("/admin-panel");
    }
  }, [router]);

  return <>{children}</>;
};
