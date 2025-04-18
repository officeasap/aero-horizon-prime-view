// Re-export everything from individual service files
export * from './shared/types';
export * from './airportService';
export * from './airlineService';
export * from './flightService';
export * from './searchService';
export * from './shared/apiUtils';

// Import Flight type for proper typing
import { Flight } from './shared/types';

// Define the OpenSky API response structure
export interface OpenSkyState {
  icao24: string;           // ICAO24 aircraft address
  callsign: string;         // Callsign
  origin_country: string;   // Country of origin
  time_position: number;    // Unix timestamp for last position update
  last_contact: number;     // Unix timestamp for last update
  longitude: number;        // WGS-84 longitude in decimal degrees
  latitude: number;         // WGS-84 latitude in decimal degrees
  baro_altitude: number;    // Barometric altitude in meters
  on_ground: boolean;       // Indicates if aircraft is on ground
  velocity: number;         // Velocity in m/s
  true_track: number;       // True track in decimal degrees (0-359)
  vertical_rate: number;    // Vertical rate in m/s
  sensors: number[];        // IDs of sensors which received messages from this aircraft
  geo_altitude: number;     // Geometric altitude in meters
  squawk: string;           // Transponder code
  spi: boolean;             // Special purpose indicator
  position_source: number;  // Source of position data (0=ADS-B, 1=ASTERIX, 2=MLAT, 3=FLARM)
}

export interface OpenSkyResponse {
  time: number;
  states: (string | number | boolean | string[] | number[])[][];
}

/**
 * Fetch most tracked flights from OpenSky Network API
 */
export async function fetchMostTrackedFlights(): Promise<Flight[]> {
  try {
    const url = 'https://opensky-network.org/api/states/all';
    
    console.log('Fetching flights from OpenSky Network API');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as OpenSkyResponse;
    
    // Check if the API returned data
    if (!data.states || data.states.length === 0) {
      console.warn('API returned empty data');
      return [];
    }
    
    // Convert OpenSky states to Flight objects
    const formattedData: Flight[] = data.states
      .filter(state => state[1] && state[2] && state[5] && state[6]) // Filter out entries with missing essential data
      .map(state => {
        // Extract values from state array
        const icao24 = state[0] as string;
        const callsign = state[1] as string;
        const originCountry = state[2] as string;
        const longitude = state[5] as number;
        const latitude = state[6] as number;
        const altitude = state[7] as number;
        const velocity = state[9] as number;
        const heading = state[10] as number;
        const verticalRate = state[11] as number;
        const onGround = state[8] as boolean;
        const squawk = state[14] as string;
        
        return {
          hex: icao24,
          flight_icao: callsign.trim(),
          flight_iata: callsign.trim(),
          lat: latitude,
          lng: longitude,
          alt: altitude, // Convert meters to feet
          dir: heading,
          speed: velocity ? velocity * 1.94384 : undefined, // Convert m/s to knots
          v_speed: verticalRate,
          squawk: squawk,
          status: onGround ? 'on-ground' : 'en-route',
          airline_name: `${originCountry} operator`,
          reg_number: icao24,
          aircraft_icao: 'Unknown',
          dep_name: 'Unknown',
          dep_iata: 'N/A',
          arr_name: 'Unknown',
          arr_iata: 'N/A',
          dep_country: originCountry,
        };
      });
    
    // Sort by altitude descending to show high-flying aircraft first
    return formattedData.sort((a, b) => 
      (b.alt || 0) - (a.alt || 0)
    ).slice(0, 100); // Limit to 100 aircraft to improve performance
  } catch (error) {
    console.error("Error fetching flights from OpenSky:", error);
    throw error;
  }
}

/**
 * Fetch aircraft in a specific region using boundary box
 */
export async function fetchAircraftInRange(
  lamin: number, // lower bound for latitude
  lomin: number, // lower bound for longitude
  lamax: number, // upper bound for latitude
  lomax: number  // upper bound for longitude
): Promise<Flight[]> {
  try {
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;
    
    console.log('Fetching aircraft in range from OpenSky Network API');
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as OpenSkyResponse;
    
    if (!data.states || data.states.length === 0) {
      console.warn('No aircraft found in specified region');
      return [];
    }
    
    // Convert OpenSky states to Flight objects
    const formattedData: Flight[] = data.states
      .filter(state => state[1] && state[2] && state[5] && state[6])
      .map(state => {
        const icao24 = state[0] as string;
        const callsign = state[1] as string;
        const originCountry = state[2] as string;
        const longitude = state[5] as number;
        const latitude = state[6] as number;
        const altitude = state[7] as number;
        const velocity = state[9] as number;
        const heading = state[10] as number;
        const verticalRate = state[11] as number;
        const onGround = state[8] as boolean;
        const squawk = state[14] as string;
        
        return {
          hex: icao24,
          flight_icao: callsign.trim(),
          flight_iata: callsign.trim(),
          lat: latitude,
          lng: longitude,
          alt: altitude,
          dir: heading,
          speed: velocity ? velocity * 1.94384 : undefined, // Convert m/s to knots
          v_speed: verticalRate,
          squawk: squawk,
          status: onGround ? 'on-ground' : 'en-route',
          airline_name: `${originCountry} operator`,
          reg_number: icao24,
          aircraft_icao: 'Unknown',
          dep_country: originCountry,
        };
      });
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching aircraft in range:", error);
    throw error;
  }
}

/**
 * Get user's location and aircraft within a radius
 */
export async function fetchNearbyAircraft(): Promise<Flight[]> {
  try {
    // Get user position
    const position = await getUserPosition();
    
    // Define bounding box around user (approximately 200km)
    const lat = position.lat;
    const lng = position.lng;
    const latOffset = 1.8; // ~200km in latitude
    const lngOffset = 1.8 / Math.cos(lat * (Math.PI / 180)); // Adjust for longitude
    
    // Fetch aircraft within the bounding box
    return fetchAircraftInRange(
      lat - latOffset, // lamin
      lng - lngOffset, // lomin
      lat + latOffset, // lamax
      lng + lngOffset  // lomax
    );
  } catch (error) {
    console.error("Error fetching nearby aircraft:", error);
    throw error;
  }
}

// Import getUserPosition from apiUtils
import { getUserPosition } from './shared/apiUtils';

/**
 * Fetch arrivals or departures for a specific airport
 */
export async function fetchArrivalsDepartures(type: 'arrivals' | 'departures', params: Record<string, string> = {}): Promise<any[]> {
  try {
    // In a real implementation, we would call an actual API
    // For now, we'll return mock data
    console.log(`Fetching ${type} with params:`, params);
    
    // Sleep for 1 second to simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data
    return [
      {
        flight_number: 'GA422',
        airline: { name: 'Garuda Indonesia' },
        arrival: {
          airport: 'Jakarta (CGK)',
          scheduled: '09:45',
          gate: 'D7'
        },
        departure: {
          airport: 'Singapore (SIN)',
          scheduled: '08:30',
          gate: 'C5'
        },
        status: 'on-time'
      },
      {
        flight_number: 'SQ956',
        airline: { name: 'Singapore Airlines' },
        arrival: {
          airport: 'Jakarta (CGK)',
          scheduled: '10:15',
          gate: 'D2'
        },
        departure: {
          airport: 'Singapore (SIN)',
          scheduled: '09:00',
          gate: 'B8'
        },
        status: 'delayed'
      },
      {
        flight_number: 'MH711',
        airline: { name: 'Malaysia Airlines' },
        arrival: {
          airport: 'Jakarta (CGK)',
          scheduled: '10:30',
          gate: 'C8'
        },
        departure: {
          airport: 'Kuala Lumpur (KUL)',
          scheduled: '09:15',
          gate: 'A4'
        },
        status: 'boarding'
      }
    ];
  } catch (error) {
    console.error("Error fetching flight data:", error);
    throw error;
  }
}

// Import fetchFromAviationStack from aviationStackService
import { fetchFromAviationStack } from './aviationStackService';
import type { Airport, Airline } from './shared/types';
import { toast } from 'sonner';

/**
 * Fetch airports from AviationStack API
 */
export async function fetchAirports(params: Record<string, string> = {}) {
  try {
    // Ensure we request comprehensive data by default
    const queryParams = {
      ...params,
      comprehensive: "true",
      limit: params.limit || "100" // Default to 100 results
    };

    const response = await fetchFromAviationStack('airports', queryParams);
    
    if (response.data && Array.isArray(response.data)) {
      // Transform the data to match our internal Airport type
      return response.data.map(airport => ({
        id: airport.iata_code || String(Math.random()),
        name: airport.airport_name,
        city: airport.city_iata_code || '',
        country: airport.country_name || '',
        iata: airport.iata_code || '',
        icao: airport.icao_code || '',
        lat: airport.latitude,
        lon: airport.longitude,
        alt: 0, // Default since AviationStack doesn't provide this
        timezone: airport.timezone || '',
        iata_code: airport.iata_code,
        icao_code: airport.icao_code,
        country_code: airport.country_iso2
      })) as Airport[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching airports:", error);
    toast.error("Failed to fetch airport data. Please try again later.");
    return [];
  }
}

/**
 * Fetch airlines from AviationStack API
 */
export async function fetchAirlines(params: Record<string, string> = {}) {
  try {
    const queryParams = {
      ...params,
      comprehensive: "true",
      limit: params.limit || "100" // Default to 100 results
    };

    const response = await fetchFromAviationStack('airlines', queryParams);
    
    if (response.data && Array.isArray(response.data)) {
      // Transform the data to match our internal Airline type
      return response.data.map(airline => ({
        name: airline.airline_name,
        iata_code: airline.airline_iata || '',
        icao_code: airline.airline_icao || '',
        fleet_size: airline.fleet_size,
        fleet_average_age: airline.fleet_average_age,
        country_code: airline.airline_country,
        country_name: airline.airline_country,
        callsign: airline.airline_callsign
      })) as Airline[];
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching airlines:", error);
    toast.error("Failed to fetch airline data. Please try again later.");
    return [];
  }
}
