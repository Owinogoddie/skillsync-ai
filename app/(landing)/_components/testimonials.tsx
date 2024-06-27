import React from 'react'
import { motion } from 'framer-motion';
const testimonials = [
    { quote: "SkillSync AI has revolutionized the way I create and manage my online courses. It's a game-changer!", author: "Sarah J., Online Educator" },
    { quote: "The AI-generated content is impressive and saves me hours of work. Highly recommended!", author: "Mark T., Corporate Trainer" },
    { quote: "I've seen a significant increase in student engagement since using SkillSync AI. The personalized learning paths are fantastic!", author: "Emily R., University Professor" },
    { quote: "SkillSync AI has made course creation a breeze. I can focus more on teaching and less on content preparation.", author: "David L., E-learning Specialist" },
    { quote: "The analytics provided by SkillSync AI have helped me improve my courses and better understand my students' needs.", author: "Rachel K., High School Teacher" },
    { quote: "As a subject matter expert, I found SkillSync AI invaluable in translating my knowledge into well-structured courses.", author: "Michael B., Industry Consultant" },
  ];

export function Testimonials() {
  return (
    <div>
        <section className="py-20 bg-gray-100 overflow-hidden">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
          <div className="relative">
            <motion.div
              className="flex space-x-8"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                },
              }}
            >
              {testimonials.concat(testimonials).map((testimonial, index) => (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-md flex-shrink-0 w-80"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                >
                  <p className="mb-4 text-gray-600 italic">&apos;{testimonial.quote}&apos;</p>
                  <p className="font-semibold text-indigo-600">- {testimonial.author}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
