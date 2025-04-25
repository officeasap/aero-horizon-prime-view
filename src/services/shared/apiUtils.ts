
// API utilities for making requests with caching

// API base URL - using either the real API or a mock API endpoint
export const API_BASE_URL = 'https://aviation-edge.com/v2/public';

// Cache durations (in milliseconds)
export const AIRPORT_CACHE_DURATION = 3600000; // 1 hour
export const AIRLINE_CACHE_DURATION = 3600000; // 1 hour
export const FLIGHT_CACHE_DURATION = 60000; // 1 minute
export const WEATHER_CACHE_DURATION = 1800000; // 30 minutes

// Interface for cached item
interface CachedItem<T> {
  data: T;
  timestamp: number;
}

// In-memory cache
const cache: Record<string, CachedItem<unknown>> = {};

// Helper to generate cache keys
const getCacheKey = (endpoint: string, params?: Record<string, string>): string => {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }
  const queryString = Object.entries(params)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return `${endpoint}?${queryString}`;
};

// Get cache TTL based on endpoint type
const getCacheTtl = (endpoint: string): number => {
  if (endpoint.includes('airports')) return AIRPORT_CACHE_DURATION;
  if (endpoint.includes('airlines')) return AIRLINE_CACHE_DURATION;
  if (endpoint.includes('flights')) return FLIGHT_CACHE_DURATION;
  if (endpoint.includes('weather')) return WEATHER_CACHE_DURATION;
  return 300000; // 5 minutes default
};

// Basic fetch function without caching
export const fetchData = async (endpoint: string, params?: Record<string, string>): Promise<unknown> => {
  try {
    const url = new URL(endpoint, API_BASE_URL);
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    
    // Add API key if using real API
    // url.searchParams.append('key', 'your-api-key');
    
    console.log(`Fetching data from: ${url.toString()}`);
    
    const response = await fetch(url.toString());
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
};

// Fetch with caching
export const fetchWithCache = async (endpoint: string, params?: Record<string, string>): Promise<unknown> => {
  try {
    const cacheKey = getCacheKey(endpoint, params);
    const now = Date.now();
    const cachedItem = cache[cacheKey];
    
    // Check if we have a valid cached item
    if (cachedItem && now - cachedItem.timestamp < getCacheTtl(endpoint)) {
      console.log(`Using cached data for ${cacheKey}`);
      return cachedItem.data;
    }
    
    // No valid cache, fetch fresh data
    const data = await fetchData(endpoint, params);
    
    // Store in cache
    cache[cacheKey] = {
      data,
      timestamp: now
    };
    
    return data;
  } catch (error) {
    console.error(`Error in fetchWithCache for ${endpoint}:`, error);
    throw error;
  }
};

// Helper to get user position
export const getUserPosition = (): Promise<{lat: number; lng: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
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
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
};

// Clear cache
export const clearCache = (endpoint?: string): void => {
  if (endpoint) {
    Object.keys(cache).forEach(key => {
      if (key.startsWith(endpoint)) {
        delete cache[key];
      }
    });
  } else {
    Object.keys(cache).forEach(key => {
      delete cache[key];
    });
  }
};
