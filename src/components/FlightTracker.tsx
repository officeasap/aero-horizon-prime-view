
import React, { useState } from 'react';
import { MapPin, Plane, Info, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Sample flight tracking data
const flightData = [
  { id: 'BA189', from: 'London', to: 'New York', airline: 'British Airways', aircraft: 'Boeing 777-300ER', altitude: '36,000 ft', speed: '560 mph', progress: 72 },
  { id: 'SQ322', from: 'Singapore', to: 'Paris', airline: 'Singapore Airlines', aircraft: 'Airbus A380-800', altitude: '39,000 ft', speed: '590 mph', progress: 45 },
  { id: 'EK241', from: 'Dubai', to: 'Sydney', airline: 'Emirates', aircraft: 'Airbus A380-800', altitude: '38,000 ft', speed: '570 mph', progress: 30 },
  { id: 'AA100', from: 'New York', to: 'London', airline: 'American Airlines', aircraft: 'Boeing 777-200ER', altitude: '35,000 ft', speed: '540 mph', progress: 85 },
];

const FlightTracker: React.FC = () => {
  const [selectedFlight, setSelectedFlight] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map');

  return (
    <section id="tracker" className="py-12 w-full max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row items-start justify-between gap-8 px-4">
        <div className="w-full md:w-1/3">
          <div className="flex items-center gap-2 mb-6">
            <Plane className="text-purple h-6 w-6" />
            <h2 className="text-2xl font-semibold font-space">Flight Tracker</h2>
          </div>
          
          <div className="glass-panel p-4 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Active Flights</h3>
              <button className="text-purple flex items-center gap-1 text-sm">
                <Filter size={14} />
                Filter
              </button>
            </div>
            
            <div className="space-y-3">
              {flightData.map((flight) => (
                <button
                  key={flight.id}
                  className={cn(
                    "w-full text-left p-3 rounded-lg transition-all duration-300",
                    selectedFlight === flight.id 
                      ? "bg-purple/20 border border-purple/40" 
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  )}
                  onClick={() => setSelectedFlight(flight.id)}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{flight.id}</span>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple/20 text-purple-200">In Air</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-gray-light text-sm mt-1">
                    <span>{flight.from}</span>
                    <Plane size={12} className="rotate-90 mx-1" />
                    <span>{flight.to}</span>
                  </div>
                  
                  <div className="mt-2">
                    <div className="h-1.5 w-full bg-gray-dark/60 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-purple-700 to-purple rounded-full"
                        style={{ width: `${flight.progress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs mt-1">
                      <span>{flight.progress}%</span>
                      <span>{flight.airline}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
          
          <Button className="w-full bg-purple hover:bg-purple-600 text-white purple-glow">
            Search Flight
          </Button>
        </div>
        
        <div className="w-full md:w-2/3">
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'map' ? 'default' : 'outline'}
              className={cn(
                activeTab === 'map' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => setActiveTab('map')}
            >
              Map View
            </Button>
            <Button
              variant={activeTab === 'list' ? 'default' : 'outline'}
              className={cn(
                activeTab === 'list' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => setActiveTab('list')}
            >
              List View
            </Button>
          </div>
          
          {activeTab === 'map' ? (
            <div className="glass-panel p-0 overflow-hidden rounded-2xl h-[400px] relative">
              {/* World map visualization (placeholder) */}
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"></div>
              
              <div className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent"></div>
              
              {/* Flight routes visualization */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg text-gray-light">Interactive flight map visualization</span>
              </div>
              
              {/* Flight information panel */}
              {selectedFlight && (
                <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 bg-panel/90">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">
                        {flightData.find(f => f.id === selectedFlight)?.id} • {flightData.find(f => f.id === selectedFlight)?.airline}
                      </h4>
                      <div className="flex items-center text-sm mt-1">
                        <MapPin size={14} className="text-purple mr-1" />
                        <span>
                          {flightData.find(f => f.id === selectedFlight)?.from} to {flightData.find(f => f.id === selectedFlight)?.to}
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="bg-transparent border-purple/50 text-purple hover:bg-purple/20">
                      <Info size={14} className="mr-1" /> Details
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Aircraft</div>
                      <div className="font-medium">{flightData.find(f => f.id === selectedFlight)?.aircraft}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Altitude</div>
                      <div className="font-medium">{flightData.find(f => f.id === selectedFlight)?.altitude}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Speed</div>
                      <div className="font-medium">{flightData.find(f => f.id === selectedFlight)?.speed}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg">
                      <div className="text-xs text-gray-light">Progress</div>
                      <div className="font-medium">{flightData.find(f => f.id === selectedFlight)?.progress}%</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel overflow-hidden">
              <div className="relative overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-dark/50 text-xs md:text-sm font-medium text-gray-light border-b border-white/10">
                    <tr>
                      <th className="px-4 py-3">Flight</th>
                      <th className="px-4 py-3">Route</th>
                      <th className="px-4 py-3">Airline</th>
                      <th className="px-4 py-3">Aircraft</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {flightData.map((flight) => (
                      <tr 
                        key={flight.id} 
                        className={cn(
                          "border-b border-white/5 hover:bg-white/5 transition-colors",
                          selectedFlight === flight.id ? "bg-purple/10" : ""
                        )}
                        onClick={() => setSelectedFlight(flight.id)}
                      >
                        <td className="px-4 py-3 font-medium">{flight.id}</td>
                        <td className="px-4 py-3">{flight.from} → {flight.to}</td>
                        <td className="px-4 py-3">{flight.airline}</td>
                        <td className="px-4 py-3">{flight.aircraft}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-900/30 text-green-400">
                            In Air ({flight.progress}%)
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FlightTracker;
