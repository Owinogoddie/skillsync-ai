"use client";
import React from "react";
import { Sidebar } from "./_components/sidebar";
import { Navbar } from "./_components/navbar";
import { useRouter } from "next/navigation";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

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
