import React from 'react';
import { motion } from 'framer-motion';
import ScrollAnimation from '../animations/scroll-animation';

const Pricing: React.FC = () => {
  const plans = [
    { name: "Basic", price: "$00", features: ["AI Course Generation", "Progress Tracking", "Up to 5 Courses"] },
    { name: "Pro", price: "$00", features: ["Everything in Basic", "Advanced Analytics", "Unlimited Courses", "Priority Support"] },
    { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom Integrations", "Dedicated Account Manager", "On-premise Deployment"] }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-bold text-center mb-12">Pricing Plans</h2>
        </ScrollAnimation>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <ScrollAnimation key={index} direction={index === 1 ? 'up' : index === 0 ? 'left' : 'right'}>
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                <p className="text-4xl font-bold mb-6">{plan.price}<span className="text-sm font-normal">/month</span></p>
                <ul className="mb-6">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="mb-2">{feature}</li>
                  ))}
                </ul>
                <motion.button
                  className="bg-indigo-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-indigo-700 transition duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Choose Plan
                </motion.button>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;