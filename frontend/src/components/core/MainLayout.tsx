"use client";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: any) {
  const path = usePathname();
  const route = path.split("/");

  const isHome = () => {
    return !route.includes("auth")
      ? !route.includes("dashboard")
        ? true
        : false
      : false;
  };

  return (
    <div>
      {isHome() ? (
        <>
          <div className="w-full">{children}</div>
        </>
      ) : (
        <>
          <div>{children}</div>
        </>
      )}
    </div>
  );
}
