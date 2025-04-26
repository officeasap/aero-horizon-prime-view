
export interface SuggestResult {
  id: string;
  type: 'airport' | 'airline';
  name: string;
  iata_code?: string;
  icao_code?: string;
  city?: string;
  country?: string;
  country_code?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
  lat?: number;
  lon?: number;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

export interface Flight {
  flight_number: string;
  flight_iata: string;
  flight_icao: string;
  airline_name: string;
  airline_iata: string;
  airline_icao: string;
  dep_iata: string;
  dep_icao: string;
  dep_name: string;
  dep_time: string;
  dep_terminal?: string;
  dep_gate?: string;
  dep_delayed?: number;
  arr_iata: string;
  arr_icao: string;
  arr_name: string;
  arr_time: string;
  arr_terminal?: string;
  arr_gate?: string;
  arr_delayed?: number;
  status: string;
  flight_date: string;
  lat?: number;
  lng?: number;
  alt?: number;
  dir?: number;
  speed?: number;
  v_speed?: number;
  updated?: number;
}

export interface Airport {
  iata: string;
  iata_code: string;
  name: string;
  city: string;
  country: string;
  country_code: string;
  lat: number;
  lon: number;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface Airline {
  name: string;
  iata: string;
  iata_code: string;
  icao: string;
  country: string;
  active: boolean;
}

