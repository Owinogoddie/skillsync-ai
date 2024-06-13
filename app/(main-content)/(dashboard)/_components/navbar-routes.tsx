"use client";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "@/components/search-input";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";

export const NavbarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
  const isPlayerPage = pathname?.startsWith("/dashboard");
  // const isPlayerPage=pathname?.startsWith("/dashboard/chapter")
  const isSearchPage = pathname === "/dashboard/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-2 ml-auto">
        {isTeacherPage || isPlayerPage ? (
          <Link href="/">
            <Button variant="ghost">
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          </Link>
        ) : isPlayerPage ? (
          <Link href="/dashboard/teacher/courses">
            <Button size="sm" variant="ghost">
              Student
            </Button>
          </Link>
        ) : (
          <Link href="/dashboard/teacher/courses">
            <Button size="sm" variant="ghost">
              TeacherMode
            </Button>
          </Link>
        )}

        <UserButton afterSignOutUrl="/" />
        {/* <UserButton afterSignOutUrl='/'/> */}
      </div>
    </>
  );
};
