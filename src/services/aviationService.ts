
import { v4 as uuidv4 } from 'uuid';

// Define shared types
export interface Airport {
  name: string;
  iata_code?: string;
  icao_code?: string;
  city?: string;
  country_code?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  region?: string;
}

export interface Airline {
  name: string;
  iata_code?: string;
  icao_code?: string;
  country_code?: string;
}

export interface Flight {
  flight_number: string;
  dep_iata?: string;
  arr_iata?: string;
  status?: string;
  delay?: number;
  scheduled_arrival?: string;
  scheduled_departure?: string;
  airline?: {
    name: string;
  };
  departure?: {
    airport: string;
    scheduled: string;
    gate?: string;
  };
  arrival?: {
    airport: string;
    scheduled: string;
    gate?: string;
  };
}

export interface SuggestResult {
  name: string;
  city?: string;
  iata_code?: string;
  icao_code?: string;
  country_code?: string;
  type: 'airport' | 'city' | 'airline';
  lat?: number;
  lon?: number;
}

// Mock API calls
export const fetchAirportByIATA = async (iataCode: string): Promise<Airport | null> => {
  console.log(`Fetching airport by IATA code: ${iataCode}`);
  
  // Mock CGK airport data
  return {
    name: "Soekarno–Hatta International Airport",
    iata_code: iataCode.toUpperCase(),
    icao_code: "WIII",
    city: "Jakarta",
    country_code: "ID",
    lat: -6.1256,
    lon: 106.6558,
    timezone: "Asia/Jakarta",
    region: "Asia"
  };
};

export const fetchNearbyAirports = async (latitude: number, longitude: number, radius: number): Promise<Airport[]> => {
  console.log(`Fetching airports near lat=${latitude}, lng=${longitude} with radius=${radius}km`);
  
  // Mock nearby airports with CGK as the center
  const airports: Airport[] = [];
  
  // Always include CGK as the main airport
  airports.push({
    name: "Soekarno–Hatta International Airport",
    iata_code: "CGK",
    icao_code: "WIII",
    city: "Jakarta",
    country_code: "ID",
    lat: -6.1256,
    lon: 106.6558,
    timezone: "Asia/Jakarta"
  });
  
  // Generate a few more nearby airports
  for (let i = 1; i <= 5; i++) {
    airports.push({
      name: `Jakarta Airport ${i}`,
      iata_code: `JKT${i}`,
      icao_code: `WII${i}`,
      city: "Jakarta",
      country_code: "ID",
      lat: -6.1256 + (Math.random() - 0.5) * 0.2,
      lon: 106.6558 + (Math.random() - 0.5) * 0.2,
      timezone: "Asia/Jakarta"
    });
  }
  
  return airports;
};

export const fetchAirports = async (params: Record<string, string> = {}): Promise<Airport[]> => {
  console.log('Fetching airports with params:', params);
  
  // Generate mock airports with CGK as the main one
  const mockAirports: Airport[] = [];
  
  // Main CGK airport
  mockAirports.push({
    name: "Soekarno–Hatta International Airport",
    iata_code: "CGK",
    icao_code: "WIII",
    city: "Jakarta",
    country_code: "ID",
    lat: -6.1256,
    lon: 106.6558,
    timezone: "Asia/Jakarta"
  });
  
  // Generate more airports
  for (let i = 1; i <= 50; i++) {
    mockAirports.push({
      name: `Jakarta Regional Airport ${i}`,
      iata_code: `JKT${i}`,
      icao_code: `WII${i}`,
      city: "Jakarta Region",
      country_code: "ID",
      lat: -6.1256 + (Math.random() - 0.5) * 2,
      lon: 106.6558 + (Math.random() - 0.5) * 2,
      timezone: "Asia/Jakarta"
    });
  }
  
  // Filter by search term if provided
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    return mockAirports.filter(airport => 
      airport.name.toLowerCase().includes(searchLower) || 
      (airport.iata_code && airport.iata_code.toLowerCase().includes(searchLower)) || 
      (airport.city && airport.city.toLowerCase().includes(searchLower))
    );
  }
  
  return mockAirports;
};

// Mock function for fetchArrivalsDepartures
export const fetchArrivalsDepartures = async (airportCode: string) => {
  try {
    // This is a mock function that would normally call an aviation API
    console.log(`Fetching arrivals and departures for airport code: ${airportCode}`);
    
    // For demo purposes, return mock data with CGK
    return {
      arrivals: [
        {
          flight_number: 'GA123',
          dep_iata: 'SIN',
          arr_iata: airportCode,
          status: 'On Time',
          scheduled_arrival: '2025-04-23T13:45:00',
          actual_arrival: '2025-04-23T13:43:00',
          gate: 'A1',
          airline: { name: 'Garuda Indonesia' }
        },
        {
          flight_number: 'SQ456',
          dep_iata: 'KUL',
          arr_iata: airportCode,
          status: 'Delayed',
          scheduled_arrival: '2025-04-23T14:30:00',
          actual_arrival: '2025-04-23T15:15:00',
          delay: 45,
          gate: 'B3',
          airline: { name: 'Singapore Airlines' }
        }
      ],
      departures: [
        {
          flight_number: 'GA789',
          dep_iata: airportCode,
          arr_iata: 'DPS',
          status: 'On Time',
          scheduled_departure: '2025-04-23T16:20:00',
          actual_departure: '2025-04-23T16:18:00',
          gate: 'C5',
          airline: { name: 'Garuda Indonesia' }
        },
        {
          flight_number: 'QZ321',
          dep_iata: airportCode,
          arr_iata: 'SUB',
          status: 'Boarding',
          scheduled_departure: '2025-04-23T17:00:00',
          gate: 'D2',
          airline: { name: 'AirAsia' }
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching arrivals and departures:', error);
    return { arrivals: [], departures: [] };
  }
};

export const searchFlights = async (
  departureAirportCode: string,
  arrivalAirportCode: string,
  date: string
): Promise<Flight[]> => {
  // Mock flight data for demonstration purposes
  const mockFlights: Flight[] = [
    {
      flight_number: 'GA123',
      dep_iata: departureAirportCode,
      arr_iata: arrivalAirportCode,
      status: 'On Time',
      scheduled_departure: `${date}T08:00:00`,
      scheduled_arrival: `${date}T10:00:00`,
    },
    {
      flight_number: 'QZ456',
      dep_iata: departureAirportCode,
      arr_iata: arrivalAirportCode,
      status: 'Delayed',
      scheduled_departure: `${date}T12:00:00`,
      scheduled_arrival: `${date}T14:00:00`,
      delay: 45,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFlights);
    }, 500);
  });
};

export const fetchSuggestions = async (query: string): Promise<SuggestResult[]> => {
  console.log(`Fetching suggestions for query: ${query}`);
  // Mock data with CGK airport
  const mockSuggestions: SuggestResult[] = [
    {
      name: "Soekarno–Hatta International Airport",
      city: "Jakarta",
      iata_code: "CGK",
      icao_code: "WIII",
      country_code: "ID",
      type: "airport",
      lat: -6.1256,
      lon: 106.6558,
    },
    {
      name: "Halim Perdanakusuma International Airport",
      city: "Jakarta",
      iata_code: "HLP",
      icao_code: "WIHH",
      country_code: "ID",
      type: "airport",
      lat: -6.2666,
      lon: 106.8906,
    },
    {
      name: "Jakarta",
      country_code: "ID",
      type: "city",
      lat: -6.1751,
      lon: 106.8650,
    },
    {
      name: "Garuda Indonesia",
      iata_code: "GA",
      icao_code: "GIA",
      country_code: "ID",
      type: "airline",
    }
  ];
  
  // Filter suggestions based on query
  return mockSuggestions.filter(item => 
    item.name.toLowerCase().includes(query.toLowerCase()) || 
    (item.iata_code && item.iata_code.toLowerCase().includes(query.toLowerCase())) ||
    (item.city && item.city.toLowerCase().includes(query.toLowerCase()))
  );
};

export const fetchFlightStatus = async (flightId: string): Promise<Flight | null> => {
  console.log(`Fetching flight status for ID: ${flightId}`);
  
  // Mock flight status data with CGK
  const mockFlight: Flight = {
    flight_number: flightId,
    dep_iata: 'CGK',
    arr_iata: 'DPS',
    status: 'active',
    scheduled_departure: '2025-04-23T08:00:00',
    scheduled_arrival: '2025-04-23T11:15:00',
    airline: { name: 'Garuda Indonesia' }
  };
  
  return mockFlight;
};

export const fetchMostTrackedFlights = async (): Promise<Flight[]> => {
  console.log('Fetching most tracked flights');
  
  // Mock data for tracked flights with CGK
  const mockFlights: Flight[] = Array(8).fill(null).map((_, i) => ({
    flight_number: `GA${1000 + i}`,
    dep_iata: 'CGK',
    arr_iata: `DPS`,
    status: i % 3 === 0 ? 'on-ground' : 'active',
  }));
  
  return mockFlights;
};

export const fetchNearbyAircraft = async (lat: number, lng: number, radius: number = 100): Promise<Flight[]> => {
  console.log(`Fetching nearby aircraft around lat=${lat}, lng=${lng} with radius=${radius}km`);
  
  // Generate random aircraft in the vicinity
  const mockAircraft: Flight[] = Array(5).fill(null).map((_, i) => {
    return {
      flight_number: `GA${2000 + i}`,
      status: 'active',
    };
  });
  
  return mockAircraft;
};

export const fetchLiveFlights = async (filters: { status?: string, delayed?: boolean, flight_iata?: string, limit?: string } = {}): Promise<Flight[]> => {
  console.log('Fetching live flights with filters:', filters);
  
  // Mock data for live flights with CGK
  const mockFlights: Flight[] = Array(10).fill(null).map((_, i) => {
    const isDelayed = i % 3 === 0;
    const delayTime = isDelayed ? 10 + (i * 5) : 0;
    
    return {
      flight_number: `GA${3000 + i}`,
      dep_iata: 'CGK',
      arr_iata: ['DPS', 'SUB', 'MES', 'UPG', 'BDO'][i % 5],
      status: isDelayed ? 'delayed' : ['active', 'scheduled', 'landed'][i % 3],
      delay: isDelayed ? delayTime : 0
    };
  });
  
  // Apply filters if provided
  if (filters) {
    let filtered = [...mockFlights];
    
    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(flight => flight.status === filters.status);
    }
    
    // Filter by delayed status
    if (filters.delayed !== undefined) {
      const isDelayed = (flight: Flight) => (flight.delay && flight.delay > 0);
      filtered = filtered.filter(flight => filters.delayed === isDelayed(flight));
    }
    
    // Filter by flight IATA code
    if (filters.flight_iata) {
      filtered = filtered.filter(flight => flight.flight_number === filters.flight_iata);
    }
    
    // Apply limit if provided
    if (filters.limit) {
      const limit = parseInt(filters.limit);
      if (!isNaN(limit)) {
        filtered = filtered.slice(0, limit);
      }
    }
    
    return filtered;
  }
  
  return mockFlights;
};

export const fetchFlightSchedules = async (
  params: Record<string, string> = {}
): Promise<Flight[]> => {
  const airportCode = params.dep_iata || params.arr_iata || 'CGK';
  const date = params.date || new Date().toISOString().split('T')[0];
  const type = params.arr_iata ? 'arrivals' : 'departures';
  
  console.log(`Fetching ${type} for airport ${airportCode} on ${date}`);
  
  // Mock flight schedules with CGK
  const mockSchedules: Flight[] = Array(12).fill(null).map((_, i) => {
    const isDelayed = i % 4 === 0;
    const delayTime = isDelayed ? 15 + (i * 3) : 0;
    const hour = 6 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    
    return {
      flight_number: `GA${4000 + i}`,
      dep_iata: type === 'departures' ? airportCode : ['SIN', 'KUL', 'BKK', 'HKG', 'MNL', 'HND'][i % 6],
      arr_iata: type === 'arrivals' ? airportCode : ['DPS', 'SUB', 'MES', 'UPG', 'BDO', 'PLM'][i % 6],
      status: isDelayed ? 'delayed' : ['scheduled', 'active', 'boarding'][i % 3],
      delay: isDelayed ? delayTime : 0,
    };
  });
  
  return mockSchedules;
};

// Add getUserPosition function
export const getUserPosition = (): Promise<{lat: number, lng: number}> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
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
        console.error("Error getting user position:", error);
        reject(error);
      }
    );
  });
};

// Add fetchFlightsByStatus function
export const fetchFlightsByStatus = async (status: string, limit: number = 10): Promise<Flight[]> => {
  console.log(`Fetching flights with status: ${status}, limit: ${limit}`);
  
  // Use fetchLiveFlights with status filter
  const flights = await fetchLiveFlights({ 
    status: status,
    limit: limit.toString()
  });
  
  return flights;
};

// Export fetchAirlines as alias for backward compatibility
export const fetchAirlines = fetchAirports;
