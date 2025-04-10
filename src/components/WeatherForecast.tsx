
import React, { useState } from 'react';
import { Cloud, CloudRain, CloudSnow, Search, Sun, Wind, CloudLightning } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample weather data for different cities
const weatherData = {
  'New York': {
    current: { temp: 72, condition: 'Partly Cloudy', humidity: 65, wind: 8, icon: Cloud },
    forecast: [
      { day: 'Mon', temp: 74, condition: 'Sunny', icon: Sun },
      { day: 'Tue', temp: 76, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Wed', temp: 71, condition: 'Rain', icon: CloudRain },
      { day: 'Thu', temp: 68, condition: 'Rain', icon: CloudRain },
      { day: 'Fri', temp: 70, condition: 'Partly Cloudy', icon: Cloud },
    ]
  },
  'London': {
    current: { temp: 62, condition: 'Rain', humidity: 80, wind: 12, icon: CloudRain },
    forecast: [
      { day: 'Mon', temp: 60, condition: 'Rain', icon: CloudRain },
      { day: 'Tue', temp: 59, condition: 'Cloudy', icon: Cloud },
      { day: 'Wed', temp: 63, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Thu', temp: 65, condition: 'Sunny', icon: Sun },
      { day: 'Fri', temp: 61, condition: 'Cloudy', icon: Cloud },
    ]
  },
  'Tokyo': {
    current: { temp: 81, condition: 'Sunny', humidity: 70, wind: 5, icon: Sun },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Sunny', icon: Sun },
      { day: 'Tue', temp: 85, condition: 'Sunny', icon: Sun },
      { day: 'Wed', temp: 86, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Thu', temp: 84, condition: 'Rain', icon: CloudRain },
      { day: 'Fri', temp: 80, condition: 'Thunderstorm', icon: CloudLightning },
    ]
  },
  'Sydney': {
    current: { temp: 68, condition: 'Windy', humidity: 55, wind: 15, icon: Wind },
    forecast: [
      { day: 'Mon', temp: 65, condition: 'Windy', icon: Wind },
      { day: 'Tue', temp: 63, condition: 'Rain', icon: CloudRain },
      { day: 'Wed', temp: 67, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Thu', temp: 72, condition: 'Sunny', icon: Sun },
      { day: 'Fri', temp: 74, condition: 'Sunny', icon: Sun },
    ]
  },
  'Moscow': {
    current: { temp: 40, condition: 'Snow', humidity: 85, wind: 10, icon: CloudSnow },
    forecast: [
      { day: 'Mon', temp: 38, condition: 'Snow', icon: CloudSnow },
      { day: 'Tue', temp: 36, condition: 'Snow', icon: CloudSnow },
      { day: 'Wed', temp: 42, condition: 'Cloudy', icon: Cloud },
      { day: 'Thu', temp: 45, condition: 'Partly Cloudy', icon: Cloud },
      { day: 'Fri', temp: 41, condition: 'Snow', icon: CloudSnow },
    ]
  },
  'Dubai': {
    current: { temp: 95, condition: 'Sunny', humidity: 40, wind: 7, icon: Sun },
    forecast: [
      { day: 'Mon', temp: 97, condition: 'Sunny', icon: Sun },
      { day: 'Tue', temp: 98, condition: 'Sunny', icon: Sun },
      { day: 'Wed', temp: 96, condition: 'Sunny', icon: Sun },
      { day: 'Thu', temp: 95, condition: 'Sunny', icon: Sun },
      { day: 'Fri', temp: 93, condition: 'Partly Cloudy', icon: Cloud },
    ]
  }
};

type City = keyof typeof weatherData;
const cities = Object.keys(weatherData) as City[];

const WeatherForecast: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState<City>('New York');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCities = cities.filter(city => 
    city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectCity = (city: City) => {
    setSelectedCity(city);
    setSearchTerm('');
  };

  const getWeatherBackground = (condition: string) => {
    switch (condition) {
      case 'Sunny':
        return 'from-yellow-500/20 to-orange-500/20';
      case 'Partly Cloudy':
        return 'from-blue-400/20 to-gray-400/20';
      case 'Cloudy':
        return 'from-gray-400/20 to-gray-600/20';
      case 'Rain':
        return 'from-blue-600/20 to-gray-700/20';
      case 'Thunderstorm':
        return 'from-purple-800/20 to-gray-900/20';
      case 'Snow':
        return 'from-blue-100/20 to-gray-200/20';
      case 'Windy':
        return 'from-teal-400/20 to-blue-300/20';
      default:
        return 'from-blue-400/20 to-blue-600/20';
    }
  };

  return (
    <section id="weather" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-6">
          <Cloud className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Global Weather Forecast</h2>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/3">
            <div className="glass-panel p-4 mb-4">
              <div className="relative mb-4">
                <Input
                  type="text"
                  placeholder="Search cities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light h-4 w-4" />
              </div>
              
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => (
                    <button
                      key={city}
                      className={cn(
                        "w-full flex justify-between items-center p-2 rounded transition-colors",
                        selectedCity === city 
                          ? "bg-purple/20 text-white" 
                          : "hover:bg-white/5 text-gray-light"
                      )}
                      onClick={() => selectCity(city)}
                    >
                      <span>{city}</span>
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{weatherData[city].current.temp}°F</span>
                        {React.createElement(weatherData[city].current.icon, { 
                          size: 16, 
                          className: selectedCity === city ? "text-purple" : "text-gray-light" 
                        })}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center text-gray-light py-4">No cities match your search</div>
                )}
              </div>
            </div>
            
            <Button 
              className="w-full bg-purple hover:bg-purple-600 text-white purple-glow"
            >
              View Flight Weather Conditions
            </Button>
          </div>
          
          <div className="w-full lg:w-2/3">
            <div 
              className={cn(
                "glass-panel overflow-hidden rounded-2xl p-6 bg-gradient-to-br transition-all duration-500",
                getWeatherBackground(weatherData[selectedCity].current.condition)
              )}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-2xl font-medium">{selectedCity}</h3>
                  <p className="text-gray-light">Today's Weather</p>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-light">{weatherData[selectedCity].current.temp}°F</div>
                  <p className="text-purple">{weatherData[selectedCity].current.condition}</p>
                </div>
              </div>
              
              <div className="flex mt-8 justify-center">
                {React.createElement(weatherData[selectedCity].current.icon, { 
                  size: 80, 
                  className: "text-white opacity-80" 
                })}
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-light">Humidity</div>
                  <div className="text-lg font-medium">{weatherData[selectedCity].current.humidity}%</div>
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="text-sm text-gray-light">Wind Speed</div>
                  <div className="text-lg font-medium">{weatherData[selectedCity].current.wind} mph</div>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-3">5-Day Forecast</h4>
                <div className="grid grid-cols-5 gap-2">
                  {weatherData[selectedCity].forecast.map((day, index) => (
                    <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                      <div className="text-sm font-medium">{day.day}</div>
                      <div className="my-2">
                        {React.createElement(day.icon, { 
                          size: 24, 
                          className: "mx-auto text-white opacity-80" 
                        })}
                      </div>
                      <div className="text-sm font-medium">{day.temp}°F</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeatherForecast;
