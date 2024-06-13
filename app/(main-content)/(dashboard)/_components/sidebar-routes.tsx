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
    label: "Courses",
    href: "#",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "#",
  },
];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/dashboard/teacher");
  const isAiRoute = pathname?.includes("/dashboard/autogen");
  const isPlayerRoute = pathname==="/dashboard" ||"/dashboard/search";

  const getRoutes = () => {
    let routes;
    if (isTeacherPage) {
      routes = teacherRoutes;
    }
    if (isAiRoute) {
      routes = aiGenRoutes;
    } else {
      routes=guestRoutes;
    }
    return routes
  };
  const routes=getRoutes();
  return (
    <div className="flex flex-col w-full ">
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
