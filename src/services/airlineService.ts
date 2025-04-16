
import { toast } from "sonner";
import { fetchWithCache, AIRLINE_CACHE_DURATION } from "./shared/apiUtils";
import type { Airline } from "./shared/types";

interface AirlineCache {
  [key: string]: {
    name: string;
    timestamp: number;
  };
}

const airlineCache: AirlineCache = {};

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

export function getAirlineName(flight: any): string {
  if (flight.airline_name) return flight.airline_name;
  
  if (flight.airline?.name) return flight.airline.name;
  
  const iataCode = flight.airline_iata || flight.airline?.iata || "";
  if (iataCode) return `${iataCode} Airlines`;
  
  return "Airline information unavailable";
}

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
