
import { API_BASE_URL, fetchData, fetchWithCache } from './shared/apiUtils';
import { Flight, Airport, Airline, SuggestResult } from './shared/types';
import { getMockFlights, mockAirport } from './mockData';
import { fetchMostTrackedFlights as fetchOpenSkyFlights, fetchAircraftInRange } from './flightTrackingService';
import { toast } from 'sonner';

export { type Flight, type Airport, type Airline, type SuggestResult };

// Get user position (for nearby airports feature)
export async function getUserPosition(): Promise<{lat: number, lng: number}> {
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
}

// Fetch airports (used in multiple components)
export async function fetchAirports(params: Record<string, string> = {}): Promise<Airport[]> {
  try {
    const response = await fetchWithCache('airports', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Airport[];
    }
    
    // Return mock data for development
    console.log("Using mock airport data");
    const mockAirports: Airport[] = Array(10).fill(null).map((_, index) => ({
      ...mockAirport,
      iata: `AP${index}`,
      iata_code: `AP${index}`,
      name: `Airport ${index}`,
      city: `City ${index}`,
      country: 'Indonesia',
      country_code: 'ID',
      lat: mockAirport.lat + (index * 0.1),
      latitude: mockAirport.lat + (index * 0.1),
      lon: mockAirport.lon + (index * 0.1),
      longitude: mockAirport.lon + (index * 0.1)
    }));
    
    return mockAirports;
  } catch (error) {
    console.error('Error fetching airports:', error);
    toast.error("Failed to fetch airports data");
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
    console.log("Using mock arrivals/departures data");
    const mockFlights = getMockFlights(20);
    return {
      arrivals: mockFlights.slice(0, 10),
      departures: mockFlights.slice(10, 20)
    };
  } catch (error) {
    console.error(`Error fetching arrivals/departures for ${iataCode}:`, error);
    toast.error(`Failed to fetch flight data for ${iataCode}`);
    return { arrivals: [], departures: [] };
  }
}

// Fetch airport by IATA code
export async function fetchAirportByIATA(iataCode: string): Promise<Airport> {
  try {
    const response = await fetchWithCache(`airports/${iataCode}`);
    if (response) {
      return response as Airport;
    }
    throw new Error(`Airport ${iataCode} not found`);
  } catch (error) {
    console.error(`Error fetching airport ${iataCode}:`, error);
    toast.error(`Failed to fetch information for airport ${iataCode}`);
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
    if (response && Array.isArray(response)) {
      return response as Airport[];
    }
    
    // Mock data as fallback
    return Array(5).fill(null).map((_, index) => ({
      ...mockAirport,
      iata: `AP${index}`,
      iata_code: `AP${index}`,
      name: `Nearby Airport ${index}`,
      city: `City ${index}`,
      country: 'Indonesia',
      country_code: 'ID',
      lat: lat + ((Math.random() - 0.5) * (radius / 111)),
      latitude: lat + ((Math.random() - 0.5) * (radius / 111)),
      lon: lng + ((Math.random() - 0.5) * (radius / 111) / Math.cos(lat * Math.PI / 180)),
      longitude: lng + ((Math.random() - 0.5) * (radius / 111) / Math.cos(lat * Math.PI / 180))
    }));
  } catch (error) {
    console.error('Error fetching nearby airports:', error);
    toast.error('Failed to fetch nearby airports');
    throw error;
  }
}

// Fetch flight suggestions (airports/airlines)
export async function fetchSuggestions(query: string): Promise<SuggestResult[]> {
  if (!query || query.length < 2) return [];
  
  try {
    const response = await fetchData(`suggest?search=${encodeURIComponent(query)}`);
    return Array.isArray(response) ? response as SuggestResult[] : [];
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
    toast.error(`Failed to fetch flight status for ${flightNumber}`);
    return null;
  }
}

// Fetch most tracked flights (using OpenSky API for reliability)
export async function fetchMostTrackedFlights(): Promise<Flight[]> {
  try {
    return await fetchOpenSkyFlights();
  } catch (error) {
    console.error('Error fetching most tracked flights:', error);
    toast.error('Failed to fetch flight data');
    
    // Return mock data as fallback
    return getMockFlights(20);
  }
}

// Fetch nearby aircraft
export async function fetchNearbyAircraft(lat: number, lng: number, radius: number = 100): Promise<Flight[]> {
  try {
    // Calculate bounding box based on lat, lng and radius (in km)
    // 1 degree of latitude is approximately 111 km
    const latOffset = radius / 111;
    const lngOffset = radius / (111 * Math.cos(lat * Math.PI / 180));
    
    const minLat = lat - latOffset;
    const maxLat = lat + latOffset;
    const minLng = lng - lngOffset;
    const maxLng = lng + lngOffset;
    
    return await fetchAircraftInRange(minLat, minLng, maxLat, maxLng);
  } catch (error) {
    console.error('Error fetching nearby aircraft:', error);
    toast.error('Failed to fetch nearby aircraft');
    return [];
  }
}

// Fetch live flights with various filters
export async function fetchLiveFlights(params: Record<string, string> = {}): Promise<Flight[]> {
  try {
    // Try OpenSky API first for reliability
    const flights = await fetchOpenSkyFlights();
    if (flights && flights.length > 0) {
      return flights;
    }
    
    // Fallback to our API
    const response = await fetchWithCache('flights/live', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Flight[];
    }
    
    return getMockFlights(30); // Mock data as last resort
  } catch (error) {
    console.error('Error fetching live flights:', error);
    toast.error('Failed to fetch live flight data');
    return getMockFlights(30); // Return mock data on error
  }
}

// Fetch flights by status (landed, delayed, scheduled)
export async function fetchFlightsByStatus(status: string): Promise<Flight[]> {
  try {
    const params = { status };
    const response = await fetchWithCache('flights/status', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Flight[];
    }
    return getMockFlights(15);
  } catch (error) {
    console.error(`Error fetching flights with status ${status}:`, error);
    toast.error(`Failed to fetch ${status} flights`);
    return getMockFlights(15);
  }
}

// Fetch flight schedules (similar to live but can include future flights)
export async function fetchFlightSchedules(params: Record<string, string> = {}): Promise<Flight[]> {
  try {
    const response = await fetchWithCache('flights/schedules', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Flight[];
    }
    return getMockFlights(20);
  } catch (error) {
    console.error('Error fetching flight schedules:', error);
    toast.error('Failed to fetch flight schedules');
    return getMockFlights(20);
  }
}

// Fetch airlines
export async function fetchAirlines(params: Record<string, string> = {}): Promise<Airline[]> {
  try {
    const response = await fetchWithCache('airlines', params);
    if (Array.isArray(response) && response.length > 0) {
      return response as Airline[];
    }
    
    // Mock airlines data
    return Array(10).fill(null).map((_, index) => ({
      name: `Airline ${index}`,
      iata: `AL${index}`,
      iata_code: `AL${index}`,
      icao: `ALI${index}`,
      country: 'Indonesia',
      active: true
    }));
  } catch (error) {
    console.error('Error fetching airlines:', error);
    toast.error('Failed to fetch airlines data');
    return [];
  }
}
