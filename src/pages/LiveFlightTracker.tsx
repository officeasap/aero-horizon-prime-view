
import React from 'react';
import Header from '@/components/Header';
import FlightTracker from '@/components/FlightTracker';
import Footer from '@/components/Footer';

const LiveFlightTracker = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Live <span className="text-purple animate-text-glow">Flight Tracker</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Track real-time aircraft positions, routes, and flight statuses across the globe.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <FlightTracker />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LiveFlightTracker;
