import React, { useState, useEffect } from 'react';
import { Calendar, Search, Filter, ArrowUpDown, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fetchFlights, Flight } from '@/services/aviationService';
import { toast } from 'sonner';

// Sample historical flight data
const historicalFlightsData = [
  { id: 'UA3245', airline: 'United Airlines', origin: 'Chicago', destination: 'Denver', date: '2025-04-03', scheduledTime: '10:15', actualTime: '11:40', status: 'Delayed', delay: 85 },
  { id: 'AA1408', airline: 'American Airlines', origin: 'Dallas', destination: 'Miami', date: '2025-04-03', scheduledTime: '12:30', actualTime: '13:15', status: 'Delayed', delay: 45 },
  { id: 'DL1622', airline: 'Delta Airlines', origin: 'Atlanta', destination: 'New York', date: '2025-04-04', scheduledTime: '14:20', actualTime: '16:50', status: 'Delayed', delay: 150 },
  { id: 'WN4511', airline: 'Southwest', origin: 'Las Vegas', destination: 'Phoenix', date: '2025-04-04', scheduledTime: '09:45', actualTime: '10:55', status: 'Delayed', delay: 70 },
  { id: 'B6801', airline: 'JetBlue', origin: 'Boston', destination: 'Orlando', date: '2025-04-05', scheduledTime: '11:10', actualTime: '12:20', status: 'Delayed', delay: 70 },
  { id: 'AS1233', airline: 'Alaska Airlines', origin: 'Seattle', destination: 'San Francisco', date: '2025-04-05', scheduledTime: '13:25', actualTime: '14:10', status: 'Delayed', delay: 45 },
  { id: 'UA8921', airline: 'United Airlines', origin: 'Washington', destination: 'Los Angeles', date: '2025-04-06', scheduledTime: '06:30', actualTime: '06:25', status: 'On Time', delay: 0 },
  { id: 'DL2290', airline: 'Delta Airlines', origin: 'Detroit', destination: 'Minneapolis', date: '2025-04-06', scheduledTime: '08:15', actualTime: '08:12', status: 'On Time', delay: 0 },
  { id: 'AA7701', airline: 'American Airlines', origin: 'Phoenix', destination: 'Dallas', date: '2025-04-07', scheduledTime: '13:50', actualTime: '13:48', status: 'On Time', delay: 0 },
  { id: 'WN1177', airline: 'Southwest', origin: 'Denver', destination: 'Chicago', date: '2025-04-07', scheduledTime: '16:20', actualTime: '17:45', status: 'Delayed', delay: 85 },
  { id: 'UA1492', airline: 'United Airlines', origin: 'San Francisco', destination: 'Seattle', date: '2025-04-08', scheduledTime: '11:05', actualTime: '11:10', status: 'On Time', delay: 5 },
  { id: 'DL8823', airline: 'Delta Airlines', origin: 'Atlanta', destination: 'Orlando', date: '2025-04-08', scheduledTime: '15:30', actualTime: '15:25', status: 'On Time', delay: 0 },
  { id: 'AA4109', airline: 'American Airlines', origin: 'Charlotte', destination: 'Washington', date: '2025-04-09', scheduledTime: '09:40', actualTime: 'Scheduled', status: 'Scheduled', delay: 0 },
  { id: 'UA5271', airline: 'United Airlines', origin: 'Houston', destination: 'Denver', date: '2025-04-09', scheduledTime: '17:15', actualTime: 'Scheduled', status: 'Scheduled', delay: 0 },
  { id: 'DL3327', airline: 'Delta Airlines', origin: 'Minneapolis', destination: 'Chicago', date: '2025-04-10', scheduledTime: '07:45', actualTime: 'Scheduled', status: 'Scheduled', delay: 0 },
  { id: 'AA9988', airline: 'American Airlines', origin: 'Miami', destination: 'New York', date: '2025-04-10', scheduledTime: '14:50', actualTime: 'Scheduled', status: 'Scheduled', delay: 0 },
];

// Helper function to format flight data from API
const formatFlightData = (flights: Flight[]) => {
  return flights.map(flight => ({
    id: flight.flight.iata || 'Unknown',
    airline: flight.airline.name || 'Unknown Airline',
    origin: flight.departure.airport || 'Unknown',
    destination: flight.arrival.airport || 'Unknown',
    date: flight.flight_date || format(new Date(), 'yyyy-MM-dd'),
    scheduledTime: flight.departure.scheduled 
      ? new Date(flight.departure.scheduled).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : 'N/A',
    actualTime: flight.departure.actual 
      ? new Date(flight.departure.actual).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      : (flight.flight_status === 'scheduled' ? 'Scheduled' : 'N/A'),
    status: flight.flight_status ? flight.flight_status.charAt(0).toUpperCase() + flight.flight_status.slice(1) : 'Unknown',
    delay: flight.departure.delay || 0
  }));
};

type SortField = 'airline' | 'date' | 'origin' | 'destination';
type SortOrder = 'asc' | 'desc';
type FlightView = 'historical' | 'upcoming';

const HistoricalFlights: React.FC = () => {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedAirline, setSelectedAirline] = useState<string | null>(null);
  const [viewType, setViewType] = useState<FlightView>('historical');
  const [flights, setFlights] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  
  // Helper to determine if a flight is historical or upcoming
  const isHistorical = (flightDate: string) => flightDate < todayStr;
  const isUpcoming = (flightDate: string) => flightDate >= todayStr;
  
  // Filter based on view type (historical or upcoming)
  const viewFiltered = historicalFlightsData.filter(flight => 
    viewType === 'historical' ? isHistorical(flight.date) : isUpcoming(flight.date)
  );
  
  // Apply search and filters
  const filteredFlights = viewFiltered.filter(flight => {
    // Search term filter
    const matchesSearch = !searchTerm || 
      flight.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.airline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Date filter
    const matchesDate = !selectedDate || 
      flight.date === format(selectedDate, 'yyyy-MM-dd');
    
    // Airline filter
    const matchesAirline = !selectedAirline || 
      flight.airline === selectedAirline;
    
    return matchesSearch && matchesDate && matchesAirline;
  });
  
  // New function to load API data
  const loadApiFlights = async () => {
    setLoading(true);
    try {
      // Build API parameters
      const params: Record<string, string> = {};
      
      // Add date filter if selected
      if (selectedDate) {
        params.flight_date = format(selectedDate, 'yyyy-MM-dd');
      }
      
      // Add airline filter if selected
      if (selectedAirline) {
        // Convert airline name to IATA code if possible
        // This is a simplified approach - in reality, you'd need a mapping
        const airlineCode = selectedAirline.substring(0, 2).toUpperCase();
        params.airline_iata = airlineCode;
      }
      
      // Add search term if provided
      if (searchTerm) {
        if (searchTerm.length === 2) {
          // Likely an airline code
          params.airline_iata = searchTerm.toUpperCase();
        } else if (searchTerm.length === 3) {
          // Likely an airport code
          params.dep_iata = searchTerm.toUpperCase();
        } else {
          // Try flight number
          params.flight_iata = searchTerm;
        }
      }
      
      // Add view type (historical or upcoming)
      if (viewType === 'historical') {
        const pastDate = new Date();
        pastDate.setDate(pastDate.getDate() - 7);
        params.flight_date_from = format(pastDate, 'yyyy-MM-dd');
        params.flight_date_to = format(new Date(today.getTime() - 86400000), 'yyyy-MM-dd'); // Yesterday
      } else {
        params.flight_date_from = format(today, 'yyyy-MM-dd');
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + 7);
        params.flight_date_to = format(futureDate, 'yyyy-MM-dd');
      }
      
      // Include Asian and international airports
      const asianAirports = ['PEK', 'HND', 'SIN', 'BKK', 'CGK', 'KUL', 'MNL', 'DEL', 'BOM', 'HKG'];
      if (!params.dep_iata && !params.arr_iata) {
        // If no specific airport, include some Asian airports
        const randomAirport = asianAirports[Math.floor(Math.random() * asianAirports.length)];
        params.dep_iata = randomAirport;
      }
      
      // Add pagination
      params.limit = '25';
      params.offset = ((page - 1) * 25).toString();
      
      // Fetch the data
      const apiFlights = await fetchFlights(params);
      
      const formattedFlights = formatFlightData(apiFlights);
      
      if (formattedFlights.length > 0) {
        // If this is page 1, replace the data, otherwise append
        if (page === 1) {
          setFlights(formattedFlights);
        } else {
          setFlights(prev => [...prev, ...formattedFlights]);
        }
        
        toast.success(`Loaded ${formattedFlights.length} flights`);
      } else {
        // If API returns no results, fall back to sample data
        if (page === 1) {
          const filteredSampleData = viewType === 'historical' 
            ? historicalFlightsData.filter(flight => isHistorical(flight.date))
            : historicalFlightsData.filter(flight => isUpcoming(flight.date));
          
          setFlights(filteredSampleData);
          toast.info("Using sample flight data - API didn't return results");
        } else {
          toast.info("No more flights found");
        }
      }
    } catch (error) {
      console.error("Error loading flights:", error);
      toast.error("Failed to load flight data. Using sample data instead.");
      
      // Fallback to sample data
      const filteredSampleData = viewType === 'historical' 
        ? historicalFlightsData.filter(flight => isHistorical(flight.date))
        : historicalFlightsData.filter(flight => isUpcoming(flight.date));
      
      setFlights(filteredSampleData);
    } finally {
      setLoading(false);
    }
  };
  
  // Load initial data
  useEffect(() => {
    // On first load, use sample data
    const filteredSampleData = viewType === 'historical' 
      ? historicalFlightsData.filter(flight => isHistorical(flight.date))
      : historicalFlightsData.filter(flight => isUpcoming(flight.date));
    
    setFlights(filteredSampleData);
  }, [viewType]);
  
  // Sort filtered results
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    let comparison = 0;
    if (sortField === 'date') {
      comparison = a.date.localeCompare(b.date);
    } else if (sortField === 'airline') {
      comparison = a.airline.localeCompare(b.airline);
    } else if (sortField === 'origin') {
      comparison = a.origin.localeCompare(b.origin);
    } else if (sortField === 'destination') {
      comparison = a.destination.localeCompare(b.destination);
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  // Get unique airlines for filter
  const airlines = [...new Set(historicalFlightsData.map(flight => flight.airline))];
  
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset to page 1
    loadApiFlights();
  };
  
  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadApiFlights();
  };
  
  // Update these event handlers
  const handleViewTypeChange = (newType: FlightView) => {
    setViewType(newType);
    setSelectedDate(undefined);
    setSelectedAirline(null);
    setSearchTerm('');
  };

  return (
    <section id="historical" className="py-12 w-full max-w-6xl mx-auto">
      <div className="px-4">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="text-purple h-6 w-6" />
          <h2 className="text-2xl font-semibold font-space">
            {viewType === 'historical' ? 'Historical Flights' : 'Upcoming Flights'}
          </h2>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <p className="text-gray-light">
            {viewType === 'historical' 
              ? 'View past flight performance and status information from the last 7 days.' 
              : 'Search and view upcoming scheduled flights for planning your travel.'}
          </p>
          
          <div className="flex gap-2">
            <Button
              variant={viewType === 'historical' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                viewType === 'historical' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => handleViewTypeChange('historical')}
            >
              Historical
            </Button>
            
            <Button
              variant={viewType === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                viewType === 'upcoming' 
                  ? "bg-purple hover:bg-purple-600 text-white" 
                  : "bg-transparent border-gray-light text-gray-light hover:text-white"
              )}
              onClick={() => handleViewTypeChange('upcoming')}
            >
              Upcoming
            </Button>
          </div>
        </div>
        
        {/* Search and Filter Controls */}
        <div className="glass-panel p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Input
                type="text"
                placeholder="Search flights..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-dark/50 border-gray-dark text-white placeholder:text-gray-light focus:border-purple rounded-lg pr-10 w-full"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Search 
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-light h-4 w-4 cursor-pointer" 
                onClick={handleSearch}
              />
            </div>
            
            <div className="flex gap-3">
              {/* Date Picker */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "bg-transparent border-gray-dark text-gray-light hover:text-white",
                      selectedDate && "border-purple text-purple"
                    )}
                  >
                    <Calendar size={16} className="mr-2" />
                    {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Select Date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 bg-dark border-gray-dark">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="bg-dark text-white"
                  />
                </PopoverContent>
              </Popover>
              
              {/* Airline Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button 
                    variant="outline" 
                    className={cn(
                      "bg-transparent border-gray-dark text-gray-light hover:text-white",
                      selectedAirline && "border-purple text-purple"
                    )}
                  >
                    <Filter size={16} className="mr-2" />
                    {selectedAirline || 'All Airlines'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-0 bg-dark border-gray-dark">
                  <div className="p-2">
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-white hover:bg-gray-dark/50"
                      onClick={() => setSelectedAirline(null)}
                    >
                      All Airlines
                    </Button>
                    {airlines.map(airline => (
                      <Button 
                        key={airline}
                        variant="ghost" 
                        className={cn(
                          "w-full justify-start hover:bg-gray-dark/50",
                          selectedAirline === airline ? "text-purple" : "text-white"
                        )}
                        onClick={() => setSelectedAirline(airline)}
                      >
                        {airline}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              
              {/* Search Button */}
              <Button 
                variant="default" 
                className="bg-purple hover:bg-purple-600 text-white"
                onClick={handleSearch}
              >
                <Search size={16} className="mr-2" />
                Search
              </Button>
              
              {/* Clear Filters */}
              {(selectedDate || selectedAirline || searchTerm) && (
                <Button 
                  variant="outline" 
                  className="bg-transparent border-red-500/50 text-red-400 hover:bg-red-900/20"
                  onClick={() => {
                    setSelectedDate(undefined);
                    setSelectedAirline(null);
                    setSearchTerm('');
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Flights Table */}
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
                    <th 
                      className="px-4 py-3 cursor-pointer" 
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center gap-1">
                        Date
                        {sortField === 'date' && (
                          <ArrowUpDown size={14} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
                        )}
                      </div>
                    </th>
                    <th className="px-4 py-3">Scheduled</th>
                    <th className="px-4 py-3">Actual</th>
                    <th className="px-4 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {sortedFlights.length > 0 ? (
                    sortedFlights.map((flight) => (
                      <tr key={`${flight.id}-${flight.date}`} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="px-4 py-3 font-medium">{flight.id}</td>
                        <td className="px-4 py-3">{flight.airline}</td>
                        <td className="px-4 py-3">{flight.origin}</td>
                        <td className="px-4 py-3">{flight.destination}</td>
                        <td className="px-4 py-3">{format(new Date(flight.date), 'MMM dd, yyyy')}</td>
                        <td className="px-4 py-3">{flight.scheduledTime}</td>
                        <td className="px-4 py-3">
                          {flight.status === 'Scheduled' ? '-' : flight.actualTime}
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            flight.status === 'On Time' && "bg-green-900/30 text-green-400",
                            flight.status === 'Delayed' && "bg-red-900/30 text-red-400", 
                            flight.status === 'Scheduled' && "bg-blue-900/30 text-blue-400"
                          )}>
                            {flight.status === 'Delayed' ? `${flight.status} (${flight.delay} min)` : flight.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-gray-light">
                        No flights found matching your search criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <Button 
            className="bg-purple hover:bg-purple-600 text-white purple-glow"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading ? 'Loading...' : viewType === 'historical' ? 'Load More History' : 'Search More Flights'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HistoricalFlights;
