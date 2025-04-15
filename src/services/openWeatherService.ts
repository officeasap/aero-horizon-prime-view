import { toast } from "sonner";

export interface OpenWeatherData {
  current: {
    temp: number;
    feels_like?: number;
    condition: string;
    humidity: number;
    wind: number;
    visibility?: number;
    pressure?: number;
    icon: string;
    description?: string;
    sunrise?: number;
    sunset?: number;
    timezone?: number;
  };
  location: {
    name: string;
    country: string;
    lat?: number;
    lon?: number;
  };
  forecast: Array<{
    day: string;
    temp: {
      min: number;
      max: number;
    };
    condition: string;
    icon: string;
    description?: string;
    humidity?: number;
    wind?: number;
    date: number;
  }>;
}

interface OpenWeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
  visibility: number;
  sys: {
    country: string;
    sunrise: number;
    sunset: number;
  };
  name: string;
  timezone: number;
  coord: {
    lat: number;
    lon: number;
  };
}

interface OpenWeatherForecastResponse {
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      humidity: number;
    };
    weather: Array<{
      main: string;
      description: string;
      icon: string;
    }>;
    wind: {
      speed: number;
    };
    dt_txt: string;
  }>;
  city: {
    name: string;
    country: string;
    coord: {
      lat: number;
      lon: number;
    };
  };
}

const API_KEY = '29b3dbc621f5043b1410072eac8431da';
const BASE_URL = 'https://littleboy-dun.vercel.app/api';

// Helper function to format date
const formatDay = (timestamp: number): string => {
  try {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "N/A";
  }
};

// Helper function to validate API response
const isValidResponse = (data: any): boolean => {
  if (!data) return false;
  
  // For current weather
  if ('main' in data && 'weather' in data && Array.isArray(data.weather) && data.weather.length > 0) {
    return true;
  }
  
  // For forecast
  if ('list' in data && Array.isArray(data.list) && data.list.length > 0) {
    return true;
  }
  
  return false;
};

// Helper function to process and group forecast data by day
const processForecastData = (data: OpenWeatherForecastResponse): Array<any> => {
  if (!data.list || !Array.isArray(data.list) || data.list.length === 0) {
    console.error("Invalid forecast data received:", data);
    return [];
  }
  
  try {
    const dailyData: Record<string, any> = {};
    
    data.list.forEach((item) => {
      if (!item.dt) return;
      
      const date = new Date(item.dt * 1000);
      const day = date.toISOString().split('T')[0];
      
      if (!dailyData[day]) {
        dailyData[day] = {
          temps: [],
          icons: [],
          conditions: [],
          descriptions: [],
          humidity: [],
          wind: [],
          date: item.dt,
        };
      }
      
      if (item.main) {
        dailyData[day].temps.push(item.main.temp);
        dailyData[day].humidity.push(item.main.humidity);
      }
      
      if (item.weather && item.weather[0]) {
        dailyData[day].icons.push(item.weather[0].icon);
        dailyData[day].conditions.push(item.weather[0].main);
        dailyData[day].descriptions.push(item.weather[0].description);
      }
      
      if (item.wind) {
        dailyData[day].wind.push(item.wind.speed);
      }
    });
    
    // Process daily data to get representative values
    return Object.keys(dailyData).map((day) => {
      const dayData = dailyData[day];
      
      if (!dayData.conditions.length || !dayData.icons.length || !dayData.temps.length) {
        return {
          day: formatDay(dayData.date),
          temp: {
            min: 0,
            max: 0
          },
          condition: "Unknown",
          icon: "01d", // default icon
          date: dayData.date
        };
      }
      
      // Get the most frequent condition and icon
      const conditionCounts: Record<string, number> = {};
      const iconCounts: Record<string, number> = {};
      
      dayData.conditions.forEach((condition: string) => {
        conditionCounts[condition] = (conditionCounts[condition] || 0) + 1;
      });
      
      dayData.icons.forEach((icon: string) => {
        iconCounts[icon] = (iconCounts[icon] || 0) + 1;
      });
      
      const mostFrequentCondition = Object.keys(conditionCounts).reduce((a, b) => 
        conditionCounts[a] > conditionCounts[b] ? a : b, dayData.conditions[0]
      );
      
      const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => 
        iconCounts[a] > iconCounts[b] ? a : b, dayData.icons[0]
      );
      
      // Calculate min and max temperatures
      const minTemp = Math.min(...dayData.temps);
      const maxTemp = Math.max(...dayData.temps);
      
      // Calculate averages for humidity and wind
      const avgHumidity = dayData.humidity.length > 0 
        ? dayData.humidity.reduce((sum: number, val: number) => sum + val, 0) / dayData.humidity.length
        : 0;
        
      const avgWind = dayData.wind.length > 0
        ? dayData.wind.reduce((sum: number, val: number) => sum + val, 0) / dayData.wind.length
        : 0;
      
      return {
        day: formatDay(dayData.date),
        temp: {
          min: Math.round(minTemp),
          max: Math.round(maxTemp)
        },
        condition: mostFrequentCondition,
        icon: mostFrequentIcon,
        description: dayData.descriptions[dayData.conditions.indexOf(mostFrequentCondition)] || "Unknown",
        humidity: Math.round(avgHumidity),
        wind: Number(avgWind.toFixed(1)),
        date: dayData.date
      };
    }).slice(0, 5); // Limit to 5 days
  } catch (error) {
    console.error("Error processing forecast data:", error);
    return [];
  }
};

export async function fetchWeatherByCity(city: string): Promise<OpenWeatherData | null> {
  if (!city || city.trim() === '') {
    toast.error('Please enter a valid city name');
    return null;
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?city=${encodeURIComponent(city)}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    const data = await response.json();
    return data as OpenWeatherData;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherData | null> {
  if (isNaN(lat) || isNaN(lon)) {
    toast.error('Invalid coordinates provided');
    return null;
  }
  
  try {
    const response = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      throw new Error(errorData.message || 'Failed to fetch weather data');
    }
    
    const data = await response.json();
    return data as OpenWeatherData;
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    return null;
  }
}
