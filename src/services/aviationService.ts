
import { fetchData, fetchWithCache, API_BASE_URL } from './shared/apiUtils';
import type { Flight, Airport, Airline } from './shared/types';
import { getMockFlights, mockAirport } from './mockData';

export { type Flight, type Airport, type Airline };

export interface SuggestResult {
  iata_code: string;
  icao_code: string;
  name: string;
  city: string;
  country: string;
  country_code?: string;
  type: 'airport' | 'airline';
  lat?: number;
  latitude?: number;
  lon?: number;
  longitude?: number;
  distance?: number;
}

// Get user position (for nearby airports feature)
export async function getUserPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  });
}

// Fetch airports (used in multiple components)
export async function fetchAirports(params: Record<string, string> = {}): Promise<Airport[]> {
  try {
    const response = await fetchWithCache('airports', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Airport[];
    }
    
    // Return mock data for development
    const mockAirports: Airport[] = Array(10).fill(null).map((_, index) => ({
      ...mockAirport,
      iata: `AP${index}`,
      iata_code: `AP${index}`,
      name: `Airport ${index}`,
      city: `City ${index}`,
      country_code: 'ID',
      lat: mockAirport.lat + (index * 0.1),
      latitude: mockAirport.lat + (index * 0.1),
      lon: mockAirport.lon + (index * 0.1),
      longitude: mockAirport.lon + (index * 0.1)
    }));
    
    return mockAirports;
  } catch (error) {
    console.error('Error fetching airports:', error);
    return [];
  }
}

// Fetch arrivals and departures
export async function fetchArrivalsDepartures(iataCode: string): Promise<{ arrivals: Flight[], departures: Flight[] }> {
  try {
    const params = { iata: iataCode };
    const response = await fetchWithCache(`airport/traffic/${iataCode}`, params);
    
    if (response && typeof response === 'object') {
      return response as { arrivals: Flight[], departures: Flight[] };
    }
    
    // Return mock data for development
    const mockFlights = getMockFlights(20);
    return {
      arrivals: mockFlights.slice(0, 10),
      departures: mockFlights.slice(10, 20)
    };
  } catch (error) {
    console.error(`Error fetching arrivals/departures for ${iataCode}:`, error);
    return { arrivals: [], departures: [] };
  }
}

// Fetch airport by IATA code
export async function fetchAirportByIATA(iataCode: string): Promise<Airport> {
  try {
    const response = await fetchWithCache(`airports/${iataCode}`);
    return response as Airport;
  } catch (error) {
    console.error(`Error fetching airport ${iataCode}:`, error);
    throw error;
  }
}

// Fetch nearby airports
export async function fetchNearbyAirports(lat: number, lng: number, radius: number = 100): Promise<Airport[]> {
  try {
    const params = {
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString()
    };
    
    const response = await fetchWithCache('airports/nearby', params);
    return response as Airport[];
  } catch (error) {
    console.error('Error fetching nearby airports:', error);
    throw error;
  }
}

// Fetch flight suggestions (airports/airlines)
export async function fetchSuggestions(query: string): Promise<SuggestResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetchData(`suggest?search=${encodeURIComponent(query)}`);
    return response as SuggestResult[];
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
}

// Fetch flight status
export async function fetchFlightStatus(flightNumber: string): Promise<Flight | null> {
  try {
    const response = await fetchWithCache(`flights/${flightNumber}`);
    return response as Flight;
  } catch (error) {
    console.error(`Error fetching flight status for ${flightNumber}:`, error);
    return null;
  }
}

// Fetch most tracked flights
export async function fetchMostTrackedFlights(): Promise<Flight[]> {
  try {
    const response = await fetchWithCache('flights/tracked');
    return response as Flight[];
  } catch (error) {
    console.error('Error fetching most tracked flights:', error);
    throw error;
  }
}

// Fetch nearby aircraft
export async function fetchNearbyAircraft(lat: number, lng: number, radius: number = 100): Promise<Flight[]> {
  try {
    const params = {
      lat: lat.toString(),
      lng: lng.toString(),
      radius: radius.toString()
    };
    
    const response = await fetchWithCache('flights/nearby', params);
    return response as Flight[];
  } catch (error) {
    console.error('Error fetching nearby aircraft:', error);
    throw error;
  }
}

// Fetch live flights with various filters
export async function fetchLiveFlights(params: Record<string, string> = {}): Promise<Flight[]> {
  try {
    const response = await fetchWithCache('flights/live', params);
    return response as Flight[];
  } catch (error) {
    console.error('Error fetching live flights:', error);
    throw error;
  }
}

// Fetch flights by status (landed, delayed, scheduled)
export async function fetchFlightsByStatus(status: string): Promise<Flight[]> {
  try {
    const params = { status };
    const response = await fetchWithCache('flights/status', params);
    return response as Flight[];
  } catch (error) {
    console.error(`Error fetching flights with status ${status}:`, error);
    throw error;
  }
}

// Fetch flight schedules (similar to live but can include future flights)
export async function fetchFlightSchedules(params: Record<string, string> = {}): Promise<Flight[]> {
  try {
    const response = await fetchWithCache('flights/schedules', params);
    return response as Flight[];
  } catch (error) {
    console.error('Error fetching flight schedules:', error);
    throw error;
  }
}

// Fetch airlines (alias to maintain compatibility)
export async function fetchAirlines(params: Record<string, string> = {}): Promise<Airline[]> {
  try {
    const response = await fetchWithCache('airlines', params);
    return response as Airline[];
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
}
