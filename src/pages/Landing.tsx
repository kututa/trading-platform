import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import MarketTable from '../components/MarketTable';
import Features from '../components/Features';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <MarketTable />
      <Features />
      <Footer />
    </>
  );
};

export default Landing;