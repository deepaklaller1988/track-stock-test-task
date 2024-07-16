"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/token";

const useAuth = () => {
  const router = useRouter();
  const token= getToken


  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
    }
  }, [router]);
};

export default useAuth;
