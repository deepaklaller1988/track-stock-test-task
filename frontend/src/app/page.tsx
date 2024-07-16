// src/app.tsx
"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Loader from "@/components/core/Loader";
import { getToken } from "@/lib/token";

export default function App({ Component, pageProps }: any) {
  const router = useRouter();
  const pathname = usePathname();
  const token= getToken

  useEffect(() => {
    if (!token && pathname !== "/auth/login") {
      router.push("/auth/login");
    }
  }, [pathname]);

  return (
    <Loader/>
  )
}
