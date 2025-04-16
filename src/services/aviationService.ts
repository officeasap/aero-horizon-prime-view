// Re-export everything from individual service files
export * from './shared/types';
export * from './airportService';
export * from './airlineService';
export * from './flightService';
export * from './searchService';
export * from './shared/apiUtils';

// Import Flight type for proper typing
import { Flight } from './shared/types';

export interface FR24FlightData {
  id: string;
  detail: {
    callsign: string;
    airline: {
      name: string;
      code: string;
    };
    aircraft: {
      model: string;
      registration: string;
    };
    departure: {
      name: string;
      code: string;
    };
    arrival: {
      name: string;
      code: string;
    };
    status: string;
    position: {
      latitude: number;
      longitude: number;
      altitude: number;
      heading: number;
      groundspeed: number;
    };
  };
}

export interface FR24Response {
  data: FR24FlightData[];
}

export async function fetchMostTrackedFlights(): Promise<Flight[]> {
  try {
    const url = 'https://flightradar243.p.rapidapi.com/v1/flights/most-tracked';
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f4e8980dcbmsh08413d11c126496p1819c9jsnd8bb6a7f4b9d',
        'X-RapidAPI-Host': 'flightradar243.p.rapidapi.com'
      }
    };

    console.log('Fetching most tracked flights data');
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as FR24Response;
    
    // Format the data to match our Flight interface
    const formattedData: Flight[] = data.data.map(flight => ({
      flight_icao: flight.detail.callsign,
      flight_iata: flight.detail.callsign,
      lat: flight.detail.position.latitude,
      lng: flight.detail.position.longitude,
      alt: flight.detail.position.altitude,
      dir: flight.detail.position.heading,
      speed: flight.detail.position.groundspeed,
      reg_number: flight.detail.aircraft.registration,
      aircraft_icao: flight.detail.aircraft.model,
      status: flight.detail.status || 'en-route',
      airline_name: flight.detail.airline.name,
      dep_iata: flight.detail.departure.code,
      dep_name: flight.detail.departure.name,
      arr_iata: flight.detail.arrival.code,
      arr_name: flight.detail.arrival.name,
    }));
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching most tracked flights:", error);
    throw error;
  }
}

export interface AircraftData {
  hex: string;
  type: string;
  flight: string;
  r: string;
  t: string;
  alt_baro: number;
  alt_geom: number;
  gs: number;
  ias: number;
  tas: number;
  mach: number;
  wd: number;
  ws: number;
  oat: number;
  tat: number;
  track: number;
  track_rate: number;
  roll: number;
  mag_heading: number;
  true_heading: number;
  baro_rate: number;
  geom_rate: number;
  squawk: string;
  emergency: string;
  category: string;
  nav_qnh: number;
  nav_altitude_mcp: number;
  nav_altitude_fms: number;
  nav_heading: number;
  nav_modes: string[];
  lat: number;
  lon: number;
  nic: number;
  rc: number;
  seen_pos: number;
  version: number;
  nic_baro: number;
  nac_p: number;
  nac_v: number;
  sil: number;
  sil_type: string;
  gva: number;
  sda: number;
  mlat: string[];
  tisb: string[];
  messages: number;
  seen: number;
  rssi: number;
  dst: number;
  dir: number;
}

export interface AircraftDetailData {
  now: number;
  aircraft: AircraftData[];
}

export interface AircraftRawData {
  aircraft: AircraftData[];
}

export async function fetchAircraftInRange(lat: number, lon: number, dist: number) {
  try {
    // Use the correct API endpoint for range-based search
    const url = `https://aircraft-adsb-data.p.rapidapi.com/aircrafts_within_range/?lon=${lon}&lat=${lat}&range_km=${dist}`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f4e8980dcbmsh08413d11c126496p1819c9jsnd8bb6a7f4b9d',
        'X-RapidAPI-Host': 'aircraft-adsb-data.p.rapidapi.com'
      }
    };

    console.log('Fetching aircraft data from:', url);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as AircraftRawData;
    
    // Format the data to match our Flight interface as closely as possible
    const formattedData: Flight[] = data.aircraft.map(aircraft => ({
      hex: aircraft.hex,
      flight_icao: aircraft.flight ? aircraft.flight.trim() : undefined,
      flight_iata: aircraft.flight ? aircraft.flight.trim() : undefined,
      lat: aircraft.lat,
      lng: aircraft.lon,
      alt: aircraft.alt_baro,
      dir: aircraft.track || aircraft.true_heading || aircraft.mag_heading,
      speed: aircraft.gs, // ground speed
      squawk: aircraft.squawk,
      reg_number: aircraft.r,
      aircraft_icao: aircraft.type,
      status: 'en-route',
      airline_name: aircraft.t || 'Unknown',
    }));
    
    return formattedData;
  } catch (error) {
    console.error("Error fetching aircraft data:", error);
    throw error;
  }
}

export async function fetchAircraftDetails(hex: string) {
  try {
    const url = `https://aircraft-adsb-data.p.rapidapi.com/adsb_data/hex/${hex}`;
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'f4e8980dcbmsh08413d11c126496p1819c9jsnd8bb6a7f4b9d',
        'X-RapidAPI-Host': 'aircraft-adsb-data.p.rapidapi.com'
      }
    };

    console.log('Fetching aircraft details for:', hex);
    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json() as AircraftDetailData;
    
    if (data.aircraft && data.aircraft.length > 0) {
      const aircraft = data.aircraft[0];
      
      // Format the detailed data to match our Flight interface
      const formattedData: Flight = {
        hex: aircraft.hex,
        flight_icao: aircraft.flight ? aircraft.flight.trim() : undefined,
        flight_iata: aircraft.flight ? aircraft.flight.trim() : undefined,
        lat: aircraft.lat,
        lng: aircraft.lon,
        alt: aircraft.alt_baro,
        dir: aircraft.track || aircraft.true_heading || aircraft.mag_heading,
        speed: aircraft.gs, // ground speed
        v_speed: aircraft.baro_rate || aircraft.geom_rate,
        squawk: aircraft.squawk,
        reg_number: aircraft.r,
        aircraft_icao: aircraft.type,
        status: 'en-route',
        airline_name: aircraft.t || 'Unknown',
      };
      
      return formattedData;
    }
    
    throw new Error("No aircraft details found");
  } catch (error) {
    console.error("Error fetching aircraft details:", error);
    throw error;
  }
}
