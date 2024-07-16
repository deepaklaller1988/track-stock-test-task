// src/app.tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/core/Loader";

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const pathname = usePathname();

  // Example of global useEffect for handling authentication checks
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathname !== "/auth/login") {
      router.push("/auth/login");
    }
  }, [pathname]);

  return <Loader />;
}
