import React from 'react';
import { motion } from 'framer-motion';
import ScrollAnimation from '../animations/scroll-animation';
import Link from 'next/link';

const CTA: React.FC = () => {
  return (
    <section className="bg-gray-600 text-white py-20">
      <div className="container mx-auto text-center px-4">
        <ScrollAnimation direction="down">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Course Creation and learning?
          </h2>
        </ScrollAnimation>
        <ScrollAnimation>
          <p className="text-xl mb-8">
            Join thousands of students using SkillSync AI to create engaging courses.
          </p>
        </ScrollAnimation>
        <ScrollAnimation direction="up">
          <motion.button
            className="bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold text-lg hover:bg-indigo-100 transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/dashboard/autogen">Start Your Free Trial</Link>
          </motion.button>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default CTA;