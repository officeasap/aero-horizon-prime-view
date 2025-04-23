
// Re-export specific types to avoid naming conflicts
export { 
  Airport,
  Airline,
  Flight,
  FlightStatus,
  Route,
  FlightTrackingResult,
  SearchResult
} from './shared/types';

// Re-export everything from modules
export * from './airportService';
export * from './airlineService';
export * from './flightTrackingService';
export * from './searchService';
export * from './shared/apiUtils';
export * from './flightService';
