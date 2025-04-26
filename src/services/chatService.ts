
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { fetchFromAviationStack, AviationStackFlight } from './aviationStackService';

// API Keys from environment variables
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const AVIATION_STACK_API_KEY = import.meta.env.VITE_AVIATIONSTACK_API_KEY;

// Aviation-related keywords to trigger AviationStack API
const AVIATION_KEYWORDS = [
  'flight', 'airline', 'airport', 'departure', 'arrival', 'schedule',
  'status', 'delayed', 'route', 'terminal', 'gate', 'boarding'
];

export const fetchChatResponse = async (question: string, previousMessages: any[]) => {
  // Check if the question is aviation-related
  const isAviationQuery = AVIATION_KEYWORDS.some(keyword => 
    question.toLowerCase().includes(keyword)
  );

  try {
    if (isAviationQuery) {
      // Try AviationStack first
      try {
        const flightInfo = await handleAviationQuery(question);
        if (flightInfo) {
          return formatAviationResponse(flightInfo, question);
        }
      } catch (error) {
        console.error('AviationStack Error:', error);
        // Fallback to OpenRouter if AviationStack fails
      }
    }

    // Use OpenRouter for general queries or when AviationStack fails
    return await fetchOpenRouterResponse(question, previousMessages);

  } catch (error) {
    console.error('Chat Error:', error);
    toast.error('Unable to process your request');
    return "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.";
  }
};

async function handleAviationQuery(question: string) {
  // Extract flight number if present (e.g., "AA123" or "American Airlines 123")
  const flightNumberMatch = question.match(/([A-Z]{2}|[A-Z]\d)(\d{1,4})/i);
  
  if (flightNumberMatch) {
    const flightIata = flightNumberMatch[0].toUpperCase();
    const response = await fetchFromAviationStack('flights', { 
      flight_iata: flightIata 
    });
    return response.data[0];
  }

  // Extract airport code if present (e.g., "JFK" or "LAX")
  const airportMatch = question.match(/\b([A-Z]{3})\b/i);
  
  if (airportMatch) {
    const airportCode = airportMatch[0].toUpperCase();
    const response = await fetchFromAviationStack('flights', {
      dep_iata: airportCode
    });
    return response.data;
  }

  return null;
}

function formatAviationResponse(flightInfo: AviationStackFlight | AviationStackFlight[], question: string): string {
  if (Array.isArray(flightInfo)) {
    // Format multiple flights information
    const flights = flightInfo.slice(0, 3); // Limit to 3 flights for readability
    return flights.map(flight => formatSingleFlight(flight)).join('\n\n');
  } else if (flightInfo) {
    // Format single flight information
    return formatSingleFlight(flightInfo);
  }
  
  return "I couldn't find specific flight information for your query. Could you please provide more details?";
}

function formatSingleFlight(flight: AviationStackFlight): string {
  const status = flight.flight_status.toLowerCase();
  const statusEmoji = {
    scheduled: '🕒',
    active: '✈️',
    landed: '🛬',
    delayed: '⚠️',
    cancelled: '❌'
  }[status] || '✈️';

  return `${statusEmoji} Flight ${flight.flight.iata} (${flight.airline.name})\n` +
    `From: ${flight.departure.airport} (${flight.departure.iata})\n` +
    `To: ${flight.arrival.airport} (${flight.arrival.iata})\n` +
    `Status: ${flight.flight_status}\n` +
    `Scheduled Departure: ${new Date(flight.departure.scheduled).toLocaleString()}\n` +
    `Scheduled Arrival: ${new Date(flight.arrival.scheduled).toLocaleString()}` +
    (flight.departure.delay ? `\nDeparture Delay: ${flight.departure.delay} minutes` : '') +
    (flight.arrival.delay ? `\nArrival Delay: ${flight.arrival.delay} minutes` : '');
}

async function fetchOpenRouterResponse(question: string, previousMessages: any[]): Promise<string> {
  const systemMessage = {
    role: "system",
    content: `You are ASAP Agent, a friendly and knowledgeable aviation assistant. Always be helpful, clear, and concise in your responses. When discussing flights, airports, or travel, be informative but maintain a warm, conversational tone.`
  };

  const conversationHistory = [
    systemMessage,
    ...previousMessages.slice(-5), // Keep last 5 messages for context
    { role: "user", content: question }
  ];

  const response = await fetch('https://api.openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': window.location.origin,
      'X-Title': 'ASAP Tracker'
    },
    body: JSON.stringify({
      model: "anthropic/claude-3-haiku",
      messages: conversationHistory,
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    throw new Error(`OpenRouter API request failed with status: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

