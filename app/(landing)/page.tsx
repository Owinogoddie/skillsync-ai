"use client";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import Link from "next/link";
import { CourseModal } from "./_components/course-modal";
import { LinearCombobox } from "@/components/linear-combo";
import { searchYoutube } from "@/lib/youtube";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { Hero } from "./_components/hero";
import { WhyUs } from "@/components/why-us";
import { Testimonials } from "@/components/testimonials";

export default function Home() {
  const { isLoaded, userId } = useAuth();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const results = await searchYoutube("React");
  //       console.log(results);
  //     } catch (error) {
  //       console.error("Failed to fetch YouTube results:", error);
  //     }
  //   };

  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return (
    <div className="">
      <div className="flex items-center justify-between min-h-16 w-full  bg-gray-200 px-20 md:px-36">
        <span className="font-extrabold text-xl cursor-pointer">Logo</span>
        <div className="flex items-center gap-2">
          {userId ? (
            <>
              <CourseModal />
              <Button variant="outline" size="sm">
                <Link href="/dashboard">Browse Courses</Link>
              </Button>
              {/* user btn */}
              <UserButton />
            </>
          ) : (
            <>
              {!isLoaded ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                <SignInButton mode="modal" >
                  <Button variant="outline" size="sm">SignIn</Button>
                </SignInButton>
              )}
            </>
            
          )}
        </div>
      </div>

      <div className="p-6 max-w-7xl mx-auto flex flex-col items-center justify-center">
       <Hero/>
       <WhyUs/>
       <Testimonials/>
      </div>
    </div>
  );
}
