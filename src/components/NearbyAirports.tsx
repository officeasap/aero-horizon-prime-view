
import React, { useState, useEffect } from 'react';
import { fetchNearbyAirports, getUserPosition, Airport } from '@/services/aviationService';
import { MapPin, Loader2, Plane, LocateFixed, RefreshCw, Search } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';

const NearbyAirports: React.FC = () => {
  const [airports, setAirports] = useState<Airport[]>([]);
  const [loading, setLoading] = useState(false);
  const [customLat, setCustomLat] = useState<string>('');
  const [customLng, setCustomLng] = useState<string>('');
  const [distance, setDistance] = useState<number>(100);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    // Try to get user location on component mount
    detectUserLocation();
  }, []);

  const detectUserLocation = async () => {
    setLoading(true);
    try {
      const position = await getUserPosition();
      if (position) {
        setUserLocation(position);
        setCustomLat(position.lat.toString());
        setCustomLng(position.lng.toString());
        await searchNearbyAirports(position.lat, position.lng, distance);
      }
    } catch (error) {
      console.error("Error detecting location:", error);
      toast.error("Could not detect your location. Please enter coordinates manually.");
    } finally {
      setLoading(false);
    }
  };

  const searchNearbyAirports = async (lat: number, lng: number, searchDistance: number) => {
    setLoading(true);
    try {
      const data = await fetchNearbyAirports(lat, lng, searchDistance);
      
      if (data.length === 0) {
        toast.warning(`No airports found within ${searchDistance} km of this location`);
        setAirports([]);
      } else {
        setAirports(data);
        toast.success(`Found ${data.length} airports near this location`);
      }
    } catch (error) {
      console.error("Error fetching nearby airports:", error);
      toast.error("Failed to fetch nearby airports");
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomSearch = () => {
    const lat = parseFloat(customLat);
    const lng = parseFloat(customLng);
    
    if (isNaN(lat) || isNaN(lng)) {
      toast.error("Please enter valid latitude and longitude values");
      return;
    }
    
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Latitude must be between -90 and 90, and longitude between -180 and 180");
      return;
    }
    
    searchNearbyAirports(lat, lng, distance);
  };

  return (
    <section className="py-8 max-w-5xl mx-auto px-4">
      <div className="flex items-center gap-2 mb-6">
        <MapPin className="text-purple h-6 w-6" />
        <h2 className="text-2xl font-semibold font-space">Nearby Airports</h2>
      </div>
      
      <div className="glass-panel p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl mb-4 font-medium">Find Airports Near You</h3>
            <p className="text-gray-light mb-4">
              Discover airports in your vicinity. We can automatically detect your location or you can enter coordinates manually.
            </p>
            
            <div className="flex gap-2 mb-4">
              <Button 
                className="bg-purple hover:bg-purple-600 text-white" 
                onClick={detectUserLocation}
                disabled={loading}
              >
                <LocateFixed className="mr-2 h-4 w-4" />
                Detect My Location
              </Button>
              
              <Button 
                variant="outline" 
                className="bg-transparent border-gray-light text-gray-light hover:bg-white/10"
                onClick={() => searchNearbyAirports(
                  parseFloat(customLat), 
                  parseFloat(customLng), 
                  distance
                )}
                disabled={loading || !customLat || !customLng}
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Results
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-1">Latitude</label>
                  <Input 
                    value={customLat}
                    onChange={(e) => setCustomLat(e.target.value)}
                    placeholder="e.g. 40.730610"
                    className="bg-gray-dark/50 border-gray-dark text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-light mb-1">Longitude</label>
                  <Input 
                    value={customLng}
                    onChange={(e) => setCustomLng(e.target.value)}
                    placeholder="e.g. -73.935242"
                    className="bg-gray-dark/50 border-gray-dark text-white"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-sm font-medium text-gray-light">Search Distance</label>
                  <span className="text-sm text-purple-300">{distance} km</span>
                </div>
                <Slider 
                  value={[distance]} 
                  onValueChange={(values) => setDistance(values[0])}
                  min={10}
                  max={300}
                  step={10}
                  className="py-4"
                />
              </div>
              
              <Button 
                className="w-full bg-purple hover:bg-purple-600 text-white purple-glow" 
                onClick={handleCustomSearch}
                disabled={loading || !customLat || !customLng}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                Search This Location
              </Button>
            </div>
          </div>
          
          <div>
            {userLocation ? (
              <div className="h-60 bg-gray-dark rounded-lg overflow-hidden relative">
                <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=${userLocation.lat},${userLocation.lng}&zoom=9&size=600x400&maptype=roadmap&markers=color:red%7C${userLocation.lat},${userLocation.lng}')] bg-cover bg-center opacity-50"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-white text-center">
                    <MapPin className="h-10 w-10 text-purple mx-auto mb-2" />
                    <p className="font-medium">Current Location</p>
                    <p className="text-sm text-gray-light">Lat: {userLocation.lat.toFixed(6)}, Lng: {userLocation.lng.toFixed(6)}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-60 bg-gray-dark/30 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-10 w-10 text-gray-light mx-auto mb-2" />
                  <p className="text-gray-light">No location selected</p>
                  <p className="text-sm text-gray-light mt-2">Use the detect button or enter coordinates</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="glass-panel overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {loading ? 'Searching for airports...' : `${airports.length} Airports Found`}
          </h3>
          {airports.length > 0 && (
            <span className="text-sm text-gray-light">
              Showing results within {distance} km
            </span>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center p-12">
            <Loader2 className="animate-spin h-8 w-8 text-purple" />
          </div>
        ) : airports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {airports.map((airport) => (
              <div key={airport.iata_code} className="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-purple/30 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-white/5 rounded-full">
                    <Plane className="h-5 w-5 text-purple" />
                  </div>
                  <div>
                    <h4 className="font-medium">{airport.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-white/10 text-xs px-2 py-1 rounded">
                        {airport.iata_code}
                      </span>
                      <span className="text-gray-light text-xs">
                        {airport.country_code}
                      </span>
                    </div>
                    <p className="text-sm text-gray-light mt-2">
                      {airport.city || 'Unknown city'}
                    </p>
                    <div className="mt-2 text-xs text-gray-light flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{airport.distance ? `${airport.distance.toFixed(1)} km away` : 'Distance unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Plane className="h-12 w-12 text-gray-light mx-auto mb-3" />
            <p className="text-gray-light">No airports found within the specified range.</p>
            <p className="text-sm text-gray-light mt-2">Try increasing the search distance or changing the location.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default NearbyAirports;
