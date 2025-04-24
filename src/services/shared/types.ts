export interface Airport {
  name: string;
  iata: string;  // Add missing properties
  icao: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  alt: number;  // Altitude
  timezone: string;
}

export interface Airline {
  name: string;
  iata: string;
  icao: string;
  callsign?: string;
  country?: string;
  active?: boolean;
}

export interface Flight {
  // Basic identification
  id?: string;
  hex?: string;
  flight_number?: string;
  flight_iata?: string;
  flight_icao?: string;
  
  // Airline information
  airline_name?: string;
  airline_iata?: string;
  airline?: Airline;
  
  // Departure information
  dep_iata?: string;
  dep_icao?: string;
  dep_name?: string;
  dep_city?: string;
  dep_country?: string;
  dep_terminal?: string;
  dep_gate?: string;
  dep_time?: string;
  dep_time_utc?: string;
  dep_estimated?: string;
  dep_actual?: string;
  dep_delayed?: number;
  
  // Arrival information
  arr_iata?: string;
  arr_icao?: string;
  arr_name?: string;
  arr_city?: string;
  arr_country?: string;
  arr_terminal?: string;
  arr_gate?: string;
  arr_time?: string;
  arr_time_utc?: string;
  arr_estimated?: string;
  arr_actual?: string;
  arr_delayed?: number;
  
  // Flight status
  status?: string;
  duration?: number;
  delayed?: number;
  delay?: number;
  
  // Aircraft information
  aircraft_icao?: string;
  reg_number?: string;
  
  // Position data
  lat?: number;
  lng?: number;
  alt?: number;
  dir?: number;
  speed?: number;
  v_speed?: number;
  squawk?: string;
}
