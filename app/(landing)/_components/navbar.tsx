import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { CourseModal } from "./course-modal";

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-dark-gray-800 shadow-lg' : 'bg-gray-500'
    }`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold text-white">SkillSync AI</div>
          <div className="hidden md:flex space-x-4">
          <Link href="#" className="text-white hover:text-gray-300">Home</Link>
            <Link href="#" className="text-white hover:text-gray-300">Features</Link>
            <Link href="#" className="text-white hover:text-gray-300">Pricing</Link>
            <Link href="#" className="text-white hover:text-gray-300">Contact</Link>
          </div>
          {userId ? (
            <div className="hidden  md:flex items-center justify-center gap-2">
              <CourseModal />
              <Button variant="outline" size="sm">
                <Link href="/dashboard">Browse Courses</Link>
              </Button>
              {/* user btn */}
              <UserButton afterSignOutUrl="/" />
            </div>
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
          <div className="flex justify-center item-center gap-2">
          <div className="md:hidden">
            {userId && <UserButton afterSignOutUrl="/"/>}
          </div>
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          </div>
          
        </div>
      </div>
      {/* mobile-nav */}
      <motion.div
        className={`md:hidden bg-slate-600 ${isMenuOpen ? "block" : "hidden"}`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMenuOpen ? 1 : 0, y: isMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="px-4 py-3 space-y-2">
          <Link href="#" className="block text-white hover:text-indigo-200">
            Home
          </Link>
          <Link href="#" className="block text-white hover:text-indigo-200">
            Features
          </Link>
          <Link href="#" className="block text-white hover:text-indigo-200">
            Pricing
          </Link>
          <Link href="#" className="block text-white hover:text-indigo-200">
            Contact
          </Link>
          {userId ? (
            <div className="flex flex-col items-center justify-center gap-2 w-full">
              <CourseModal className="w-full rounded-full" />
              <Button variant="outline" className="w-full rounded-full" size="sm" >
                <Link href="/dashboard">Browse Courses</Link>
              </Button>
              {/* user btn */}
              {/* <UserButton /> */}
            </div>
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
      </motion.div>
    </nav>
  );
};

export default Navbar;
