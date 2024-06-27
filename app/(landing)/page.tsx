'use client'
import React from 'react';
import Navbar from './_components/navbar';
import Hero from './_components/hero';
import Features from './_components/features';
import { Testimonials } from './_components/testimonials';
import HowItWorks from './_components/how-it-works';
import Pricing from './_components/pricing';
import CTA from './_components/cta';
import Footer from './_components/footer';


const LandingPage: React.FC = () => {
  return (
    <div className="font-sans">
      <Navbar />
      <Hero />
      <Features />
      <Testimonials />
      <HowItWorks />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;