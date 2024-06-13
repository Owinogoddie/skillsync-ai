"use client";
import React, { useEffect } from "react";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { useRouter } from "next/navigation";
import { useAuthModalStore } from "@/stores/useAuthModalStore";
import { useSession } from "next-auth/react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { isOpen, onToggleModal } = useAuthModalStore();
  const { data: session } = useSession();
  useEffect(() => {
    if (!session) {
      router.push("/auth/login");
      onToggleModal();
    }
  }, [onToggleModal, router, session]);
  return (
    <div className="h-full">
      <div className="md:pl-56 h-[80px] fixed inset-y-0 w-full">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pl-56 h-full pt-[80px]">{children}</main>
    </div>
  );
};

export default DashboardLayout;
