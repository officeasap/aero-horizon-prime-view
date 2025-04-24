import React, { useState } from 'react';
import AutocompleteSearch from '@/components/AutocompleteSearch';
import { SuggestResult } from '@/services/shared/types';
import { RouteMap } from '@/components/RouteMap';

const RouteMappingPage = () => {
  const [departure, setDeparture] = useState<SuggestResult | null>(null);
  const [arrival, setArrival] = useState<SuggestResult | null>(null);

  const handleDepartureSelect = (airport: SuggestResult) => {
    // Only accept airport type
    if (airport.type === 'airport') {
      setDeparture(airport);
    }
  };

  const handleArrivalSelect = (airport: SuggestResult) => {
    // Only accept airport type
    if (airport.type === 'airport') {
      setArrival(airport);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Route Mapping</h1>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/2">
            <h2 className="text-lg mb-2">Departure Airport</h2>
            <AutocompleteSearch
              onSelect={handleDepartureSelect}
              placeholder="Enter departure airport"
              type="airport"
            />
            {departure && (
              <div className="mt-2">
                <p>
                  Selected Departure: {departure.name} ({departure.iata_code})
                </p>
              </div>
            )}
          </div>
          <div className="md:w-1/2">
            <h2 className="text-lg mb-2">Arrival Airport</h2>
            <AutocompleteSearch
              onSelect={handleArrivalSelect}
              placeholder="Enter arrival airport"
              type="airport"
            />
            {arrival && (
              <div className="mt-2">
                <p>
                  Selected Arrival: {arrival.name} ({arrival.iata_code})
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-4">
          <RouteMap departure={departure} arrival={arrival} />
        </div>
      </div>
    </div>
  );
};

export default RouteMappingPage;
