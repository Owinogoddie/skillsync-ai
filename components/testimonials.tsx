"use client";

import React, { useEffect, useState } from "react";
import InfiniteMovingCards from "./magic-ui/infinite-moving-cards";

export function Testimonials() {
  return (
    <div className="h-[20rem] rounded-md flex flex-col antialiased dark:bg-black dark:bg-grid-white/[0.05] items-center justify-center relative overflow-hidden pt-10">
      <p className="text-leading text-3xl p-4 font-bold text-center">
        What Our Users Say
      </p>
      <InfiniteMovingCards
        items={testimonials}
        direction="right"
        speed="slow"
        className="bg-slate-800"
      />
    </div>
  );
}

const testimonials = [
  {
    quote:
      "SkillSync-AI revolutionized the way I create courses. It's incredibly easy to use, and the AI suggestions are spot on!",
    name: "Jane D., Online Instructor",
  },
  {
    quote:
      "I saved countless hours on course development. The interactive tools have significantly improved my student engagement.",
    name: "Mark S., Corporate Trainer",
  },
  {
    quote:
      "SkillSync-AI's analytics helped me understand my students better and adjust my content accordingly.",
    name: "Emily R., Educational Consultant",
  },
  {
    quote:
      "SkillSync-AI revolutionized the way I create courses. It's incredibly easy to use, and the AI suggestions are spot on!",
    name: "Jane D., Online Instructor",
  },
  {
    quote:
      "I saved countless hours on course development. The interactive tools have significantly improved my student engagement.",
    name: "Mark S., Corporate Trainer",
  },
  {
    quote:
      "SkillSync-AI's analytics helped me understand my students better and adjust my content accordingly.",
    name: "Emily R., Educational Consultant",
  },
];
