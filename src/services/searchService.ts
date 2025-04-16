
import { toast } from "sonner";
import { fetchWithCache } from "./shared/apiUtils";
import type { Airport, Airline, SuggestResult } from "./shared/types";

export async function fetchSuggestions(query: string) {
  try {
    if (!query || query.length < 2) return [];
    
    const data = await fetchWithCache("suggest", { q: query });
    return data as SuggestResult[];
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    toast.error("Failed to fetch search suggestions. Please try again later.");
    return [];
  }
}

export async function fetchAirportsAndAirlines(searchTerm: string = "") {
  try {
    if (!searchTerm || searchTerm.length < 2) {
      console.log("Fetching default airport list with no search term");
      const airports = await fetchWithCache("airports", { 
        comprehensive: "true",
        limit: "100" 
      });
      
      if (!airports || !Array.isArray(airports)) {
        console.error("Invalid response format for airports", airports);
        return [];
      }
      
      console.log(`Fetched ${airports.length} airports`);
      return airports as Airport[];
    }
    
    const formattedSearch = searchTerm.trim().toUpperCase();
    if (/^[A-Z]{3}$/.test(formattedSearch)) {
      console.log(`Searching for IATA code: ${formattedSearch}`);
      const iataResults = await fetchWithCache("airports", { iata_code: formattedSearch });
      
      if (iataResults && iataResults.length > 0) {
        console.log(`Found ${iataResults.length} airports with IATA code ${formattedSearch}`);
        return iataResults as Airport[];
      }
    }
    
    const suggestions = await fetchSuggestions(searchTerm);
    if (suggestions.length > 0) {
      return suggestions;
    }
    
    return fetchWithCache("airports", { 
      name: searchTerm.trim(),
      limit: "100"
    }) as Promise<Airport[]>;
  } catch (error) {
    console.error("Error fetching airports/airlines:", error);
    toast.error("Failed to fetch airport and airline data. Please try again later.");
    return [];
  }
}
