
// Common API utilities for all services

export const API_BASE_URL = 'https://aviation-edge-api.example.com'; // Replace with actual API URL
export const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
export const AIRPORT_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
export const AIRLINE_CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Helper for geolocation
export const getUserPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
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
        console.error("Error getting user position:", error);
        reject(error);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  });
};

// Helper for general API fetching
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

// Add the missing utility functions for API fetching
export async function fetchData(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const url = `${API_BASE_URL}/${endpoint}${queryString ? `?${queryString}` : ''}`;
  
  try {
    const response = await fetchWithTimeout(url);
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching data from ${endpoint}:`, error);
    throw error;
  }
}

// Add the fetchWithCache function
export async function fetchWithCache(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  // In a real implementation, this would check a cache first
  // For now, we'll just call fetchData directly
  try {
    return await fetchData(endpoint, params);
  } catch (error) {
    console.error(`Error fetching data with cache from ${endpoint}:`, error);
    throw error;
  }
}
