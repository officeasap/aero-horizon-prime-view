
import React, { useState, useEffect } from 'react';
import { Plane, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from "@/hooks/use-toast";

// Sample flight data for initial display
const sampleFlights = [
  { id: 'BA2490', airline: 'British Airways', destination: 'London', time: '08:45', status: 'On Time', gate: 'A22' },
  { id: 'EK203', airline: 'Emirates', destination: 'Dubai', time: '09:15', status: 'Boarding', gate: 'C10' },
  { id: 'LH723', airline: 'Lufthansa', destination: 'Frankfurt', time: '09:30', status: 'Delayed', gate: 'B15' },
  { id: 'AF1680', airline: 'Air France', destination: 'Paris', time: '10:00', status: 'On Time', gate: 'D05' },
  { id: 'SQ321', airline: 'Singapore Airlines', destination: 'Singapore', time: '10:15', status: 'On Time', gate: 'C18' },
  { id: 'UA901', airline: 'United Airlines', destination: 'New York', time: '10:45', status: 'Delayed', gate: 'B08' },
  { id: 'QR160', airline: 'Qatar Airways', destination: 'Doha', time: '11:30', status: 'On Time', gate: 'A33' },
  { id: 'JL044', airline: 'Japan Airlines', destination: 'Tokyo', time: '12:00', status: 'Boarding', gate: 'D12' },
];

interface FlightData {
  id: string;
  airline: string;
  destination: string;
  time: string;
  status: string;
  gate: string;
}

// Interface for API response flight data
interface ApiFlightData {
  airline: {
    name: string;
  };
  flight: {
    iata: string;
  };
  departure: {
    airport: string;
    scheduled: string;
    terminal?: string;
    gate?: string;
  };
  arrival: {
    airport: string;
  };
  flight_status: string;
}

const FlightSchedule: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>(sampleFlights);
  const [filteredFlights, setFilteredFlights] = useState<FlightData[]>(sampleFlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [flipStates, setFlipStates] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Handle search functionality
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    const filtered = flights.filter(flight => 
      flight.destination.toLowerCase().includes(term) || 
      flight.airline.toLowerCase().includes(term) || 
      flight.id.toLowerCase().includes(term)
    );
    
    setFilteredFlights(filtered);
  };

  // Fetch real-time flight data from Aviation Stack API
  const fetchFlightData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "https://api.aviationstack.com/v1/flights?access_key=92b18adb94cec63f7ab7489eed154775"
      );
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.info || "Failed to fetch flight data");
      }
      
      if (data.data && Array.isArray(data.data)) {
        const formattedFlights = data.data.slice(0, 20).map((flight: ApiFlightData) => {
          // Format scheduled time
          const scheduledDate = flight.departure.scheduled 
            ? new Date(flight.departure.scheduled) 
            : new Date();
          const formattedTime = scheduledDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          });
          
          // Map status to display format
          let statusDisplay = 'Unknown';
          switch(flight.flight_status?.toLowerCase()) {
            case 'scheduled':
              statusDisplay = 'On Time';
              break;
            case 'active':
              statusDisplay = 'In Air';
              break;
            case 'landed':
              statusDisplay = 'Landed';
              break;
            case 'cancelled':
              statusDisplay = 'Cancelled';
              break;
            case 'incident':
              statusDisplay = 'Incident';
              break;
            case 'diverted':
              statusDisplay = 'Diverted';
              break;
            default:
              statusDisplay = flight.flight_status || 'Unknown';
          }
          
          return {
            id: flight.flight.iata || 'Unknown',
            airline: flight.airline.name || 'Unknown Airline',
            destination: flight.arrival.airport || 'Unknown',
            time: formattedTime,
            status: statusDisplay,
            gate: flight.departure.gate || flight.departure.terminal || 'TBA'
          };
        });
        
        setFlights(formattedFlights);
        setFilteredFlights(formattedFlights);
        
        toast({
          title: "Flight data updated",
          description: "Latest flight schedule has been loaded",
        });
      } else {
        throw new Error("No flight data available");
      }
    } catch (error) {
      console.error("Error fetching flight data:", error);
      toast({
        title: "Failed to load flight data",
        description: "Using sample data instead. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update flight data periodically to simulate real-time updates when using sample data
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sampleFlights.length);
      const updatedFlights = [...flights];
      
      // Only update if we're still using sample data
      if (updatedFlights.length === sampleFlights.length) {
        // Randomly update status for one flight
        const statusOptions = ['On Time', 'Boarding', 'Delayed', 'Gate Change'];
        updatedFlights[randomIndex] = {
          ...updatedFlights[randomIndex],
          status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
        };
        
        setFlights(updatedFlights);
        
        // Filter again with current search term
        const filtered = updatedFlights.filter(flight => 
          flight.destination.toLowerCase().includes(searchTerm) || 
          flight.airline.toLowerCase().includes(searchTerm) || 
          flight.id.toLowerCase().includes(searchTerm)
        );
        
        setFilteredFlights(filtered);
        
        // Trigger flip animation for the updated flight
        setFlipStates(prev => ({ ...prev, [randomIndex]: true }));
        
        // Reset flip state after animation
        setTimeout(() => {
          setFlipStates(prev => ({ ...prev, [randomIndex]: false }));
        }, 3000);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [flights, searchTerm]);

  return (
    <section id="schedule" className="py-8 w-full max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-2">
          <Plane className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">Flight Schedule</h2>
        </div>
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search flights..."
            value={searchTerm}
            onChange={handleSearch}
            className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10 w-48 md:w-64"
          />
          <Search className="absolute right-3 text-gray-light h-4 w-4" />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="relative overflow-x-auto">
          <div className="bg-gray-dark/50 p-2 flex justify-between border-b border-white/10 text-xs md:text-sm font-medium text-gray-light sticky top-0">
            <div className="w-[15%] pl-4">Flight</div>
            <div className="w-[25%]">Airline</div>
            <div className="w-[25%]">Destination</div>
            <div className="w-[15%] text-center">Time</div>
            <div className="w-[10%] text-center">Gate</div>
            <div className="w-[10%] text-center">Status</div>
          </div>
          
          <div className="text-sm md:text-base font-mono">
            {filteredFlights.map((flight, index) => (
              <div 
                key={flight.id + index} 
                className={cn(
                  "flex justify-between items-center p-3 border-b border-white/5 transition-colors hover:bg-white/5",
                  index % 2 === 0 ? 'bg-white/[0.02]' : ''
                )}
              >
                <div className="w-[15%] pl-4 font-medium">{flight.id}</div>
                <div className="w-[25%] text-gray-light">{flight.airline}</div>
                <div className="w-[25%]">{flight.destination}</div>
                <div className="w-[15%] text-center font-medium">
                  <span className={cn("flight-cell", flipStates[index] && "flip")}>
                    <span className="flight-cell-content">{flight.time}</span>
                  </span>
                </div>
                <div className="w-[10%] text-center">{flight.gate}</div>
                <div className="w-[10%] text-center">
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-semibold",
                    flight.status === 'On Time' && "bg-green-900/30 text-green-400",
                    flight.status === 'Delayed' && "bg-red-900/30 text-red-400",
                    flight.status === 'Boarding' && "bg-blue-900/30 text-blue-400",
                    flight.status === 'In Air' && "bg-purple-900/30 text-purple-400",
                    flight.status === 'Landed' && "bg-gray-900/30 text-gray-400",
                    flight.status === 'Cancelled' && "bg-red-900/50 text-red-500",
                    flight.status === 'Gate Change' && "bg-yellow-900/30 text-yellow-400",
                    flight.status === 'Diverted' && "bg-orange-900/30 text-orange-400"
                  )}>
                    {flight.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 px-4">
        <Button 
          className="bg-purple hover:bg-purple-600 text-white purple-glow" 
          onClick={fetchFlightData}
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : "View Full Schedule"}
        </Button>
      </div>
    </section>
  );
};

export default FlightSchedule;
