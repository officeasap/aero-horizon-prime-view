
import { fetchAirportsByCode, fetchAirportsByLocation, fetchAirports } from './airportService';
import { fetchAirlines } from './airlineService';
import { fetchRecentFlightDetails } from './flightService';
import { Airport, Airline, Flight, SuggestResult } from './shared/types';

// Re-export types from shared/types
export type { Airport, Airline, Flight, SuggestResult };

// Mock function for fetchArrivalsDepartures
export const fetchArrivalsDepartures = async (airportCode: string) => {
  try {
    // This is a mock function that would normally call an aviation API
    console.log(`Fetching arrivals and departures for airport code: ${airportCode}`);
    
    // For demo purposes, return mock data
    return {
      arrivals: [
        {
          flight_number: 'AA123',
          departure_airport: 'LAX',
          arrival_airport: airportCode,
          status: 'On Time',
          scheduled_arrival: '2023-04-23T13:45:00',
          actual_arrival: '2023-04-23T13:43:00',
        },
        {
          flight_number: 'UA456',
          departure_airport: 'ORD',
          arrival_airport: airportCode,
          status: 'Delayed',
          scheduled_arrival: '2023-04-23T14:30:00',
          actual_arrival: '2023-04-23T15:15:00',
          delay: 45,
        }
      ],
      departures: [
        {
          flight_number: 'DL789',
          departure_airport: airportCode,
          arrival_airport: 'ATL',
          status: 'On Time',
          scheduled_departure: '2023-04-23T16:20:00',
          actual_departure: '2023-04-23T16:18:00',
        },
        {
          flight_number: 'WN321',
          departure_airport: airportCode,
          arrival_airport: 'DEN',
          status: 'Boarding',
          scheduled_departure: '2023-04-23T17:00:00',
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
      flight_number: 'UA123',
      departure_airport: departureAirportCode,
      arrival_airport: arrivalAirportCode,
      status: 'On Time',
      scheduled_departure: `${date}T08:00:00`,
      scheduled_arrival: `${date}T10:00:00`,
      actual_departure: `${date}T08:05:00`,
      actual_arrival: `${date}T09:55:00`,
    },
    {
      flight_number: 'AA456',
      departure_airport: departureAirportCode,
      arrival_airport: arrivalAirportCode,
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
    const airport = await fetchAirportsByCode(airportCode);
    return airport ? airport : null;
  } catch (error) {
    console.error('Error fetching airport details:', error);
    return null;
  }
};

export const getAirlines = async (searchQuery: string): Promise<Airline[]> => {
  try {
    // Call the airline service to fetch airlines based on the search query
    const airlines = await fetchAirlines({ search: searchQuery });
    return airlines;
  } catch (error) {
    console.error('Error fetching airlines:', error);
    return [];
  }
};

export const getRecentFlights = async (): Promise<Flight[]> => {
    try {
        // Call the flight service to fetch recent flight details
        const flights = await fetchRecentFlightDetails();
        return flights;
    } catch (error) {
        console.error('Error fetching recent flights:', error);
        return [];
    }
};

export const getAirportsByLocation = async (latitude: number, longitude: number): Promise<Airport[]> => {
  try {
    // Call the airport service to fetch airports by location
    const airports = await fetchAirportsByLocation(latitude, longitude);
    return airports;
  } catch (error) {
    console.error('Error fetching airports by location:', error);
    return [];
  }
};

// Add missing functions required by components
export const fetchAirportByIATA = async (iataCode: string): Promise<Airport | null> => {
  try {
    console.log(`Fetching airport with IATA code: ${iataCode}`);
    // Mock data for demonstration
    const mockAirport: Airport = {
      id: `airport-${iataCode}`,
      name: `${iataCode} International Airport`,
      city: "Sample City",
      country: "Sample Country",
      iata: iataCode,
      icao: `${iataCode}X`,
      lat: 0,
      lon: 0,
      alt: 0,
      timezone: "GMT+0",
    };
    return mockAirport;
  } catch (error) {
    console.error('Error fetching airport by IATA:', error);
    return null;
  }
};

export const fetchSuggestions = async (query: string): Promise<SuggestResult[]> => {
  console.log(`Fetching suggestions for query: ${query}`);
  // Mock data
  const mockSuggestions: SuggestResult[] = [
    {
      name: "London Heathrow Airport",
      city: "London",
      iata_code: "LHR",
      icao_code: "EGLL",
      country_code: "GB",
      type: "airport",
      lat: 51.4775,
      lon: -0.4614,
    },
    {
      name: "London Gatwick Airport",
      city: "London",
      iata_code: "LGW",
      icao_code: "EGKK",
      country_code: "GB",
      type: "airport",
      lat: 51.1481,
      lon: -0.1903,
    },
    {
      name: "London",
      country_code: "GB",
      type: "city",
      lat: 51.5074,
      lon: -0.1278,
    },
    {
      name: "British Airways",
      iata_code: "BA",
      icao_code: "BAW",
      country_code: "GB",
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
  
  // Mock flight status data
  const mockFlight: Flight = {
    flight_number: flightId,
    flight_iata: flightId,
    flight_icao: `${flightId}X`,
    status: 'active',
    dep_iata: 'JFK',
    dep_icao: 'KJFK',
    dep_name: 'John F. Kennedy International Airport',
    dep_city: 'New York',
    dep_country: 'United States',
    arr_iata: 'LAX',
    arr_icao: 'KLAX',
    arr_name: 'Los Angeles International Airport',
    arr_city: 'Los Angeles',
    arr_country: 'United States',
    airline_name: 'Sample Airlines',
    airline_iata: 'SA',
    airline_icao: 'SAL',
    dep_time: '2023-04-23T08:00:00',
    arr_time: '2023-04-23T11:15:00',
    dep_time_utc: '2023-04-23T12:00:00Z',
    arr_time_utc: '2023-04-23T15:15:00Z',
    dep_terminal: 'T4',
    dep_gate: 'G12',
    arr_terminal: 'T1',
    arr_gate: 'B5',
    dep_delayed: 15,
    arr_delayed: 10,
    dep_actual: '2023-04-23T08:15:00',
    arr_actual: '2023-04-23T11:25:00',
    dep_estimated: '2023-04-23T08:15:00',
    arr_estimated: '2023-04-23T11:25:00',
    duration: 195,
    aircraft_icao: 'B738',
    hex: 'A1B2C3',
    lat: 38.5,
    lng: -95.7,
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
  
  // Mock data for tracked flights
  const mockFlights: Flight[] = Array(8).fill(null).map((_, i) => ({
    flight_number: `SA${1000 + i}`,
    flight_iata: `SA${1000 + i}`,
    flight_icao: `SAL${1000 + i}`,
    status: i % 3 === 0 ? 'on-ground' : 'active',
    dep_country: ['United States', 'United Kingdom', 'Germany', 'France', 'Spain'][i % 5],
    hex: `A${i}B${i}C${i}`,
    lat: 35 + (i * 0.5),
    lng: -100 + (i * 2),
    alt: 30000 + (i * 1000),
    speed: 400 + (i * 20),
    dir: (i * 45) % 360,
    v_speed: i % 2 === 0 ? 0 : 500,
    squawk: `${1000 + i}`,
  }));
  
  return mockFlights;
};

export const fetchNearbyAircraft = async (lat: number, lng: number, radius: number): Promise<Flight[]> => {
  console.log(`Fetching nearby aircraft around lat=${lat}, lng=${lng} with radius=${radius}km`);
  
  // Generate random aircraft in the vicinity
  const mockAircraft: Flight[] = Array(5).fill(null).map((_, i) => {
    // Calculate random position within the radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius;
    const latChange = distance * Math.cos(angle) / 111; // Approx 111km per degree of latitude
    const lngChange = distance * Math.sin(angle) / (111 * Math.cos((lat + latChange) * Math.PI / 180));
    
    return {
      flight_number: `AC${2000 + i}`,
      flight_iata: `AC${2000 + i}`,
      flight_icao: `ACR${2000 + i}`,
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

export const fetchLiveFlights = async (filters?: { status?: string, delayed?: boolean }): Promise<Flight[]> => {
  console.log('Fetching live flights with filters:', filters);
  
  // Mock data for live flights
  const mockFlights: Flight[] = Array(10).fill(null).map((_, i) => {
    const isDelayed = i % 3 === 0;
    const delayTime = isDelayed ? 10 + (i * 5) : 0;
    
    return {
      flight_number: `FL${3000 + i}`,
      flight_iata: `FL${3000 + i}`,
      flight_icao: `FLT${3000 + i}`,
      status: isDelayed ? 'delayed' : ['active', 'scheduled', 'landed'][i % 3],
      dep_iata: ['JFK', 'LAX', 'ORD', 'ATL', 'DFW'][i % 5],
      arr_iata: ['LHR', 'CDG', 'FRA', 'AMS', 'MAD'][i % 5],
      dep_name: `${['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Dallas'][i % 5]} Airport`,
      arr_name: `${['London', 'Paris', 'Frankfurt', 'Amsterdam', 'Madrid'][i % 5]} Airport`,
      dep_city: ['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Dallas'][i % 5],
      arr_city: ['London', 'Paris', 'Frankfurt', 'Amsterdam', 'Madrid'][i % 5],
      airline_name: ['Sample Air', 'Test Airways', 'Mock Airlines', 'Example Air', 'Demo Flights'][i % 5],
      dep_time: `2025-04-23T${(8 + i) % 24}:00:00`,
      dep_time_utc: `2025-04-23T${(12 + i) % 24}:00:00Z`,
      arr_time: `2025-04-23T${(12 + i) % 24}:00:00`,
      arr_time_utc: `2025-04-23T${(16 + i) % 24}:00:00Z`,
      dep_terminal: `T${1 + (i % 5)}`,
      dep_gate: `G${10 + i}`,
      dep_delayed: isDelayed ? delayTime : 0,
      arr_delayed: isDelayed ? delayTime - 5 : 0,
      dep_estimated: isDelayed ? `2025-04-23T${(8 + i) % 24}:${delayTime}:00` : undefined,
      dep_actual: `2025-04-23T${(8 + i) % 24}:${isDelayed ? delayTime : 0}:00`,
    };
  });
  
  // Apply filters if provided
  if (filters) {
    return mockFlights.filter(flight => {
      // Filter by status
      if (filters.status && flight.status !== filters.status) {
        return false;
      }
      
      // Filter by delayed status
      if (filters.delayed !== undefined) {
        const isDelayed = (flight.dep_delayed && flight.dep_delayed > 0) || 
                          (flight.arr_delayed && flight.arr_delayed > 0);
        if (filters.delayed !== isDelayed) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  return mockFlights;
};

export const fetchFlightSchedules = async (
  airportCode: string, 
  date: string, 
  type: 'departures' | 'arrivals' = 'departures'
): Promise<Flight[]> => {
  console.log(`Fetching ${type} for airport ${airportCode} on ${date}`);
  
  // Mock flight schedules
  const mockSchedules: Flight[] = Array(12).fill(null).map((_, i) => {
    const isDelayed = i % 4 === 0;
    const delayTime = isDelayed ? 15 + (i * 3) : 0;
    const hour = 6 + Math.floor(i / 2);
    const minute = (i % 2) * 30;
    
    return {
      flight_number: `SC${4000 + i}`,
      flight_iata: `SC${4000 + i}`,
      flight_icao: `SCH${4000 + i}`,
      status: isDelayed ? 'delayed' : ['scheduled', 'active', 'boarding'][i % 3],
      dep_iata: type === 'departures' ? airportCode : ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'SFO'][i % 6],
      arr_iata: type === 'arrivals' ? airportCode : ['LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'DXB'][i % 6],
      dep_name: type === 'departures' ? `${airportCode} Airport` : `${['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Dallas', 'San Francisco'][i % 6]} Airport`,
      arr_name: type === 'arrivals' ? `${airportCode} Airport` : `${['London', 'Paris', 'Frankfurt', 'Amsterdam', 'Madrid', 'Dubai'][i % 6]} Airport`,
      dep_city: type === 'departures' ? 'Current City' : ['New York', 'Los Angeles', 'Chicago', 'Atlanta', 'Dallas', 'San Francisco'][i % 6],
      arr_city: type === 'arrivals' ? 'Current City' : ['London', 'Paris', 'Frankfurt', 'Amsterdam', 'Madrid', 'Dubai'][i % 6],
      airline_name: ['World Air', 'Global Airways', 'Intercontinental', 'Express Flights', 'Premium Air'][i % 5],
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

// Add fetchNearbyAirports function for NearbyAirports component
export const fetchNearbyAirports = async (lat: number, lng: number, radius: number): Promise<Airport[]> => {
  console.log(`Fetching nearby airports around lat=${lat}, lng=${lng} with radius=${radius}km`);
  
  // Generate 5-8 random airports nearby
  const count = 5 + Math.floor(Math.random() * 4);
  const mockAirports: Airport[] = Array(count).fill(null).map((_, i) => {
    // Calculate random position within the radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radius * 0.8; // Keep within 80% of the radius for better display
    const latChange = distance * Math.cos(angle) / 111; // Approx 111km per degree of latitude
    const lngChange = distance * Math.sin(angle) / (111 * Math.cos((lat + latChange) * Math.PI / 180));
    
    // Calculate distance in kilometers
    const airportLat = lat + latChange;
    const airportLng = lng + lngChange;
    const airportDistance = Math.round(
      Math.sqrt(
        Math.pow(111 * (airportLat - lat), 2) + 
        Math.pow(111 * Math.cos(lat * Math.PI / 180) * (airportLng - lng), 2)
      )
    );
    
    const codes = ["JFK", "LAX", "ORD", "LHR", "CDG", "FRA", "NRT", "SYD", "DXB", "GIG", "MEX", "DEL"][i % 12];
    const cityNames = ["New York", "Los Angeles", "Chicago", "London", "Paris", "Frankfurt", "Tokyo", "Sydney", "Dubai", "Rio", "Mexico City", "Delhi"][i % 12];
    const countries = ["United States", "United States", "United States", "United Kingdom", "France", "Germany", "Japan", "Australia", "UAE", "Brazil", "Mexico", "India"][i % 12];
    
    return {
      id: `nearby-${i + 1}`,
      name: `${cityNames} ${["International", "Regional", "Municipal", "National"][i % 4]} Airport`,
      city: cityNames,
      country: countries,
      iata: `${codes}${i+1}`,
      icao: `${codes}${i+1}X`,
      lat: airportLat,
      lon: airportLng,
      alt: Math.floor(Math.random() * 2000),
      timezone: "UTC",
      distance: airportDistance,
    };
  });
  
  // Sort by distance
  mockAirports.sort((a, b) => (a.distance || 0) - (b.distance || 0));
  
  return mockAirports;
};

// Function for getting user position
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
