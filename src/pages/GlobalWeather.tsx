
import React from 'react';
import Header from '@/components/Header';
import WeatherForecast from '@/components/WeatherForecast';
import OpenWeatherWidget from '@/components/OpenWeatherWidget';
import Footer from '@/components/Footer';
import { Globe, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import CountryCityDropdown from '@/components/CountryCityDropdown';

const GlobalWeather = () => {
  const [showMockData, setShowMockData] = useState(false);
  const [selectedCity, setSelectedCity] = useState<string>('');
  
  return (
    <div className="min-h-screen bg-dark text-white overflow-x-hidden">
      <Header />
      
      {/* Page Title Section */}
      <section className="pt-32 pb-8 relative">
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold font-space mb-4 animate-fade-in flex items-center gap-3">
              <Globe className="h-8 w-8 text-purple" /> 
              Global <span className="text-purple animate-text-glow">Weather Forecast</span>
            </h1>
            <p className="text-xl text-gray-light animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Live weather conditions and forecasts for cities worldwide.
            </p>
            <div className="flex flex-wrap gap-2 mt-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <div className="bg-purple/10 rounded-full px-3 py-1 text-sm font-medium text-purple flex items-center gap-1">
                <MapPin className="h-3 w-3" /> 190+ Cities Worldwide
              </div>
              <div className="bg-purple/10 rounded-full px-3 py-1 text-sm font-medium text-purple">
                Real-time Updates
              </div>
              <div className="bg-purple/10 rounded-full px-3 py-1 text-sm font-medium text-purple">
                5-Day Forecasts
              </div>
              <div className="bg-purple/10 rounded-full px-3 py-1 text-sm font-medium text-purple">
                Flight Weather Reports
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* City Selection Section */}
      <div className="container mx-auto px-4 mb-6">
        <div className="max-w-xl mx-auto">
          <CountryCityDropdown 
            onSelectCity={setSelectedCity} 
            selectedCity={selectedCity}
          />
        </div>
      </div>
      
      {/* Weather Toggle Section */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex justify-center space-x-4">
          <Button 
            variant={!showMockData ? "default" : "outline"} 
            className={!showMockData ? "bg-purple text-white" : "border-gray-light text-gray-light"} 
            onClick={() => setShowMockData(false)}
          >
            Live Weather API
          </Button>
          <Button 
            variant={showMockData ? "default" : "outline"} 
            className={showMockData ? "bg-purple text-white" : "border-gray-light text-gray-light"} 
            onClick={() => setShowMockData(true)}
          >
            Mock Weather Data
          </Button>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {showMockData ? (
          <WeatherForecast selectedCity={selectedCity} />
        ) : (
          <OpenWeatherWidget selectedCity={selectedCity} />
        )}
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default GlobalWeather;
