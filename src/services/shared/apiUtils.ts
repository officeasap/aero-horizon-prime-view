
import { toast } from "sonner";

export const BASE_URL = "https://littleboy-dun.vercel.app/api";

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const AIRPORT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour
export const AIRLINE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheItem> = {};

export const fetchWithCache = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  const queryString = new URLSearchParams(params).toString();
  const url = `${BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  const cacheKey = url;
  
  const cachedData = cache[cacheKey];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    console.log(`Fetching from API: ${url}`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`API Response for ${endpoint}:`, data);
    
    if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    }
    
    cache[cacheKey] = {
      data: data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

export const getUserPosition = (): Promise<{ lat: number; lng: number } | null> => {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        toast.error("Unable to retrieve your location. Please try entering it manually.");
        resolve(null);
      },
      { timeout: 10000 }
    );
  });
};
