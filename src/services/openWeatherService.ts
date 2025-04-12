
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
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Helper function to format date
const formatDay = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Helper function to process and group forecast data by day
const processForecastData = (data: OpenWeatherForecastResponse): Array<any> => {
  const dailyData: Record<string, any> = {};
  
  data.list.forEach((item) => {
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
    
    dailyData[day].temps.push(item.main.temp);
    dailyData[day].icons.push(item.weather[0].icon);
    dailyData[day].conditions.push(item.weather[0].main);
    dailyData[day].descriptions.push(item.weather[0].description);
    dailyData[day].humidity.push(item.main.humidity);
    dailyData[day].wind.push(item.wind.speed);
  });
  
  // Process daily data to get representative values
  return Object.keys(dailyData).map((day) => {
    const dayData = dailyData[day];
    
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
      conditionCounts[a] > conditionCounts[b] ? a : b
    );
    
    const mostFrequentIcon = Object.keys(iconCounts).reduce((a, b) => 
      iconCounts[a] > iconCounts[b] ? a : b
    );
    
    // Calculate min and max temperatures
    const minTemp = Math.min(...dayData.temps);
    const maxTemp = Math.max(...dayData.temps);
    
    // Calculate averages for humidity and wind
    const avgHumidity = dayData.humidity.reduce((sum: number, val: number) => sum + val, 0) / dayData.humidity.length;
    const avgWind = dayData.wind.reduce((sum: number, val: number) => sum + val, 0) / dayData.wind.length;
    
    return {
      day: formatDay(dayData.date),
      temp: {
        min: Math.round(minTemp),
        max: Math.round(maxTemp)
      },
      condition: mostFrequentCondition,
      icon: mostFrequentIcon,
      description: dayData.descriptions[dayData.conditions.indexOf(mostFrequentCondition)],
      humidity: Math.round(avgHumidity),
      wind: Number(avgWind.toFixed(1)),
      date: dayData.date
    };
  }).slice(0, 5); // Limit to 5 days
};

export async function fetchWeatherByCity(city: string): Promise<OpenWeatherData | null> {
  try {
    // Fetch current weather
    const currentWeatherResponse = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      return null;
    }
    
    const currentWeatherData: OpenWeatherResponse = await currentWeatherResponse.json();
    
    // Fetch forecast
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch forecast data'}`);
      return null;
    }
    
    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json();
    
    // Process and combine the data
    const processedData: OpenWeatherData = {
      current: {
        temp: Math.round(currentWeatherData.main.temp),
        feels_like: Math.round(currentWeatherData.main.feels_like),
        condition: currentWeatherData.weather[0].main,
        description: currentWeatherData.weather[0].description,
        humidity: currentWeatherData.main.humidity,
        wind: Number(currentWeatherData.wind.speed.toFixed(1)),
        visibility: Math.round(currentWeatherData.visibility / 1000), // Convert to km
        pressure: currentWeatherData.main.pressure,
        icon: currentWeatherData.weather[0].icon,
        sunrise: currentWeatherData.sys.sunrise,
        sunset: currentWeatherData.sys.sunset,
        timezone: currentWeatherData.timezone
      },
      location: {
        name: currentWeatherData.name,
        country: currentWeatherData.sys.country,
        lat: currentWeatherData.coord.lat,
        lon: currentWeatherData.coord.lon
      },
      forecast: processForecastData(forecastData)
    };
    
    return processedData;
    
  } catch (error) {
    console.error("Error fetching weather data:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
}

export async function fetchWeatherByCoords(lat: number, lon: number): Promise<OpenWeatherData | null> {
  try {
    // Fetch current weather by coordinates
    const currentWeatherResponse = await fetch(
      `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!currentWeatherResponse.ok) {
      const errorData = await currentWeatherResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch weather data'}`);
      return null;
    }
    
    const currentWeatherData: OpenWeatherResponse = await currentWeatherResponse.json();
    
    // Fetch forecast by coordinates
    const forecastResponse = await fetch(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    
    if (!forecastResponse.ok) {
      const errorData = await forecastResponse.json();
      toast.error(`Error: ${errorData.message || 'Could not fetch forecast data'}`);
      return null;
    }
    
    const forecastData: OpenWeatherForecastResponse = await forecastResponse.json();
    
    // Process and combine the data (same as fetchWeatherByCity)
    const processedData: OpenWeatherData = {
      current: {
        temp: Math.round(currentWeatherData.main.temp),
        feels_like: Math.round(currentWeatherData.main.feels_like),
        condition: currentWeatherData.weather[0].main,
        description: currentWeatherData.weather[0].description,
        humidity: currentWeatherData.main.humidity,
        wind: Number(currentWeatherData.wind.speed.toFixed(1)),
        visibility: Math.round(currentWeatherData.visibility / 1000),
        pressure: currentWeatherData.main.pressure,
        icon: currentWeatherData.weather[0].icon,
        sunrise: currentWeatherData.sys.sunrise,
        sunset: currentWeatherData.sys.sunset,
        timezone: currentWeatherData.timezone
      },
      location: {
        name: currentWeatherData.name,
        country: currentWeatherData.sys.country,
        lat: currentWeatherData.coord.lat,
        lon: currentWeatherData.coord.lon
      },
      forecast: processForecastData(forecastData)
    };
    
    return processedData;
    
  } catch (error) {
    console.error("Error fetching weather data by coordinates:", error);
    toast.error("Failed to fetch weather data. Please try again later.");
    return null;
  }
}
