
import React, { useState, useEffect } from 'react';
import { Clock, ArrowUpDown, Filter, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchFlightsByReason, Flight } from '@/services/aviationService';
import { toast } from 'sonner';

// Fallback data in case API doesn't return enough results
const delayedFlightsData = [
  { id: 'UA3245', airline: 'United Airlines', origin: 'Chicago', destination: 'Denver', scheduledTime: '10:15', estimatedTime: '11:40', delay: 85, reason: 'Weather' },
  { id: 'AA1408', airline: 'American Airlines', origin: 'Dallas', destination: 'Miami', scheduledTime: '12:30', estimatedTime: '13:15', delay: 45, reason: 'Technical' },
  { id: 'DL1622', airline: 'Delta Airlines', origin: 'Atlanta', destination: 'New York', scheduledTime: '14:20', estimatedTime: '16:50', delay: 150, reason: 'Air Traffic' },
  { id: 'WN4511', airline: 'Southwest', origin: 'Las Vegas', destination: 'Phoenix', scheduledTime: '09:45', estimatedTime: '10:55', delay: 70, reason: 'Weather' },
  { id: 'B6801', airline: 'JetBlue', origin: 'Boston', destination: 'Orlando', scheduledTime: '11:10', estimatedTime: '12:20', delay: 70, reason: 'Technical' },
  { id: 'AS1233', airline: 'Alaska Airlines', origin: 'Seattle', destination: 'San Francisco', scheduledTime: '13:25', estimatedTime: '14:10', delay: 45, reason: 'Air Traffic' },
];

// Helper function to format flight data from API
const formatFlightData = (flights: Flight[]) => {
  return flights.map(flight => ({
    id: flight.flight.iata,
    airline: flight.airline.name,
    origin: flight.departure.airport,
    destination: flight.arrival.airport,
    scheduledTime: flight.departure.scheduled ? new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    estimatedTime: flight.departure.estimated ? new Date(flight.departure.estimated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'N/A',
    delay: flight.departure.delay || 0,
    reason: flight.departure.delay > 0 ? (
      flight.departure.delay > 100 ? 'Weather' : 
      flight.departure.delay > 60 ? 'Air Traffic' : 'Technical'
    ) : 'On Time'
  }));
};

type SortField = 'airline' | 'delay' | 'origin' | 'destination';
type SortOrder = 'asc' | 'desc';

const DelayedFlights: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('delay');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load initial data with no filter
    loadFlights(null);
  }, []);

  const loadFlights = async (reason: string | null) => {
    setLoading(true);
    try {
      let data: Flight[] = [];
      if (reason) {
        data = await fetchFlightsByReason(reason);
      } else {
        data = await fetchFlightsByReason('Weather'); // Default to weather if no reason specified
      }
      
      const formattedData = formatFlightData(data);
      
      // If we don't get enough data from the API, supplement with sample data
      if (formattedData.length < 3) {
        const filteredSampleData = reason 
          ? delayedFlightsData.filter(flight => flight.reason === reason)
          : delayedFlightsData;
        
        setFlights([...formattedData, ...filteredSampleData]);
        
        if (formattedData.length === 0) {
          toast.info("Using sample data - API didn't return flight results");
        }
      } else {
        setFlights(formattedData);
      }
    } catch (error) {
      console.error("Error loading flights:", error);
      toast.error("Failed to load flight data. Using sample data instead.");
      
      // Fallback to sample data
      const filteredSampleData = reason 
        ? delayedFlightsData.filter(flight => flight.reason === reason)
        : delayedFlightsData;
      
      setFlights(filteredSampleData);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleFilterClick = (reason: string | null) => {
    setSelectedReason(reason);
    loadFlights(reason);
  };

  const sortedAndFilteredFlights = [...flights]
    .filter(flight => selectedReason ? flight.reason === selectedReason : true)
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'delay') {
        comparison = a.delay - b.delay;
      } else if (sortField === 'airline') {
        comparison = a.airline.localeCompare(b.airline);
      } else if (sortField === 'origin') {
        comparison = a.origin.localeCompare(b.origin);
      } else if (sortField === 'destination') {
        comparison = a.destination.localeCompare(b.destination);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const reasons = [...new Set([...flights.map(flight => flight.reason), 'Weather', 'Technical', 'Air Traffic'])];

  return (
    <section id="delays" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-6">
          <AlertTriangle className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Delayed Flights</h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <p className="text-gray-light">
            Live updates on delayed flights, including estimated wait times and reasons for delays.
          </p>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedReason === null ? 'default' : 'outline'}
              size="sm"
              className={cn(
                selectedReason === null 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => handleFilterClick(null)}
            >
              All
            </Button>
            
            {reasons.map(reason => (
              <Button
                key={reason}
                variant={selectedReason === reason ? 'default' : 'outline'}
                size="sm"
                className={cn(
                  selectedReason === reason 
                    ? "bg-purple hover:bg-purple-600 text-white" 
                    : "bg-transparent border-gray-light text-gray-light hover:text-white"
                )}
                onClick={() => handleFilterClick(reason)}
                disabled={loading}
              >
                {reason}
              </Button>
            ))}
          </div>
        </div>

        <div className="glass-panel overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple"></div>
            </div>
          ) : (
            <div className="relative overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                  <tr>
                    <th className="px-4 py-3">Flight</th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => handleSort('airline')}
                    >
                      <div className="flex items-center gap-1">
                        Airline
                        {sortField === 'airline' && (
                          <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => handleSort('origin')}
                    >
                      <div className="flex items-center gap-1">
                        Origin
                        {sortField === 'origin' && (
                          <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => handleSort('destination')}
                    >
                      <div className="flex items-center gap-1">
                        Destination
                        {sortField === 'destination' && (
                          <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3">Scheduled</th>
                    <th className="px-4 py-3">Estimated</th>
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => handleSort('delay')}
                    >
                      <div className="flex items-center gap-1">
                        Delay
                        {sortField === 'delay' && (
                          <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3">Reason</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sortedAndFilteredFlights.map((flight) => (
                    <tr key={flight.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-medium">{flight.id}</td>
                      <td className="px-4 py-3">{flight.airline}</td>
                      <td className="px-4 py-3">{flight.origin}</td>
                      <td className="px-4 py-3">{flight.destination}</td>
                      <td className="px-4 py-3">{flight.scheduledTime}</td>
                      <td className="px-4 py-3 text-yellow-300">{flight.estimatedTime}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <Clock size={14} className="text-red-400 mr-1" />
                          <span className={cn(
                            flight.delay > 120 ? "text-red-400" : 
                            flight.delay > 60 ? "text-orange-400" : 
                            "text-yellow-400"
                          )}>
                            {flight.delay} min
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          flight.reason === 'Weather' && "bg-blue-900/30 text-blue-400",
                          flight.reason === 'Technical' && "bg-red-900/30 text-red-400",
                          flight.reason === 'Air Traffic' && "bg-yellow-900/30 text-yellow-400"
                        )}>
                          {flight.reason}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-block w-3 h-3 rounded-full bg-red-400"></span>
            <span className="text-sm text-gray-light">Major Delay (120+ min)</span>
            
            <span className="inline-block w-3 h-3 rounded-full bg-orange-400 ml-4"></span>
            <span className="text-sm text-gray-light">Moderate Delay (60-120 min)</span>
            
            <span className="inline-block w-3 h-3 rounded-full bg-yellow-400 ml-4"></span>
            <span className="text-sm text-gray-light">Minor Delay (&lt; 60 min)</span>
          </div>
          
          <Button 
            className="bg-purple hover:bg-purple-600 text-white purple-glow"
            onClick={() => window.open('https://app.asaptracker.com', '_blank')}
          >
            Subscribe to Delay Alerts
          </Button>
        </div>
      </div>
    </section>
  );
};

export default DelayedFlights;
