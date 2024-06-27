"use client";
import React from "react";
import { BarChart, Compass, Layout, List } from "lucide-react";
import { usePathname } from "next/navigation";
import { SidebarItem } from "./sidebar-item";

const guestRoutes = [
  {
    icon: Layout,
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    icon: Compass,
    label: "Browse",
    href: "/dashboard/search",
  },
];

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/dashboard/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/dashboard/teacher/analytics",
  },
];

const aiGenRoutes = [
  {
    icon: List,
    label: "AI Generated Courses",
    href: "/dashboard/teacher/courses",
  },
  {
    icon: BarChart,
    label: "AI Analytics",
    href: "/dashboard/teacher/analytics",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/dashboard/teacher");
  const isAiRoute = pathname?.includes("/dashboard/autogen");
  const isGuestRoute = pathname === "/dashboard" || pathname === "/dashboard/search";

  const getRoutes = () => {
    if (isTeacherPage) {
      return teacherRoutes;
    }
    if (isAiRoute) {
      return aiGenRoutes;
    }
    return guestRoutes;
  };

  const routes = getRoutes();

  return (
    <div className="flex flex-col w-full">
      {routes?.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
