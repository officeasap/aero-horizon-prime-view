
import { Flight, Airport, Airline } from './shared/types';

export const mockAirport: Airport = {
  name: "Soekarno–Hatta International Airport",
  iata: "CGK",
  icao: "WIII",
  city: "Jakarta",
  country: "Indonesia",
  lat: -6.1256,
  lon: 106.6558,
  alt: 34,
  timezone: "+7"
};

export const mockFlight: Flight = {
  flight_number: "GA123",
  flight_iata: "GA123",
  flight_icao: "GIA123",
  airline_name: "Garuda Indonesia",
  airline_iata: "GA",
  dep_iata: "CGK",
  dep_name: "Soekarno–Hatta International Airport",
  dep_city: "Jakarta",
  dep_country: "Indonesia",
  dep_time: "2025-04-24T14:30:00Z",
  dep_time_utc: "2025-04-24T07:30:00Z",
  arr_iata: "DPS",
  arr_name: "Ngurah Rai International Airport",
  arr_city: "Denpasar",
  arr_country: "Indonesia",
  arr_time: "2025-04-24T17:20:00Z",
  arr_time_utc: "2025-04-24T09:20:00Z",
  status: "scheduled",
  duration: 110,
  aircraft_icao: "B738",
  lat: -6.1256,
  lng: 106.6558,
  alt: 35000,
  speed: 550,
  dir: 90
};

export const getMockFlights = (count: number = 10): Flight[] => {
  const flights: Flight[] = [];
  const airlines = ["GA", "JT", "ID", "QZ", "SQ", "MH", "TG", "CX"];
  const statuses = ["scheduled", "active", "landed", "delayed", "cancelled"];
  
  for (let i = 0; i < count; i++) {
    const airlineIdx = i % airlines.length;
    const statusIdx = i % statuses.length;
    
    flights.push({
      flight_number: `${airlines[airlineIdx]}${100 + i}`,
      flight_iata: `${airlines[airlineIdx]}${100 + i}`,
      flight_icao: `${getFullAirlineCode(airlines[airlineIdx])}${100 + i}`,
      airline_name: getAirlineName(airlines[airlineIdx]),
      airline_iata: airlines[airlineIdx],
      dep_iata: "CGK",
      dep_name: "Soekarno–Hatta International Airport",
      dep_city: "Jakarta",
      dep_country: "Indonesia",
      arr_iata: getRandomAirport(),
      arr_name: getAirportName(getRandomAirport()),
      status: statuses[statusIdx],
      lat: -6.1256 + (Math.random() * 10 - 5),
      lng: 106.6558 + (Math.random() * 10 - 5),
      alt: Math.floor(20000 + Math.random() * 15000),
      speed: Math.floor(400 + Math.random() * 200),
      dir: Math.floor(Math.random() * 360),
      hex: generateRandomHex(),
      dep_delayed: Math.random() > 0.7 ? Math.floor(Math.random() * 120) : 0,
      delay: Math.random() > 0.7 ? Math.floor(Math.random() * 120) : 0
    });
  }
  
  return flights;
};

function getFullAirlineCode(shortCode: string): string {
  const codes: Record<string, string> = {
    "GA": "GIA", "JT": "LNI", "ID": "BTK", "QZ": "AWQ", 
    "SQ": "SIA", "MH": "MAS", "TG": "THA", "CX": "CPA"
  };
  return codes[shortCode] || shortCode;
}

function getAirlineName(shortCode: string): string {
  const names: Record<string, string> = {
    "GA": "Garuda Indonesia", "JT": "Lion Air", "ID": "Batik Air", "QZ": "AirAsia Indonesia",
    "SQ": "Singapore Airlines", "MH": "Malaysia Airlines", "TG": "Thai Airways", "CX": "Cathay Pacific"
  };
  return names[shortCode] || `${shortCode} Airlines`;
}

function getRandomAirport(): string {
  const airports = ["DPS", "SUB", "MES", "SIN", "KUL", "BKK", "HKG"];
  return airports[Math.floor(Math.random() * airports.length)];
}

function getAirportName(iata: string): string {
  const names: Record<string, string> = {
    "CGK": "Soekarno–Hatta International Airport",
    "DPS": "Ngurah Rai International Airport",
    "SUB": "Juanda International Airport",
    "MES": "Kualanamu International Airport",
    "SIN": "Singapore Changi Airport",
    "KUL": "Kuala Lumpur International Airport",
    "BKK": "Suvarnabhumi Airport",
    "HKG": "Hong Kong International Airport"
  };
  return names[iata] || `${iata} Airport`;
}

function generateRandomHex(): string {
  return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}
