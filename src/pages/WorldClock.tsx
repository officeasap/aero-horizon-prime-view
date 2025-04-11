
import React, { useState, useEffect } from 'react';
import { Clock, Search, Globe, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Define major cities with their time zones
const majorCities = [
  { city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { city: 'London', country: 'UK', timezone: 'Europe/London' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
];

interface City {
  city: string;
  country: string;
  timezone: string;
}

const WorldClockPage: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(majorCities);
  
  // Update time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredCities(majorCities);
    } else {
      const filtered = majorCities.filter(
        city => 
          city.city.toLowerCase().includes(term) || 
          city.country.toLowerCase().includes(term)
      );
      setFilteredCities(filtered);
    }
  };
  
  // Get formatted time for a timezone
  const getTimeInTimezone = (timezone: string): { time: string, hours: number, minutes: number, seconds: number } => {
    try {
      const date = new Date(currentTime);
      const localTime = date.toLocaleString('en-US', { timeZone: timezone });
      const timeObj = new Date(localTime);
      
      const hours = timeObj.getHours();
      const minutes = timeObj.getMinutes();
      const seconds = timeObj.getSeconds();
      
      // Format time as HH:MM
      const formattedTime = format(timeObj, 'HH:mm');
      
      return { 
        time: formattedTime, 
        hours, 
        minutes, 
        seconds 
      };
    } catch (error) {
      console.error(`Error getting time for timezone ${timezone}:`, error);
      return { time: "--:--", hours: 0, minutes: 0, seconds: 0 };
    }
  };
  
  // Format analog clock hands positions
  const getHandStyles = (hours: number, minutes: number, seconds: number) => {
    const hourDegrees = (hours % 12) * 30 + minutes * 0.5;
    const minuteDegrees = minutes * 6;
    const secondDegrees = seconds * 6;
    
    return {
      hourHand: { transform: `rotate(${hourDegrees}deg)` },
      minuteHand: { transform: `rotate(${minuteDegrees}deg)` },
      secondHand: { transform: `rotate(${secondDegrees}deg)` },
    };
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      
      {/* World Clock Hero */}
      <section className="pt-32 pb-16 relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-radial-gradient from-purple/10 via-transparent to-transparent z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-space mb-4 animate-fade-in">
              World <span className="text-purple animate-text-glow">Clock</span>
            </h1>
            <p className="text-xl text-gray-light mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              Check the local time in major cities around the world with our interactive clock display.
            </p>
          </div>
        </div>
      </section>
      
      {/* World Clock Main Section */}
      <section className="py-12 bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Globe className="text-purple h-6 w-6" />
                <h2 className="text-2xl font-semibold font-space">Global Time Zones</h2>
              </div>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search city or country..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10 w-48 md:w-64"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light h-4 w-4" />
              </div>
            </div>
            
            {filteredCities.length === 0 ? (
              <div className="glass-panel p-8 text-center">
                <p className="text-gray-light">No cities found matching your search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredCities.map((city, index) => {
                  const { time, hours, minutes, seconds } = getTimeInTimezone(city.timezone);
                  const handStyles = getHandStyles(hours, minutes, seconds);
                  
                  return (
                    <div key={`${city.city}-${index}`} className="glass-panel hover:bg-white/5 transition-all duration-300 p-5 flex flex-col items-center">
                      <div className="mb-2 text-center">
                        <h3 className="text-lg font-medium text-white">{city.city}</h3>
                        <div className="flex items-center justify-center gap-1 text-sm text-gray-light">
                          <MapPin className="h-3 w-3" />
                          <span>{city.country}</span>
                        </div>
                      </div>
                      
                      {/* Watch UI based on the provided image */}
                      <div className="relative w-24 h-24 bg-black rounded-full border-4 border-gray-dark/80 shadow-lg mb-2 flex items-center justify-center overflow-hidden">
                        {/* Watch face */}
                        <div className="absolute inset-0 bg-black rounded-full">
                          {/* Hour markers */}
                          {[...Array(12)].map((_, i) => (
                            <div 
                              key={i} 
                              className="absolute w-1 h-1 bg-purple-400/30 rounded-full" 
                              style={{ 
                                left: `${50 + 42 * Math.cos(((i * 30) - 90) * (Math.PI / 180))}%`,
                                top: `${50 + 42 * Math.sin(((i * 30) - 90) * (Math.PI / 180))}%`
                              }}
                            />
                          ))}
                          
                          {/* Digital time display */}
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-xs font-mono text-gray-light/30">
                              {format(currentTime, 'EEE')}
                            </div>
                            <div className="text-xl font-bold text-green-400">
                              {time}
                            </div>
                            <div className="text-xs font-mono text-purple-400/60 mt-1">
                              {format(currentTime, 'MMM d')}
                            </div>
                          </div>
                          
                          {/* Clock hands */}
                          <div className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-white/40 -mt-6 origin-bottom rounded-t-full" style={handStyles.hourHand} />
                          <div className="absolute top-1/2 left-1/2 w-0.5 h-8 bg-purple-400/80 -mt-8 origin-bottom rounded-t-full" style={handStyles.minuteHand} />
                          <div className="absolute top-1/2 left-1/2 w-0.5 h-9 bg-green-400/80 -mt-9 origin-bottom rounded-t-full" style={handStyles.secondHand} />
                          
                          {/* Center dot */}
                          <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-purple-400 rounded-full -mt-1 -ml-1 z-10" />
                        </div>
                      </div>
                      
                      {/* Timezone info */}
                      <div className="mt-1 text-sm text-gray-light">
                        {city.timezone.replace('_', ' ').split('/').pop()}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default WorldClockPage;
