import { fetchAirportsByCode, fetchAirportsByLocation, fetchAirports } from './airportService';
import { fetchAirlines } from './airlineService';
import { fetchRecentFlightDetails } from './flightService';

// Define types for the aviation service
export type Flight = {
  flight_number: string;
  departure_airport: string;
  arrival_airport: string;
  status: string;
  scheduled_departure: string;
  scheduled_arrival: string;
  actual_departure?: string;
  actual_arrival?: string;
  delay?: number;
};

export type Airport = {
  id: string;
  name: string;
  iata: string;
  icao: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  alt: number;
};

export type Airline = {
  name: string;
  iata_code: string;
  icao_code: string;
};

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
