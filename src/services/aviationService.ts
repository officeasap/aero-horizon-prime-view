
import { fetchAirports, fetchAirportByIATA, fetchNearbyAirports, searchAirportsByRegion } from './airportService';
import { fetchAirlines as fetchAirlinesFromService } from './airlineService';
import { Flight, Airport, Airline, SuggestResult } from './shared/types';

// Re-export types from shared/types
export type { Airport, Airline, Flight, SuggestResult };

// Export all required functions
export { fetchAirportByIATA, fetchNearbyAirports, fetchAirports };

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
        },
        {
          flight_number: 'SQ456',
          dep_iata: 'KUL',
          arr_iata: airportCode,
          status: 'Delayed',
          scheduled_arrival: '2025-04-23T14:30:00',
          actual_arrival: '2025-04-23T15:15:00',
          delay: 45,
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
        },
        {
          flight_number: 'QZ321',
          dep_iata: airportCode,
          arr_iata: 'SUB',
          status: 'Boarding',
          scheduled_departure: '2025-04-23T17:00:00',
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
      actual_departure: `${date}T08:05:00`,
      actual_arrival: `${date}T09:55:00`,
    },
    {
      flight_number: 'QZ456',
      dep_iata: departureAirportCode,
      arr_iata: arrivalAirportCode,
      status: 'Delayed',
      scheduled_departure: `${date}T12:00:00`,
      scheduled_arrival: `${date}T14:00:00`,
      actual_departure: `${date}T12:45:00`,
      actual_arrival: `${date}T14:45:00`,
      delay: 45,
    },
  ];

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFlights);
    }, 500);
  });
};

export const getAirportDetails = async (airportCode: string): Promise<Airport | null> => {
  try {
    // Call the airport service to fetch airport details by code
    const airport = await fetchAirportByIATA(airportCode);
    return airport;
  } catch (error) {
    console.error('Error fetching airport details:', error);
    return null;
  }
};

export const getAirlines = async (searchQuery: string): Promise<Airline[]> => {
  try {
    // Call the airline service to fetch airlines based on the search query
    const airlines = await fetchAirlinesFromService(searchQuery);
    return airlines;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
};

export const getRecentFlights = async (): Promise<Flight[]> => {
  try {
    // Since fetchRecentFlightDetails is not available, return mock data instead
    return getMockFlights(5);
  } catch (error) {
    console.error('Error fetching recent flights:', error);
    return [];
  }
};

export const getAirportsByLocation = async (latitude: number, longitude: number): Promise<Airport[]> => {
  try {
    // Use fetchNearbyAirports instead of fetchAirportsByLocation
    const airports = await fetchNearbyAirports(latitude, longitude, 100);
    return airports;
  } catch (error) {
    console.error('Error fetching airports by location:', error);
    return [];
  }
};

// Add fetchSuggestions function
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
    flight_iata: flightId,
    flight_icao: `${flightId}X`,
    status: 'active',
    dep_iata: 'CGK',
    dep_icao: 'WIII',
    dep_name: 'Soekarno–Hatta International Airport',
    dep_city: 'Jakarta',
    dep_country: 'Indonesia',
    arr_iata: 'DPS',
    arr_icao: 'WADD',
    arr_name: 'Ngurah Rai International Airport',
    arr_city: 'Denpasar',
    arr_country: 'Indonesia',
    airline_name: 'Garuda Indonesia',
    airline_iata: 'GA',
    airline_icao: 'GIA',
    dep_time: '2025-04-23T08:00:00',
    arr_time: '2025-04-23T11:15:00',
    dep_time_utc: '2025-04-23T12:00:00Z',
    arr_time_utc: '2025-04-23T15:15:00Z',
    dep_terminal: 'T3',
    dep_gate: 'G12',
    arr_terminal: 'T1',
    arr_gate: 'B5',
    dep_delayed: 15,
    arr_delayed: 10,
    dep_actual: '2025-04-23T08:15:00',
    arr_actual: '2025-04-23T11:25:00',
    dep_estimated: '2025-04-23T08:15:00',
    arr_estimated: '2025-04-23T11:25:00',
    duration: 195,
    aircraft_icao: 'B738',
    hex: 'A1B2C3',
    lat: -3.5,
    lng: 110.7,
    dir: 270,
    alt: 35000,
    speed: 480,
    v_speed: 0,
    squawk: '1234',
  };
  
  return mockFlight;
};

export const fetchMostTrackedFlights = async (): Promise<Flight[]> => {
  console.log('Fetching most tracked flights');
  
  // Mock data for tracked flights with CGK
  const mockFlights: Flight[] = Array(8).fill(null).map((_, i) => ({
    flight_number: `GA${1000 + i}`,
    flight_iata: `GA${1000 + i}`,
    flight_icao: `GIA${1000 + i}`,
    status: i % 3 === 0 ? 'on-ground' : 'active',
    dep_iata: 'CGK',
    dep_country: 'Indonesia',
    hex: `A${i}B${i}C${i}`,
    lat: -5 + (i * 0.5),
    lng: 105 + (i * 2),
    alt: 30000 + (i * 1000),
    speed: 400 + (i * 20),
    dir: (i * 45) % 360,
    v_speed: i % 2 === 0 ? 0 : 500,
    squawk: `${1000 + i}`,
  }));
  
  return mockFlights;
};

export const fetchNearbyAircraft = async (lat: number, lng: number, radius: number = 100): Promise<Flight[]> => {
  console.log(`Fetching nearby aircraft around lat=${lat}, lng=${lng} with radius=${radius}km`);
  
  // Generate random aircraft in the vicinity
  const mockAircraft: Flight[] = Array(5).fill(null).map((_, i) => {
    // Calculate random position within the radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    const latChange = distance * Math.cos(angle) / 111; // Approx 111km per degree of latitude
    const lngChange = distance * Math.sin(angle) / (111 * Math.cos((lat + latChange) * Math.PI / 180));
    
    return {
      flight_number: `GA${2000 + i}`,
      flight_iata: `GA${2000 + i}`,
      flight_icao: `GIA${2000 + i}`,
      status: 'active',
      hex: `D${i}E${i}F${i}`,
      lat: lat + latChange,
      lng: lng + lngChange,
      alt: 25000 + (i * 1500),
      speed: 450 + (i * 15),
      dir: (i * 60) % 360,
      v_speed: 0,
      squawk: `${2000 + i}`,
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
      flight_iata: `GA${3000 + i}`,
      flight_icao: `GIA${3000 + i}`,
      status: isDelayed ? 'delayed' : ['active', 'scheduled', 'landed'][i % 3],
      dep_iata: 'CGK',
      arr_iata: ['DPS', 'SUB', 'MES', 'UPG', 'BDO'][i % 5],
      dep_name: 'Soekarno–Hatta International Airport',
      arr_name: `${['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung'][i % 5]} Airport`,
      dep_city: 'Jakarta',
      arr_city: ['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung'][i % 5],
      airline_name: 'Garuda Indonesia',
      dep_time: `2025-04-23T${(8 + i) % 24}:00:00`,
      dep_time_utc: `2025-04-23T${(12 + i) % 24}:00:00Z`,
      arr_time: `2025-04-23T${(12 + i) % 24}:00:00`,
      arr_time_utc: `2025-04-23T${(16 + i) % 24}:00:00Z`,
      dep_terminal: `T${1 + (i % 3)}`,
      dep_gate: `G${10 + i}`,
      dep_delayed: isDelayed ? delayTime : 0,
      arr_delayed: isDelayed ? delayTime - 5 : 0,
      dep_estimated: isDelayed ? `2025-04-23T${(8 + i) % 24}:${delayTime}:00` : undefined,
      dep_actual: `2025-04-23T${(8 + i) % 24}:${isDelayed ? delayTime : 0}:00`,
      hex: `A${i}B${i}C${i}`,
      lat: -5 + (i * 0.5),
      lng: 105 + (i * 2),
      alt: 30000 + (i * 1000),
      speed: 400 + (i * 20),
      dir: (i * 45) % 360,
      v_speed: i % 2 === 0 ? 0 : 500,
      squawk: `${1000 + i}`
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
      const isDelayed = (flight: Flight) => (flight.dep_delayed && flight.dep_delayed > 0) || 
                       (flight.arr_delayed && flight.arr_delayed > 0);
      filtered = filtered.filter(flight => filters.delayed === isDelayed(flight));
    }
    
    // Filter by flight IATA code
    if (filters.flight_iata) {
      filtered = filtered.filter(flight => flight.flight_iata === filters.flight_iata);
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
      flight_iata: `GA${4000 + i}`,
      flight_icao: `GIA${4000 + i}`,
      status: isDelayed ? 'delayed' : ['scheduled', 'active', 'boarding'][i % 3],
      dep_iata: type === 'departures' ? airportCode : ['SIN', 'KUL', 'BKK', 'HKG', 'MNL', 'HND'][i % 6],
      arr_iata: type === 'arrivals' ? airportCode : ['DPS', 'SUB', 'MES', 'UPG', 'BDO', 'PLM'][i % 6],
      dep_name: type === 'departures' ? 'Soekarno–Hatta International Airport' : `${['Singapore', 'Kuala Lumpur', 'Bangkok', 'Hong Kong', 'Manila', 'Tokyo'][i % 6]} Airport`,
      arr_name: type === 'arrivals' ? 'Soekarno–Hatta International Airport' : `${['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung', 'Palembang'][i % 6]} Airport`,
      dep_city: type === 'departures' ? 'Jakarta' : ['Singapore', 'Kuala Lumpur', 'Bangkok', 'Hong Kong', 'Manila', 'Tokyo'][i % 6],
      arr_city: type === 'arrivals' ? 'Jakarta' : ['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung', 'Palembang'][i % 6],
      airline_name: 'Garuda Indonesia',
      dep_time: `${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
      arr_time: `${date}T${(hour + 3).toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
      dep_terminal: `T${1 + (i % 3)}`,
      dep_gate: `G${(i + 1) * 5}`,
      dep_delayed: isDelayed ? delayTime : 0,
      arr_delayed: isDelayed ? Math.max(0, delayTime - 5) : 0,
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

// Add a helper function for creating mock flights
const getMockFlights = (count: number): Flight[] => {
  return Array(count).fill(null).map((_, i) => ({
    flight_number: `GA${1000 + i}`,
    flight_iata: `GA${1000 + i}`,
    flight_icao: `GIA${1000 + i}`,
    status: ['active', 'scheduled', 'landed', 'delayed'][i % 4],
    dep_iata: 'CGK',
    arr_iata: ['DPS', 'SUB', 'MES', 'UPG', 'BDO'][i % 5],
    dep_name: 'Soekarno–Hatta International Airport',
    arr_name: `${['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung'][i % 5]} Airport`,
    dep_city: 'Jakarta',
    arr_city: ['Denpasar', 'Surabaya', 'Medan', 'Makassar', 'Bandung'][i % 5],
    airline_name: 'Garuda Indonesia',
    dep_time: `2025-04-23T${(8 + i) % 24}:00:00`,
    dep_time_utc: `2025-04-23T${(12 + i) % 24}:00:00Z`,
    arr_time: `2025-04-23T${(12 + i) % 24}:00:00`,
    arr_time_utc: `2025-04-23T${(16 + i) % 24}:00:00Z`,
    dep_terminal: `T${1 + (i % 3)}`,
    dep_gate: `G${10 + i}`,
    hex: `D${i}E${i}F${i}`,
    lat: -5 + (i * 0.5),
    lng: 105 + (i * 2),
    alt: 30000 + (i * 1000),
    speed: 400 + (i * 20),
    dir: (i * 45) % 360,
    v_speed: i % 2 === 0 ? 0 : 500,
    squawk: `${1000 + i}`,
    dep_delayed: i % 3 === 0 ? 15 + i : 0,
    arr_delayed: i % 3 === 0 ? 10 + i : 0
  }));
};

// Alias for fetchAirlines to maintain backward compatibility
export const fetchAirlines = getAirlines;
