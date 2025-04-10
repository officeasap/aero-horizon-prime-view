
import { toast } from "sonner";

// We're using the sample data for demonstration, but this would be replaced with actual API calls
// in a production environment
export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    wind: number;
    icon: any;
  };
  forecast: Array<{
    day: string;
    temp: number;
    condition: string;
    icon: any;
  }>;
}

// Sample weather data for different cities - would be replaced with API calls
const weatherData = {
  'New York': {
    current: { temp: 72, condition: 'Partly Cloudy', humidity: 65, wind: 8, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 74, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 76, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 71, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 68, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 70, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'London': {
    current: { temp: 62, condition: 'Rain', humidity: 80, wind: 12, icon: 'CloudRain' },
    forecast: [
      { day: 'Mon', temp: 60, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 59, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Wed', temp: 63, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 65, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 61, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  // Asian cities
  'Tokyo': {
    current: { temp: 81, condition: 'Sunny', humidity: 70, wind: 5, icon: 'Sun' },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 85, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 84, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 80, condition: 'Thunderstorm', icon: 'CloudLightning' },
    ]
  },
  'Jakarta': {
    current: { temp: 88, condition: 'Partly Cloudy', humidity: 75, wind: 7, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 90, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 86, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Singapore': {
    current: { temp: 87, condition: 'Thunderstorm', humidity: 85, wind: 6, icon: 'CloudLightning' },
    forecast: [
      { day: 'Mon', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Tue', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 88, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Bangkok': {
    current: { temp: 91, condition: 'Hot', humidity: 70, wind: 5, icon: 'Sun' },
    forecast: [
      { day: 'Mon', temp: 92, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 93, condition: 'Hot', icon: 'Sun' },
      { day: 'Wed', temp: 90, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Thu', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 89, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  // Added more Asian cities
  'Shanghai': {
    current: { temp: 75, condition: 'Cloudy', humidity: 68, wind: 8, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 77, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Tue', temp: 79, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 80, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 76, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 74, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Seoul': {
    current: { temp: 68, condition: 'Partly Cloudy', humidity: 62, wind: 9, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 70, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 69, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 67, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 65, condition: 'Cloudy', icon: 'Cloud' },
    ]
  },
  'Kuala Lumpur': {
    current: { temp: 86, condition: 'Thunderstorm', humidity: 80, wind: 6, icon: 'CloudLightning' },
    forecast: [
      { day: 'Mon', temp: 87, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 88, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 85, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 87, condition: 'Thunderstorm', icon: 'CloudLightning' },
    ]
  },
  'Hong Kong': {
    current: { temp: 82, condition: 'Partly Cloudy', humidity: 75, wind: 10, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 83, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Tue', temp: 81, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 79, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 80, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 82, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Manila': {
    current: { temp: 85, condition: 'Rain', humidity: 82, wind: 12, icon: 'CloudRain' },
    forecast: [
      { day: 'Mon', temp: 86, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Tue', temp: 85, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 84, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 86, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 87, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
  'Ho Chi Minh City': {
    current: { temp: 89, condition: 'Hot', humidity: 78, wind: 7, icon: 'Sun' },
    forecast: [
      { day: 'Mon', temp: 90, condition: 'Hot', icon: 'Sun' },
      { day: 'Tue', temp: 91, condition: 'Thunderstorm', icon: 'CloudLightning' },
      { day: 'Wed', temp: 88, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Thu', temp: 87, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 89, condition: 'Hot', icon: 'Sun' },
    ]
  },
  'Taipei': {
    current: { temp: 79, condition: 'Partly Cloudy', humidity: 70, wind: 8, icon: 'Cloud' },
    forecast: [
      { day: 'Mon', temp: 80, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 82, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 83, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 79, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Fri', temp: 77, condition: 'Rain', icon: 'CloudRain' },
    ]
  },
  // More global cities
  'Sydney': {
    current: { temp: 68, condition: 'Windy', humidity: 55, wind: 15, icon: 'Wind' },
    forecast: [
      { day: 'Mon', temp: 65, condition: 'Windy', icon: 'Wind' },
      { day: 'Tue', temp: 63, condition: 'Rain', icon: 'CloudRain' },
      { day: 'Wed', temp: 67, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 72, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 74, condition: 'Sunny', icon: 'Sun' },
    ]
  },
  'Moscow': {
    current: { temp: 40, condition: 'Snow', humidity: 85, wind: 10, icon: 'CloudSnow' },
    forecast: [
      { day: 'Mon', temp: 38, condition: 'Snow', icon: 'CloudSnow' },
      { day: 'Tue', temp: 36, condition: 'Snow', icon: 'CloudSnow' },
      { day: 'Wed', temp: 42, condition: 'Cloudy', icon: 'Cloud' },
      { day: 'Thu', temp: 45, condition: 'Partly Cloudy', icon: 'Cloud' },
      { day: 'Fri', temp: 41, condition: 'Snow', icon: 'CloudSnow' },
    ]
  },
  'Dubai': {
    current: { temp: 95, condition: 'Sunny', humidity: 40, wind: 7, icon: 'Sun' },
    forecast: [
      { day: 'Mon', temp: 97, condition: 'Sunny', icon: 'Sun' },
      { day: 'Tue', temp: 98, condition: 'Sunny', icon: 'Sun' },
      { day: 'Wed', temp: 96, condition: 'Sunny', icon: 'Sun' },
      { day: 'Thu', temp: 95, condition: 'Sunny', icon: 'Sun' },
      { day: 'Fri', temp: 93, condition: 'Partly Cloudy', icon: 'Cloud' },
    ]
  },
};

export async function fetchWeatherData(city: string): Promise<WeatherData | null> {
  try {
    // In a real app, this would be an API call to a weather service
    // For now, we'll use the sample data
    if (weatherData[city as keyof typeof weatherData]) {
      return weatherData[city as keyof typeof weatherData];
    }
    
    // If the city isn't in our sample data, return null
    // In a real app, this would be a call to the weather API
    toast.error(`Weather data for ${city} not available.`);
    return null;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
}

export async function searchCities(query: string) {
  try {
    // In a real app, this would be an API call to search for cities
    // For now, we'll filter our sample data
    if (!query) return Object.keys(weatherData);
    
    return Object.keys(weatherData).filter(city => 
      city.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error("Error searching cities:", error);
    toast.error("Failed to search cities. Please try again later.");
    return [];
  }
}

export async function fetchFlightWeatherConditions() {
  try {
    // In a real app, this would fetch weather data specific to flight routes
    // For now, we'll return a subset of our sample data
    const flightRouteWeather = {
      'New York to London': weatherData['London'],
      'London to Dubai': weatherData['Dubai'],
      'Tokyo to Singapore': weatherData['Singapore'],
      'Sydney to Jakarta': weatherData['Jakarta'],
      'Bangkok to Dubai': weatherData['Dubai'],
      // Adding more flight routes for Asian cities
      'Singapore to Kuala Lumpur': weatherData['Kuala Lumpur'],
      'Jakarta to Bangkok': weatherData['Bangkok'],
      'Hong Kong to Shanghai': weatherData['Shanghai'],
      'Seoul to Tokyo': weatherData['Tokyo'],
      'Manila to Taipei': weatherData['Taipei'],
      'Ho Chi Minh City to Bangkok': weatherData['Bangkok'],
    };
    
    return flightRouteWeather;
  } catch (error) {
    console.error("Error fetching flight weather conditions:", error);
    toast.error("Failed to fetch flight weather conditions. Please try again later.");
    return {};
  }
}
