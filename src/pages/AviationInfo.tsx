import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const AviationInfo = () => {
  // Define mock airlines data
  const mockAirlines = [
    {
      name: "American Airlines",
      iata_code: "AA",
      icao_code: "AAL",
      country: "United States",
      active: true
    },
    {
      name: "Delta Air Lines",
      iata_code: "DL",
      icao_code: "DAL",
      country: "United States",
      active: true
    },
    {
      name: "United Airlines",
      iata_code: "UA",
      icao_code: "UAL",
      country: "United States",
      active: true
    },
    {
      name: "Lufthansa",
      iata_code: "LH",
      icao_code: "DLH",
      country: "Germany",
      active: true
    },
    {
      name: "British Airways",
      iata_code: "BA",
      icao_code: "BAW",
      country: "United Kingdom",
      active: true
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Aviation Information</h1>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Airlines</h2>
          <ul>
            {mockAirlines.map((airline, index) => (
              <li key={index} className="py-2">
                {airline.name} ({airline.iata_code} - {airline.icao_code}), {airline.country}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AviationInfo;
