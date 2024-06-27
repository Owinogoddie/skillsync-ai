import React from "react";
import ScrollAnimation from "../animations/scroll-animation";
import { motion } from "framer-motion";

const Features: React.FC = () => {
  const features = [
    {
      title: "AI Course Creation",
      description:
        "Leverage AI to generate course content, quizzes, and exercises effortlessly.",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor student progress and engagement with detailed analytics.",
    },
    {
      title: "Course Management",
      description:
        "Easily organize, update, and manage your courses from one central dashboard.",
    },
    {
      title: "Personalized Learning Paths",
      description:
        "AI-driven recommendations for personalized student learning journeys.",
    },
    {
      title: "Interactive Assessments",
      description:
        "Create engaging quizzes and assignments with our AI-powered tool.",
    },
    {
      title: "AI Chat",
      description: "Chat with ai to get insights of the chapter.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-bold text-center mb-12 text-dark-gray-900">Key Features</h2>
        </ScrollAnimation>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <ScrollAnimation key={index} direction={index % 2 === 0 ? 'left' : 'right'}>
              <div className="bg-white p-6 rounded-lg shadow-md h-[150px]">
                <h3 className="text-xl font-semibold mb-4 text-dark-gray-800">{feature.title}</h3>
                <p className="text-dark-gray-700">{feature.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
