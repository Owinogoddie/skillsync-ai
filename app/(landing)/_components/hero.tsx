// src/_components/Hero.tsx
import React from "react";
import { motion } from "framer-motion";
import ScrollAnimation from "../animations/scroll-animation";
import Link from "next/link";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { CourseModal } from "./course-modal";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Hero: React.FC = () => {
  const { isLoaded, userId } = useAuth();
  return (
    <header className="bg-gradient-to-br from-gradient-start to-gradient-end text-white py-32">
      <div className="container mx-auto text-center px-4">
        <ScrollAnimation direction="down">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Create AI-Powered Courses with Ease
          </h1>
        </ScrollAnimation>
        <ScrollAnimation>
          <p className="text-xl mb-8">
            SkillSync AI: Your personal course creation and management assistant
          </p>
        </ScrollAnimation>
        <ScrollAnimation direction="up">

          <motion.button
            className="bg-primary text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-primary-dark transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {userId ? (
              
            <Link href="/dashboard/autogen">Get Started Free</Link>
              
            ) : (
              <>
                {!isLoaded ? (
                  <Loader2 className="animate-spin h-4 w-4" />
                ) : (
                  <SignInButton mode="modal">
                      SignIn
                  </SignInButton>
                )}
              </>
            )}
          </motion.button>
        </ScrollAnimation>
      </div>
    </header>
  );
};

export default Hero;
