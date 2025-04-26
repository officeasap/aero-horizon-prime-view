export interface SuggestResult {
  id: string;
  type: 'airport' | 'airline';
  name: string;
  iata_code?: string;
  icao_code?: string;
  coordinates?: {
    lat: number;
    lon: number;
  };
}
