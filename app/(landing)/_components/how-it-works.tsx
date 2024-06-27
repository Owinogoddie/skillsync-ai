import React from 'react';
import ScrollAnimation from '../animations/scroll-animation';

const HowItWorks: React.FC = () => {
  const steps = [
    { step: 1, title: "Input Your Topic", description: "Enter the subject you want to teach" },
    { step: 2, title: "AI Generation", description: "Our AI creates course content and structure" },
    { step: 3, title: "Customize & Publish", description: "Review, edit, and publish your course" }
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        </ScrollAnimation>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-8 md:space-y-0 md:space-x-8">
          {steps.map((item, index) => (
            <ScrollAnimation key={index} direction="up">
              <div className="text-center">
                <div className="bg-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </ScrollAnimation>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;