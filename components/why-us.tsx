import React from "react";
import { Meteors } from "./magic-ui/meteors";
import { Description } from "@radix-ui/react-alert-dialog";
const whyChooseUs = {
  title: "Why Choose SkillSync-AI?",
  features: [
    {
      headline: "AI-Powered Course Creation",
      description:
        "Harness the power of artificial intelligence to create compelling, interactive courses in minutes. Our AI suggests content, structures modules, and enhances engagement.",
    },
    {
      headline: "User-Friendly Interface",
      description:
        "Intuitive design that makes course creation a breeze, even for beginners. No coding or advanced tech skills required.",
    },
    {
      headline: "Interactive Learning Tools",
      description:
        "Add quizzes, polls, and interactive content to keep learners engaged and ensure better retention.",
    },
    {
      headline: "Analytics and Insights",
      description:
        "Track your  progress and get detailed insights to continuously improve your journey.",
    },
  ],
};
interface WhyUsCardProps {
  heading: string;
  description: string;
  stars: number;
}
export function WhyUsCard({ heading, description, stars }: WhyUsCardProps) {
  return (
    <div className="">
      <div className=" w-full relative max-w-xs h-[300px]">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-teal-500 transform scale-[0.80] bg-red-500 rounded-full blur-3xl" />
        <div className="relative shadow-xl bg-gray-800 border border-gray-800  px-4 py-8 h-full overflow-hidden rounded-2xl flex flex-col justify-end items-start">
          <div className="h-5 w-5 rounded-full border flex items-center justify-center mb-4 border-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="h-2 w-2 text-gray-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25"
              />
            </svg>
          </div>

          <h1 className="font-bold text-xl text-white mb-4 relative z-50">
            {heading}
          </h1>

          <p className="font-normal text-base text-slate-500 mb-4 relative z-50">
            {description}
          </p>

          <button className="border px-4 py-1 rounded-lg  border-gray-500 text-gray-300">
            Explore
          </button>

          {/* Meaty part - Meteor effect */}
          <Meteors number={stars} />
        </div>
      </div>
    </div>
  );
}
export const WhyUs = () => {
  return (
    <div>
        <p className="text-leading text-3xl p-4 font-bold text-center">Why Choose SkillSync-AI? </p>

        <div className="md:flex md:gap-3 md:flex-wrap items-center justify-center">
      <div>
      </div>
      {whyChooseUs.features.map((item, index) => (
        <WhyUsCard
          key={index}
          heading={item.headline}
          description={item.description}
          stars={20}
        />
      ))}
    </div>
    </div>
  );
};
