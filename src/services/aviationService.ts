
// Re-export specific types using 'export type' for TypeScript isolatedModules compatibility
export type { 
  Airport,
  Airline,
  Flight,
  Route,
  SuggestResult
} from './shared/types';

// Basic FlightStatus type definition
export type FlightStatus = 'scheduled' | 'active' | 'landed' | 'delayed' | 'cancelled' | 'incident' | 'diverted' | 'unknown';

// Flight tracking result interface
export interface FlightTrackingResult {
  flights: Flight[];
  pagination?: {
    limit: number;
    offset: number;
    count: number;
    total: number;
  };
}

// Search result interface
export interface SearchResult {
  results: Array<Airport | Airline>;
  type: 'airport' | 'airline' | 'city';
}

// Re-export everything from modules
export * from './airportService';
export * from './airlineService';
export * from './flightTrackingService';
export * from './searchService';
export * from './shared/apiUtils';
export * from './flightService';

// Export the missing getUserPosition from airportService
export const getUserPosition = (): Promise<{ lat: number; lng: number }> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
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

// Stub for the missing fetchArrivalsDepartures function
export const fetchArrivalsDepartures = async (type: 'arrivals' | 'departures', params: Record<string, string>) => {
  console.log(`Fetching ${type} with params:`, params);
  // In a real app, this would make an API call
  // For now, return mock data
  return [];
};
