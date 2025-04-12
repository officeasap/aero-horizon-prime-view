
import React from 'react';
import Header from '@/components/Header';
import AirportAirlineSearch from '@/components/AirportAirlineSearch';
import Footer from '@/components/Footer';

const AirportAirlineSearchPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Airport & Airline <span className="text-purple animate-text-glow">Search</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Search global airports and airlines by name, city, or code to access detailed information.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <AirportAirlineSearch />
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AirportAirlineSearchPage;
