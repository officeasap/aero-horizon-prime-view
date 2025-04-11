
import React, { useState, useEffect } from 'react';
import { Clock, Search, Globe, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// Define major cities with their time zones - expanded with more Asian cities
const majorCities = [
  // Indonesia cities
  { city: 'Jakarta', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { city: 'Bali (Denpasar)', country: 'Indonesia', timezone: 'Asia/Makassar' },
  { city: 'Java (Surabaya)', country: 'Indonesia', timezone: 'Asia/Jakarta' },
  { city: 'Makassar', country: 'Indonesia', timezone: 'Asia/Makassar' },
  
  // More Asian cities
  { city: 'Shanghai', country: 'China', timezone: 'Asia/Shanghai' },
  { city: 'Seoul', country: 'South Korea', timezone: 'Asia/Seoul' },
  { city: 'Taipei', country: 'Taiwan', timezone: 'Asia/Taipei' },
  { city: 'Manila', country: 'Philippines', timezone: 'Asia/Manila' },
  { city: 'Kuala Lumpur', country: 'Malaysia', timezone: 'Asia/Kuala_Lumpur' },
  { city: 'Ho Chi Minh City', country: 'Vietnam', timezone: 'Asia/Ho_Chi_Minh' },
  { city: 'Yangon', country: 'Myanmar', timezone: 'Asia/Yangon' },
  { city: 'Dhaka', country: 'Bangladesh', timezone: 'Asia/Dhaka' },
  { city: 'Karachi', country: 'Pakistan', timezone: 'Asia/Karachi' },
  
  // New African cities
  { city: 'Nairobi', country: 'Kenya', timezone: 'Africa/Nairobi' },
  { city: 'Kampala', country: 'Uganda', timezone: 'Africa/Kampala' },
  { city: 'Cape Town', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  
  // Major global cities from before
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Hong Kong', country: 'China', timezone: 'Asia/Hong_Kong' },
  { city: 'Bangkok', country: 'Thailand', timezone: 'Asia/Bangkok' },
  { city: 'Mumbai', country: 'India', timezone: 'Asia/Kolkata' },
  { city: 'Dubai', country: 'UAE', timezone: 'Asia/Dubai' },
  { city: 'New York', country: 'USA', timezone: 'America/New_York' },
  { city: 'London', country: 'UK', timezone: 'Europe/London' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' },
  { city: 'Paris', country: 'France', timezone: 'Europe/Paris' },
  { city: 'Moscow', country: 'Russia', timezone: 'Europe/Moscow' },
  { city: 'São Paulo', country: 'Brazil', timezone: 'America/Sao_Paulo' },
  { city: 'Johannesburg', country: 'South Africa', timezone: 'Africa/Johannesburg' },
  { city: 'Cairo', country: 'Egypt', timezone: 'Africa/Cairo' },
  { city: 'Berlin', country: 'Germany', timezone: 'Europe/Berlin' },
  { city: 'Los Angeles', country: 'USA', timezone: 'America/Los_Angeles' },
  { city: 'Toronto', country: 'Canada', timezone: 'America/Toronto' },
  { city: 'Mexico City', country: 'Mexico', timezone: 'America/Mexico_City' },
  { city: 'Auckland', country: 'New Zealand', timezone: 'Pacific/Auckland' },
  { city: 'Istanbul', country: 'Turkey', timezone: 'Europe/Istanbul' },
];

interface City {
  city: string;
  country: string;
  timezone: string;
}

const WorldClock: React.FC = () => {
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
  
  // Enhanced search function that checks timezone as well
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    if (term === '') {
      setFilteredCities(majorCities);
    } else {
      const filtered = majorCities.filter(
        city => 
          city.city.toLowerCase().includes(term) || 
          city.country.toLowerCase().includes(term) ||
          city.timezone.toLowerCase().replace('_', ' ').includes(term)
      );
      setFilteredCities(filtered);
    }
  };
  
  // Get formatted time for a timezone using date-fns-tz for more accurate handling
  const getTimeInTimezone = (timezone: string): { time: string, hours: number, minutes: number, seconds: number } => {
    try {
      // Use formatInTimeZone for more accurate timezone conversion
      const formattedTime = formatInTimeZone(currentTime, timezone, 'HH:mm');
      
      // Get individual time components
      const timeInZone = new Date(formatInTimeZone(currentTime, timezone, "yyyy-MM-dd'T'HH:mm:ss.SSS"));
      const hours = timeInZone.getHours();
      const minutes = timeInZone.getMinutes();
      const seconds = timeInZone.getSeconds();
      
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
    <section id="world-clock" className="py-12 bg-dark">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Clock className="text-purple h-6 w-6" />
              <h2 className="text-2xl font-semibold font-space">World Clock</h2>
            </div>
            <div className="relative">
              <Input
                type="text"
                placeholder="Search city, country or timezone..."
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
                    
                    {/* Apple Watch UI based on the uploaded image */}
                    <div className="relative w-32 h-32 bg-black rounded-full border-4 border-gray-800 shadow-lg mb-2 flex items-center justify-center overflow-hidden">
                      {/* Watch face */}
                      <div className="absolute inset-0 bg-black rounded-full">
                        {/* Hour markers */}
                        {[...Array(12)].map((_, i) => (
                          <div 
                            key={i} 
                            className={cn(
                              "absolute font-medium text-white/80",
                              i % 3 === 0 ? "text-xs" : "text-[10px]"
                            )}
                            style={{ 
                              transform: `rotate(${i * 30}deg) translate(0, -38px) rotate(-${i * 30}deg)`,
                              left: '50%',
                              top: '50%',
                            }}
                          >
                            {i === 0 ? '12' : i}
                          </div>
                        ))}
                        
                        {/* Mini dials */}
                        <div className="absolute left-1/2 top-[30%] -translate-x-1/2 text-xs text-yellow-500 font-medium">
                          {format(currentTime, 'E')}
                        </div>
                        <div className="absolute right-[30%] top-1/2 -translate-y-1/2 text-xs text-yellow-500 font-medium">
                          {format(currentTime, 'd')}
                        </div>
                        
                        {/* Clock hands */}
                        <div className="absolute top-1/2 left-1/2 w-1.5 h-12 bg-white/80 -mt-10 -ml-[3px] origin-bottom rounded-full" style={handStyles.hourHand} />
                        <div className="absolute top-1/2 left-1/2 w-1 h-16 bg-white/90 -mt-14 -ml-[2px] origin-bottom rounded-full" style={handStyles.minuteHand} />
                        <div className="absolute top-1/2 left-1/2 w-0.5 h-16 bg-orange-500 -mt-14 -ml-[1px] origin-bottom rounded-full" style={handStyles.secondHand} />
                        
                        {/* Center dot */}
                        <div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white rounded-full -mt-1.5 -ml-1.5 z-10" />
                      </div>
                    </div>
                    
                    {/* Digital time display for accessibility */}
                    <div className="mt-1 text-lg font-mono text-white">
                      {time}
                    </div>
                    <div className="mt-0.5 text-xs text-gray-light">
                      {format(currentTime, 'EEEE, MMMM d')}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorldClock;
