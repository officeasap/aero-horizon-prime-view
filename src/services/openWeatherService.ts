
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

const BASE_URL = 'https://littleboy-dun.vercel.app/api';

export async function fetchWeatherByCity(city: string): Promise<OpenWeatherData | null> {
  if (!city || city.trim() === '') {
    toast.error('Please enter a valid city name');
    return null;
  }
  
  try {
    console.log(`Fetching weather data for city: ${city} from ${BASE_URL}/weather`);
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
    console.log(`Fetching weather data for coordinates: ${lat},${lon} from ${BASE_URL}/weather`);
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
