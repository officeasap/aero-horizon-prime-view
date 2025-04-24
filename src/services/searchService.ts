
import { fetchAirports } from './airportService';
import { fetchAirlines } from './airlineService';
import { SuggestResult } from './shared/types';

export async function fetchSuggestions(query: string): Promise<SuggestResult[]> {
  if (!query || query.length < 2) {
    return [];
  }
  // Fetch airport and airline suggestions
  const [airports, airlines] = await Promise.all([
    fetchAirports({ search: query }),
    fetchAirlines({ search: query }),
  ]);
  const airportResults = airports.map(a => ({
    name: a.name,
    iata_code: a.iata_code || a.iata,
    icao_code: a.icao_code || a.icao,
    city: a.city,
    country: a.country,
    country_code: a.country_code,
    lat: a.lat,
    lon: a.lon,
    longitude: a.lon,
    latitude: a.lat,
    timezone: a.timezone,
    type: 'airport' as const
  }));
  const airlineResults = airlines.map(al => ({
    name: al.name,
    iata_code: al.iata_code || al.iata,
    icao_code: al.icao_code || al.icao,
    city: '', // Required field
    country: al.country || '',  // Required field
    country_code: al.country_code,
    type: 'airline' as const,
  }));
  return [...airportResults, ...airlineResults];
}
