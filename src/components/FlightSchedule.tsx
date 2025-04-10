
import React, { useState, useEffect } from 'react';
import { Plane, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample flight data
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

const FlightSchedule: React.FC = () => {
  const [flights, setFlights] = useState<FlightData[]>(sampleFlights);
  const [filteredFlights, setFilteredFlights] = useState<FlightData[]>(sampleFlights);
  const [searchTerm, setSearchTerm] = useState('');
  const [flipStates, setFlipStates] = useState<{ [key: string]: boolean }>({});

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

  // Update flight data periodically to simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sampleFlights.length);
      const updatedFlights = [...flights];
      
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
                key={flight.id} 
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
                    flight.status === 'Gate Change' && "bg-yellow-900/30 text-yellow-400"
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
        >
          View Full Schedule
        </Button>
      </div>
    </section>
  );
};

export default FlightSchedule;
