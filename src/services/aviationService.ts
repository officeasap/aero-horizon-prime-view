
import { toast } from "sonner";

const API_KEY = "92b18adb94cec63f7ab7489eed154775";
const BASE_URL = "https://api.aviationstack.com/v1";

export interface Flight {
  flight_date: string;
  flight_status: string;
  departure: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  arrival: {
    airport: string;
    timezone: string;
    iata: string;
    icao: string;
    terminal: string;
    gate: string;
    baggage: string;
    delay: number;
    scheduled: string;
    estimated: string;
    actual: string;
    estimated_runway: string;
    actual_runway: string;
  };
  airline: {
    name: string;
    iata: string;
    icao: string;
  };
  flight: {
    number: string;
    iata: string;
    icao: string;
    codeshared: any;
  };
  aircraft: any;
  live: any;
}

export interface Airport {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  city: string;
  country: string;
  type: string;
}

export interface Airline {
  id: string;
  name: string;
  iata_code: string;
  icao_code: string;
  country: string;
  fleet_size: number;
  main_hub: string;
}

export async function fetchFlights(params: Record<string, string> = {}) {
  try {
    const queryParams = new URLSearchParams({
      access_key: API_KEY,
      ...params
    });
    
    const response = await fetch(`${BASE_URL}/flights?${queryParams}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.info || "Unknown API error");
    }
    
    return data.data as Flight[];
  } catch (error) {
    console.error("Error fetching flights:", error);
    toast.error("Failed to fetch flight data. Please try again later.");
    return [];
  }
}

export async function fetchFlightsByReason(reason: string) {
  const reasonMap: Record<string, string> = {
    "Weather": "weather",
    "Technical": "technical",
    "Air Traffic": "air_traffic"
  };
  
  return fetchFlights({
    flight_status: "delayed",
    delay_type: reasonMap[reason] || ""
  });
}

export async function fetchFlightsByStatus(status: string) {
  return fetchFlights({
    flight_status: status.toLowerCase()
  });
}

export async function searchFlight(query: string) {
  if (!query) return [];
  
  return fetchFlights({
    flight_iata: query
  });
}

export async function fetchAirportsAndAirlines(searchTerm: string = "") {
  try {
    // For a real API, we would use the search term to filter results
    // Since the Aviation Stack API doesn't directly support airport/airline lookup
    // in the free tier, we're mocking this functionality
    
    // In a production app, you would modify this to use the correct endpoint and parameters
    const response = await fetch(`${BASE_URL}/airports?access_key=${API_KEY}`);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filter results based on search term if provided
    const filteredResults = searchTerm 
      ? data.data.filter((item: any) => 
          item.airport_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.iata_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.city?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : data.data;
    
    return filteredResults;
  } catch (error) {
    console.error("Error fetching airports/airlines:", error);
    toast.error("Failed to fetch airport and airline data. Please try again later.");
    return [];
  }
}

export async function fetchFlightDetails(flightId: string) {
  return fetchFlights({
    flight_iata: flightId
  });
}
