
import React from 'react';
import Header from '@/components/Header';
import WeatherForecast from '@/components/WeatherForecast';
import Footer from '@/components/Footer';

const GlobalWeather = () => {
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in">
              Global <span className="text-purple animate-text-glow">Weather Forecast</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Live weather conditions and forecasts for airports and cities worldwide.
            </p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <WeatherForecast />
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalWeather;
