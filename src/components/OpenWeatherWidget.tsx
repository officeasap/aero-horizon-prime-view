
import React, { useState, useEffect } from 'react';
import { Search, Loader2, MapPin, Droplets, Wind, Eye, Sunrise, Sunset, ThermometerSun, ThermometerSnowflake, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { fetchWeatherByCity, fetchWeatherByCoords, OpenWeatherData } from '@/services/openWeatherService';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';

const OpenWeatherWidget: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [weatherData, setWeatherData] = useState<OpenWeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [usingGeolocation, setUsingGeolocation] = useState(false);

  useEffect(() => {
    // Try to get user's location on initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setUsingGeolocation(true);
          await fetchWeatherByLocation(position.coords.latitude, position.coords.longitude);
          setInitialLoading(false);
        },
        (error) => {
          console.log("Geolocation error or permission denied:", error);
          // Default to a popular city if geolocation is unavailable
          handleCitySearch("New York");
          setInitialLoading(false);
        }
      );
    } else {
      // Geolocation not supported by the browser
      handleCitySearch("New York");
      setInitialLoading(false);
    }
  }, []);

  const fetchWeatherByLocation = async (lat: number, lon: number) => {
    setLoading(true);
    try {
      const data = await fetchWeatherByCoords(lat, lon);
      if (data) {
        setWeatherData(data);
        toast.success(`Weather data loaded for ${data.location.name}`);
      }
    } catch (error) {
      console.error("Error fetching weather by location:", error);
      toast.error("Failed to load weather by location");
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (city: string = searchTerm) => {
    if (!city.trim()) {
      toast.error("Please enter a city name");
      return;
    }

    setLoading(true);
    try {
      const data = await fetchWeatherByCity(city);
      if (data) {
        setWeatherData(data);
        toast.success(`Weather data loaded for ${data.location.name}`);
      }
    } catch (error) {
      console.error("Error searching city:", error);
      toast.error("Failed to search city");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCitySearch();
    }
  };

  const getWeatherBackground = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'clear':
        return 'from-yellow-500/20 to-orange-500/20';
      case 'clouds':
        return 'from-blue-400/20 to-gray-400/20';
      case 'rain':
      case 'drizzle':
        return 'from-blue-600/20 to-gray-700/20';
      case 'thunderstorm':
        return 'from-purple-800/20 to-gray-900/20';
      case 'snow':
        return 'from-blue-100/20 to-gray-200/20';
      case 'mist':
      case 'fog':
      case 'haze':
        return 'from-gray-400/20 to-gray-600/20';
      default:
        return 'from-blue-400/20 to-blue-600/20';
    }
  };

  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };
  
  const formatTime = (timestamp: number, timezone: number) => {
    if (!timestamp || !timezone) return '';
    const date = new Date((timestamp + timezone) * 1000);
    return date.toUTCString().slice(17, 22);
  };

  const renderWeatherSkeletons = () => (
    <div className="space-y-4">
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="text-right space-y-2">
            <Skeleton className="h-10 w-20 ml-auto" />
            <Skeleton className="h-4 w-20 ml-auto" />
          </div>
        </div>
        <div className="flex mt-8 justify-center">
          <Skeleton className="h-24 w-24 rounded-full" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
        <div className="mt-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3">
          <div className="glass-panel p-4 mb-4">
            <div className="relative mb-4 flex">
              <Input
                type="text"
                placeholder="Search for a city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10"
              />
              <Button 
                size="icon" 
                variant="ghost" 
                className="absolute right-0 top-0 h-full text-gray-light hover:text-white"
                onClick={() => handleCitySearch()}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              </Button>
            </div>
            
            {usingGeolocation && weatherData && (
              <div className="text-xs text-gray-light flex items-center justify-center gap-1 mb-4">
                <MapPin className="h-3 w-3" />
                <span>Using your current location</span>
              </div>
            )}
            
            <div className="text-center">
              <p className="text-sm text-gray-light mb-2">Search for any city around the world to get real-time weather data</p>
              
              {!weatherData && !initialLoading && (
                <div className="glass-panel p-4 mt-4 text-center">
                  <Info className="h-5 w-5 mx-auto mb-2 text-purple" />
                  <p className="text-sm text-gray-light">
                    Enter a city name above to see current weather and 5-day forecast
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="w-full lg:w-2/3">
          {initialLoading ? (
            renderWeatherSkeletons()
          ) : loading && !weatherData ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-purple" />
              <span className="ml-2 text-gray-light">Loading weather data...</span>
            </div>
          ) : weatherData ? (
            <div 
              className={cn(
                "glass-panel overflow-hidden rounded-2xl p-6 bg-gradient-to-br transition-all duration-500",
                getWeatherBackground(weatherData.current.condition)
              )}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h3 className="text-2xl font-medium">
                    {weatherData.location.name}, {weatherData.location.country}
                  </h3>
                  <p className="text-gray-light flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> 
                    {weatherData.location.lat?.toFixed(2)}°, {weatherData.location.lon?.toFixed(2)}°
                  </p>
                </div>
                <div className="text-right mt-4 md:mt-0">
                  <div className="text-4xl font-light">{weatherData.current.temp}°C</div>
                  <p className="text-purple capitalize">{weatherData.current.description}</p>
                </div>
              </div>
              
              <div className="flex mt-8 justify-center">
                <div className="relative">
                  <img 
                    src={getWeatherIcon(weatherData.current.icon)} 
                    alt={weatherData.current.condition}
                    className="h-24 w-24 object-contain"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-light">
                    <Droplets className="h-4 w-4 text-purple" />
                    <span>Humidity</span>
                  </div>
                  <div className="text-lg font-medium">{weatherData.current.humidity}%</div>
                  <Progress 
                    value={weatherData.current.humidity} 
                    className="h-1 mt-2 bg-white/10" 
                  />
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-light">
                    <Wind className="h-4 w-4 text-purple" />
                    <span>Wind Speed</span>
                  </div>
                  <div className="text-lg font-medium">{weatherData.current.wind} m/s</div>
                  <Progress 
                    value={(weatherData.current.wind / 20) * 100} 
                    className="h-1 mt-2 bg-white/10" 
                  />
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-light">
                    <Eye className="h-4 w-4 text-purple" />
                    <span>Visibility</span>
                  </div>
                  <div className="text-lg font-medium">
                    {weatherData.current.visibility} km
                  </div>
                  <Progress 
                    value={(weatherData.current.visibility || 10) / 10 * 100} 
                    className="h-1 mt-2 bg-white/10" 
                  />
                </div>
                <div className="bg-white/5 p-3 rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-gray-light">
                    <ThermometerSun className="h-4 w-4 text-purple" />
                    <span>Feels Like</span>
                  </div>
                  <div className="text-lg font-medium">
                    {weatherData.current.feels_like}°C
                  </div>
                  <Progress 
                    value={((weatherData.current.feels_like || 0) + 20) / 60 * 100} 
                    className="h-1 mt-2 bg-white/10" 
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap justify-between mt-6 bg-white/5 p-3 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sunrise className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm">Sunrise: {formatTime(weatherData.current.sunrise || 0, weatherData.current.timezone || 0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sunset className="h-4 w-4 text-orange-300" />
                  <span className="text-sm">Sunset: {formatTime(weatherData.current.sunset || 0, weatherData.current.timezone || 0)}</span>
                </div>
              </div>
              
              <div className="mt-8">
                <h4 className="font-medium mb-4">5-Day Forecast</h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {weatherData.forecast.map((day, index) => (
                    <Card key={index} className="bg-white/10 border-none overflow-hidden">
                      <CardContent className="p-3 text-center">
                        <div className="text-sm font-medium mb-1">{day.day}</div>
                        <img 
                          src={getWeatherIcon(day.icon)} 
                          alt={day.condition}
                          className="w-12 h-12 mx-auto"
                        />
                        <div className="flex justify-center items-center gap-2 text-xs mt-1">
                          <div className="flex items-center">
                            <ThermometerSun className="h-3 w-3 text-orange-300 mr-1" />
                            <span>{day.temp.max}°</span>
                          </div>
                          <div className="text-gray-400">|</div>
                          <div className="flex items-center">
                            <ThermometerSnowflake className="h-3 w-3 text-blue-300 mr-1" />
                            <span>{day.temp.min}°</span>
                          </div>
                        </div>
                        <div className="text-xs mt-2 text-gray-300 capitalize">{day.condition}</div>
                        <div className="flex justify-between text-xs mt-2 text-gray-400">
                          <div className="flex items-center">
                            <Droplets className="h-3 w-3 mr-1" />
                            <span>{day.humidity}%</span>
                          </div>
                          <div className="flex items-center">
                            <Wind className="h-3 w-3 mr-1" />
                            <span>{day.wind} m/s</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
              
              <div className="mt-6 text-xs text-gray-light text-center">
                <p>Weather data provided by OpenWeather API</p>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-8 text-center">
              <Info className="h-10 w-10 mx-auto mb-4 text-purple" />
              <h3 className="text-xl font-medium mb-2">No Weather Data</h3>
              <p className="text-gray-light">
                Search for a city to see weather information, or allow location access for automatic weather updates.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpenWeatherWidget;
