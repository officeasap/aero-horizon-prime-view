import { toast } from "sonner";

const BASE_URL = "https://littleboy-dun.vercel.app/api";

export interface Flight {
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
  
  dep_time?: string;
  arr_time?: string;
  duration?: number;
  delayed?: number;
  dep_delayed?: number;
  arr_delayed?: number;
  aircraft_icao24?: string;
  day_of_week?: number;
  
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

interface AirlineCache {
  [key: string]: {
    name: string;
    timestamp: number;
  };
}

interface AirportCache {
  data: Airport[];
  timestamp: number;
  isComprehensive: boolean;
}

const cache: Record<string, { data: any; timestamp: number }> = {};
const airlineCache: AirlineCache = {};
const airportCache: AirportCache = {
  data: [],
  timestamp: 0,
  isComprehensive: false
};

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const AIRPORT_CACHE_DURATION = 60 * 60 * 1000; // 1 hour for airports
const AIRLINE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for airlines

const fetchWithCache = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
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

export async function fetchLiveFlights(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("flights", params);
    if (Array.isArray(data) && data.length > 0) {
      return await enhanceFlightData(data as Flight[]);
    }
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching live flights:", error);
    toast.error("Failed to fetch flight data. Please try again later.");
    return [];
  }
}

export async function fetchFlightSchedules(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("schedules", params);
    if (Array.isArray(data) && data.length > 0) {
      return await enhanceFlightData(data as Flight[]);
    }
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching flight schedules:", error);
    toast.error("Failed to fetch flight schedules. Please try again later.");
    return [];
  }
}

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

export async function fetchAirportByIATA(iataCode: string): Promise<Airport | null> {
  if (!iataCode) return null;
  
  const formattedCode = iataCode.trim().toUpperCase();
  if (formattedCode.length !== 3) {
    console.warn("Invalid IATA code format:", iataCode);
    return null;
  }
  
  try {
    console.log(`Fetching airport by IATA code: ${formattedCode}`);
    const data = await fetchWithCache("airports", { iata_code: formattedCode });
    
    if (Array.isArray(data) && data.length > 0) {
      console.log(`Found airport for IATA ${formattedCode}:`, data[0]);
      return data[0] as Airport;
    }
    
    console.log(`No airport found for IATA code: ${formattedCode}`);
    return null;
  } catch (error) {
    console.error(`Error fetching airport by IATA ${formattedCode}:`, error);
    return null;
  }
}

function filterAirports(airports: Airport[], filters: Record<string, string>): Airport[] {
  const { comprehensive, limit, ...actualFilters } = filters;
  
  if (Object.keys(actualFilters).length === 0) {
    return airports;
  }
  
  return airports.filter(airport => {
    return Object.entries(actualFilters).every(([key, value]) => {
      if (!value) return true;
      
      const airportValue = (airport as any)[key];
      if (!airportValue) return false;
      
      if (typeof airportValue === 'string') {
        if (key === 'iata_code') {
          return airportValue.toLowerCase() === value.toLowerCase();
        }
        return airportValue.toLowerCase().includes(value.toLowerCase());
      }
      
      return airportValue === value;
    });
  });
}

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

export async function fetchAirlineByIATA(iataCode: string): Promise<string> {
  if (!iataCode) return "Airline information unavailable";
  
  const cachedAirline = airlineCache[iataCode];
  if (cachedAirline && Date.now() - cachedAirline.timestamp < AIRLINE_CACHE_DURATION) {
    return cachedAirline.name;
  }
  
  try {
    const data = await fetchWithCache("airlines", { iata_code: iataCode });
    
    if (Array.isArray(data) && data.length > 0) {
      const airlineName = data[0].name || `${iataCode} Airlines`;
      
      airlineCache[iataCode] = {
        name: airlineName,
        timestamp: Date.now()
      };
      
      return airlineName;
    }
    
    return `${iataCode} Airlines`;
  } catch (error) {
    console.error(`Error fetching airline for IATA ${iataCode}:`, error);
    return `${iataCode} Airlines`;
  }
}

export function getAirlineName(flight: Flight): string {
  if (flight.airline_name) return flight.airline_name;
  
  if (flight.airline?.name) return flight.airline.name;
  
  const iataCode = flight.airline_iata || flight.airline?.iata || "";
  if (iataCode) return `${iataCode} Airlines`;
  
  return "Airline information unavailable";
}

export async function enhanceFlightData(flights: Flight[]): Promise<Flight[]> {
  if (!flights || flights.length === 0) return flights;
  
  const airlinesToFetch = flights
    .filter(flight => !flight.airline_name && (flight.airline_iata || flight.airline?.iata))
    .map(flight => flight.airline_iata || flight.airline?.iata || "")
    .filter(iata => iata && !airlineCache[iata]);
  
  const uniqueIatas = [...new Set(airlinesToFetch)];
  
  await Promise.all(
    uniqueIatas.map(iata => fetchAirlineByIATA(iata))
  );
  
  return flights.map(flight => {
    const iataCode = flight.airline_iata || flight.airline?.iata || "";
    
    if (flight.airline_name) return flight;
    
    if (iataCode && airlineCache[iataCode]) {
      return {
        ...flight,
        airline_name: airlineCache[iataCode].name
      };
    }
    
    return {
      ...flight,
      airline_name: iataCode ? `${iataCode} Airlines` : "Airline information unavailable"
    };
  });
}

export async function fetchFlightStatus(flightIata: string) {
  try {
    const data = await fetchWithCache("flight", { flight_iata: flightIata });
    if (data) {
      const iataCode = data.airline_iata || data.airline?.iata || "";
      if (!data.airline_name && iataCode) {
        const airlineName = await fetchAirlineByIATA(iataCode);
        return {
          ...data,
          airline_name: airlineName
        } as Flight;
      }
    }
    return data as Flight;
  } catch (error) {
    console.error("Error fetching flight status:", error);
    toast.error("Failed to fetch flight status. Please try again later.");
    return null;
  }
}

export async function fetchAirportsAndAirlines(searchTerm: string = "") {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      const airports = await fetchAirports({ 
        comprehensive: "true",
        limit: "100" 
      });
      
      if (airports.length === 0 && airportCache.data.length > 0) {
        return airportCache.data.slice(0, 100);
      }
      
      return airports;
    }
    
    const formattedSearch = searchTerm.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(formattedSearch)) {
      console.log(`Searching for IATA code: ${formattedSearch}`);
      const iataResults = await fetchAirports({ iata_code: formattedSearch });
      
      if (iataResults && iataResults.length > 0) {
        console.log(`Found ${iataResults.length} airports with IATA code ${formattedSearch}`);
        return iataResults;
      }
    }
    
    const suggestions = await fetchSuggestions(searchTerm);
    if (suggestions.length > 0) {
      return suggestions;
    }
    
    if (airportCache.isComprehensive) {
      const filteredAirports = airportCache.data.filter(airport => 
        (airport.name && airport.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (airport.iata_code && airport.iata_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (airport.icao_code && airport.icao_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (airport.city && airport.city.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (airport.country_code && airport.country_code.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      
      if (filteredAirports.length > 0) {
        return filteredAirports.slice(0, 100);
      }
    }
    
    return fetchAirports({ 
      name: searchTerm.trim(),
      limit: "100"
    });
  } catch (error) {
    console.error("Error fetching airports/airlines:", error);
    toast.error("Failed to fetch airport and airline data. Please try again later.");
    return [];
  }
}

export async function fetchFlights(params: Record<string, string> = {}) {
  return fetchLiveFlights(params);
}

export async function fetchFlightsByReason(reason: string) {
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
    return fetchLiveFlights({
      flight_iata: query.toUpperCase()
    });
  } else {
    return fetchLiveFlights({
      dep_iata: query.toUpperCase()
    });
  }
}

export async function fetchFlightDetails(flightId: string) {
  return fetchFlightStatus(flightId);
}

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

/**
 * Fetches a comprehensive list of global airports including those from all regions
 */
export async function fetchComprehensiveAirports(): Promise<Airport[]> {
  try {
    if (airportCache.isComprehensive && 
        Date.now() - airportCache.timestamp < AIRPORT_CACHE_DURATION) {
      return airportCache.data;
    }
    
    const params = {
      limit: "1000"
    };
    
    const data = await fetchWithCache("airports", params);
    
    if (Array.isArray(data) && data.length > 0) {
      airportCache.data = data;
      airportCache.timestamp = Date.now();
      airportCache.isComprehensive = true;
      console.log(`Cached ${data.length} airports comprehensively`);
      
      return data;
    }
    
    return data as Airport[];
  } catch (error) {
    console.error("Error fetching comprehensive airports:", error);
    toast.error("Failed to fetch global airport data. Please try again later.");
    return [];
  }
}

/**
 * Searches for airports by region, country, or other criteria
 */
export async function searchAirportsByRegion(
  region: string, 
  limit: number = 50
): Promise<Airport[]> {
  try {
    let airports: Airport[] = [];
    
    if (airportCache.isComprehensive && 
        Date.now() - airportCache.timestamp < AIRPORT_CACHE_DURATION) {
      airports = airportCache.data;
    } else {
      airports = await fetchComprehensiveAirports();
    }
    
    const filteredAirports = airports.filter(airport => {
      const countryCode = airport.country_code?.toLowerCase() || '';
      const city = airport.city?.toLowerCase() || '';
      const name = airport.name.toLowerCase();
      const regionLower = region.toLowerCase();
      
      return countryCode.includes(regionLower) || 
             city.includes(regionLower) || 
             name.includes(regionLower);
    });
    
    return filteredAirports.slice(0, limit);
  } catch (error) {
    console.error("Error searching airports by region:", error);
    toast.error("Failed to search airports by region. Please try again later.");
    return [];
  }
}

/**
 * Fetches a comprehensive list of global airlines
 */
export async function fetchComprehensiveAirlines(): Promise<Airline[]> {
  try {
    const params = {
      limit: "500"
    };
    
    const data = await fetchWithCache("airlines", params);
    return data as Airline[];
  } catch (error) {
    console.error("Error fetching comprehensive airlines:", error);
    toast.error("Failed to fetch global airline data. Please try again later.");
    return [];
  }
}

export async function fetchArrivals(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("arrivals", params);
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching arrivals:", error);
    toast.error("Failed to fetch arrival data. Please try again later.");
    return [];
  }
}

export async function fetchDepartures(params: Record<string, string> = {}) {
  try {
    const data = await fetchWithCache("departures", params);
    return data as Flight[];
  } catch (error) {
    console.error("Error fetching departures:", error);
    toast.error("Failed to fetch departure data. Please try again later.");
    return [];
  }
}
