import { toast } from "sonner";

const API_KEY = "880dd0d6-7487-4140-8585-787e7a357d46";
const BASE_URL = "https://airlabs.co/api/v9";

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

const cache: Record<string, { data: any; timestamp: number }> = {};
const airlineCache: AirlineCache = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const AIRLINE_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for airlines

const fetchWithCache = async (endpoint: string, params: Record<string, string> = {}): Promise<any> => {
  const queryParams = new URLSearchParams({
    api_key: API_KEY,
    ...params
  });
  
  const url = `${BASE_URL}/${endpoint}?${queryParams}`;
  const cacheKey = url;
  
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
      return fetchAirports({ limit: "20" });
    }
    
    return fetchSuggestions(searchTerm);
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
