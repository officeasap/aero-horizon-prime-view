
import { toast } from "sonner";

const API_KEY = "880dd0d6-7487-4140-8585-787e7a357d46";
const BASE_URL = "https://airlabs.co/api/v9";

// Updated Flight interface for AirLabs API to support both response formats
export interface Flight {
  // Common fields
  hex?: string;
  reg_number?: string;
  flag?: string;
  lat?: number;
  lng?: number;
  alt?: number;
  dir?: number;
  speed?: number;
  v_speed?: number;
  squawk?: string;
  flight_number?: string;
  flight_icao?: string;
  flight_iata?: string;
  dep_icao?: string;
  dep_iata?: string;
  arr_icao?: string;
  arr_iata?: string;
  airline_icao?: string;
  airline_iata?: string;
  aircraft_icao?: string;
  updated?: number;
  status?: string;
  
  // For scheduled flights
  dep_time?: string;
  arr_time?: string;
  duration?: number;
  delayed?: number;
  dep_delayed?: number;
  arr_delayed?: number;
  aircraft_icao24?: string;
  day_of_week?: number;
  
  // For flight details
  dep_name?: string;
  dep_city?: string;
  dep_country?: string;
  arr_name?: string;
  arr_city?: string;
  arr_country?: string;
  airline_name?: string;
  dep_terminal?: string;
  dep_gate?: string;
  arr_terminal?: string;
  arr_gate?: string;
  dep_time_utc?: string;
  arr_time_utc?: string;
  dep_actual?: string;
  arr_actual?: string;
  dep_estimated?: string;
  arr_estimated?: string;
  
  // Support for nested objects in some API responses
  flight?: {
    iata?: string;
    icao?: string;
    number?: string;
  };
  airline?: {
    name?: string;
    iata?: string;
    icao?: string;
  };
  departure?: {
    airport?: string;
    timezone?: string;
    iata?: string;
    icao?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    scheduled?: string;
    estimated?: string;
    actual?: string;
  };
  arrival?: {
    airport?: string;
    timezone?: string;
    iata?: string;
    icao?: string;
    terminal?: string;
    gate?: string;
    delay?: number;
    scheduled?: string;
    estimated?: string;
    actual?: string;
  };
  flight_date?: string;
  flight_status?: string;
}

export interface Airport {
  name: string;
  iata_code: string;
  icao_code: string;
  lat: number;
  lng: number;
  country_code: string;
  city?: string;
  city_code?: string;
  timezone?: string;
  phone?: string;
  website?: string;
  distance?: number;
}

export interface Airline {
  name: string;
  iata_code: string;
  icao_code: string;
  fleet_size?: number;
  fleet_average_age?: number;
  country_code?: string;
  country_name?: string;
  callsign?: string;
  logo?: string;
}

export interface City {
  name: string;
  city_code: string;
  lat: number;
  lng: number;
  country_code: string;
  timezone?: string;
  gmt?: string;
  phone_prefix?: string;
  population?: number;
}

export interface Country {
  code: string;
  code3: string;
  name: string;
  continent: string;
  capital: string;
  phone_prefix: string;
  currency_code: string;
  currency_name: string;
}

export interface Timezone {
  name: string;
  city_code: string;
  gmt: string;
  offset: number;
}

export interface Tax {
  name: string;
  country_code: string;
  description: string;
  tax_id: string;
}

export interface Fleet {
  hex: string;
  reg_number: string;
  flag: string;
  lat?: number;
  lng?: number;
  alt?: number;
  heading?: number;
  aircraft_icao: string;
  airline_icao?: string;
  airline_iata?: string;
  airline_name?: string;
  status?: string;
}

export interface Route {
  airline_icao: string;
  airline_iata: string;
  flight_number: string;
  flight_iata: string;
  flight_icao: string;
  dep_iata: string;
  dep_icao: string;
  arr_iata: string;
  arr_icao: string;
  cs_airline_iata?: string;
  cs_flight_number?: string;
  cs_flight_iata?: string;
}

export interface SuggestResult {
  name: string;
  city?: string;
  iata_code?: string;
  icao_code?: string;
  country_code?: string;
  type: "airport" | "city" | "airline";
}

// Cache mechanism to reduce API calls
const cache: Record<string, { data: any; timestamp: number }> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const fetchWithCache = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  // Add API key to params
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params
  });
  
  const url = `${BASE_URL}/${endpoint}?${queryParams}`;
  const cacheKey = url;
  
  // Check cache first
  const cachedData = cache[cacheKey];
  if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
    return cachedData.data;
  }
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || "Unknown API error");
    }
    
    // Store in cache
    cache[cacheKey] = {
      data: data.response,
      timestamp: Date.now()
    };
    
    return data.response;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// 1. Live Flight Tracking 
export async function fetchLiveFlights(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("flights", params);
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching live flights:", error);
    toast.error("Failed to fetch flight data. Please try again later.");
    return [];
  }
}

// 2. Flight Schedules
export async function fetchFlightSchedules(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("schedules", params);
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching flight schedules:", error);
    toast.error("Failed to fetch flight schedules. Please try again later.");
    return [];
  }
}

// 3. Airports Lookup
export async function fetchAirports(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("airports", params);
    return data as Airport[];
  } catch (error) {
    console.error("Error fetching airports:", error);
    toast.error("Failed to fetch airport data. Please try again later.");
    return [];
  }
}

// 4. Nearby Airports
export async function fetchNearbyAirports(lat: number, lng: number, distance: number = 100) {
  try {
    const data = await fetchWithCache("nearby", {
      lat: lat.toString(),
      lng: lng.toString(),
      distance: distance.toString()
    });
    return data as Airport[];
  } catch (error) {
    console.error("Error fetching nearby airports:", error);
    toast.error("Failed to fetch nearby airports. Please try again later.");
    return [];
  }
}

// 5. World Cities Database
export async function fetchCities(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("cities", params);
    return data as City[];
  } catch (error) {
    console.error("Error fetching cities:", error);
    toast.error("Failed to fetch city data. Please try again later.");
    return [];
  }
}

// 6. Airlines Search
export async function fetchAirlines(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("airlines", params);
    return data as Airline[];
  } catch (error) {
    console.error("Error fetching airlines:", error);
    toast.error("Failed to fetch airline data. Please try again later.");
    return [];
  }
}

// 7. Name Suggestion / Autocomplete
export async function fetchSuggestions(query: string) {
  try {
    if (!query || query.length < 2) return [];
    
    const data = await fetchWithCache("suggest", { q: query });
    return data as SuggestResult[];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    toast.error("Failed to fetch search suggestions. Please try again later.");
    return [];
  }
}

// 8. Aircraft Fleets Info
export async function fetchFleets(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("fleets", params);
    return data as Fleet[];
  } catch (error) {
    console.error("Error fetching fleet data:", error);
    toast.error("Failed to fetch aircraft fleet data. Please try again later.");
    return [];
  }
}

// 9. Global Routes Database
export async function fetchRoutes(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("routes", params);
    return data as Route[];
  } catch (error) {
    console.error("Error fetching routes:", error);
    toast.error("Failed to fetch route data. Please try again later.");
    return [];
  }
}

// 10. Timezones List
export async function fetchTimezones(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("timezones", params);
    return data as Timezone[];
  } catch (error) {
    console.error("Error fetching timezones:", error);
    toast.error("Failed to fetch timezone data. Please try again later.");
    return [];
  }
}

// 11. Taxes List
export async function fetchTaxes(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("taxes", params);
    return data as Tax[];
  } catch (error) {
    console.error("Error fetching taxes:", error);
    toast.error("Failed to fetch tax data. Please try again later.");
    return [];
  }
}

// 12. Countries Info
export async function fetchCountries(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("countries", params);
    return data as Country[];
  } catch (error) {
    console.error("Error fetching countries:", error);
    toast.error("Failed to fetch country data. Please try again later.");
    return [];
  }
}

// Fetch a specific flight status
export async function fetchFlightStatus(flightIata: string) {
  try {
    const data = await fetchWithCache("flight", { flight_iata: flightIata });
    return data as Flight;
  } catch (error) {
    console.error("Error fetching flight status:", error);
    toast.error("Failed to fetch flight status. Please try again later.");
    return null;
  }
}

// Search airports and airlines
export async function fetchAirportsAndAirlines(searchTerm: string = "") {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      // Get popular airports if no search term
      return fetchAirports({ limit: "20" });
    }
    
    return fetchSuggestions(searchTerm);
  } catch (error) {
    console.error("Error fetching airports/airlines:", error);
    toast.error("Failed to fetch airport and airline data. Please try again later.");
    return [];
  }
}

// Legacy compatibility functions
export async function fetchFlights(params: Record<string, string> = {}) {
  return fetchLiveFlights(params);
}

export async function fetchFlightsByReason(reason: string) {
  // Map reason to AirLabs API parameters
  const reasonMap: Record<string, string> = {
    "Weather": "weather",
    "Technical": "technical",
    "Air Traffic": "air_traffic"
  };
  
  return fetchLiveFlights({
    status: "delayed",
    delay_reason: reasonMap[reason] || ""
  });
}

export async function fetchFlightsByStatus(status: string) {
  return fetchLiveFlights({
    status: status.toLowerCase()
  });
}

export async function searchFlight(query: string) {
  if (!query) return [];
  
  if (/^[A-Z0-9]{2}\d+$/i.test(query)) {
    // Looks like a flight number
    return fetchLiveFlights({
      flight_iata: query.toUpperCase()
    });
  } else {
    // Try as airport code
    return fetchLiveFlights({
      dep_iata: query.toUpperCase()
    });
  }
}

export async function fetchFlightDetails(flightId: string) {
  return fetchFlightStatus(flightId);
}

// Get user's current position (browser geolocation API)
export async function getUserPosition(): Promise<{ lat: number; lng: number } | null> {
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
}
