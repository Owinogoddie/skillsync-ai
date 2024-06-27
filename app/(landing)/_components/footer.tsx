// src/_components/Footer.tsx
import React from 'react';
import ScrollAnimation from '../animations/scroll-animation';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-gradient-start to-gradient-end text-white py-12">
      <div className="container mx-auto px-4">
        <ScrollAnimation>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">SkillSync AI</h3>
              <p>Empowering students with AI-driven course creation and management.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Home</a></li>
                <li><a href="#" className="hover:text-gray-300">Features</a></li>
                <li><a href="#" className="hover:text-gray-300">Pricing</a></li>
                <li><a href="#" className="hover:text-gray-300">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Terms of Service</a></li>
                <li><a href="#" className="hover:text-gray-300">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Connect</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-gray-300">Twitter</a></li>
                <li><a href="#" className="hover:text-gray-300">LinkedIn</a></li>
                <li><a href="#" className="hover:text-gray-300">Facebook</a></li>
              </ul>
            </div>
          </div>
        </ScrollAnimation>
        <div className="mt-8 text-center">
          <p>&copy; 2024 SkillSync AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;