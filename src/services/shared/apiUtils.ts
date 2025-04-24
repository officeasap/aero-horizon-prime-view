
export const API_BASE_URL = 'https://aviation-api.example.com/v1'; // Placeholder API URL

// Cache durations in milliseconds
export const DEFAULT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
export const FLIGHT_CACHE_DURATION = 60 * 1000; // 1 minute (for time-sensitive flight data)
export const AIRPORT_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours (airports don't change often)
export const AIRLINE_CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days (airlines don't change often)

interface CacheItem {
  data: any;
  timestamp: number;
}

const apiCache: Record<string, CacheItem> = {};

// Utility to create cache keys
const getCacheKey = (endpoint: string, params?: Record<string, string>) => {
  const queryString = params ? Object.entries(params)
    .map(([key, value]) => `${key}=${value}`)
    .join('&') : '';
    
  return `${endpoint}${queryString ? `?${queryString}` : ''}`;
};

// Utility to check if cache is valid
const isCacheValid = (cacheItem: CacheItem, duration: number) => {
  return Date.now() - cacheItem.timestamp < duration;
};

// Fetch data without caching
export async function fetchData(endpoint: string, options = {}): Promise<any> {
  try {
    // Using sample data for development
    console.log(`Simulating API request to ${endpoint}`);
    
    // In a real app, this would be:
    // const response = await fetch(`${API_BASE_URL}/${endpoint}`, options);
    // const data = await response.json();
    
    // For demo, we'll just return empty arrays for most requests
    return [];
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// Fetch data with caching
export async function fetchWithCache(
  endpoint: string, 
  params?: Record<string, string>,
  cacheDuration = DEFAULT_CACHE_DURATION
): Promise<any> {
  const cacheKey = getCacheKey(endpoint, params);
  
  // Check cache first
  const cachedItem = apiCache[cacheKey];
  if (cachedItem && isCacheValid(cachedItem, cacheDuration)) {
    console.log(`Using cached data for ${cacheKey}`);
    return cachedItem.data;
  }
  
  try {
    // Fetch fresh data
    const data = await fetchData(endpoint, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    // Cache the result
    apiCache[cacheKey] = {
      data,
      timestamp: Date.now()
    };
    
    return data;
  } catch (error) {
    console.error(`Cache fetch error (${cacheKey}):`, error);
    throw error;
  }
}
