
import React from 'react';
import { Airport } from '@/services/aviationService';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AirportTableProps {
  airports: Airport[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onAirportSelect: (airport: Airport) => void;
}

const AirportTable: React.FC<AirportTableProps> = ({
  airports,
  onSort,
  sortConfig,
  onAirportSelect,
}) => {
  const getSortIndicator = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }

    return sortConfig.direction === 'asc' 
      ? <ArrowUpDown className="ml-1 h-4 w-4 text-purple rotate-180" />
      : <ArrowUpDown className="ml-1 h-4 w-4 text-purple" />;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-dark/50 text-xs uppercase text-gray-light">
          <tr>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('name')}>
              <div className="flex items-center">
                Airport Name {getSortIndicator('name')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('iata_code')}>
              <div className="flex items-center">
                IATA {getSortIndicator('iata_code')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('city')}>
              <div className="flex items-center">
                City {getSortIndicator('city')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('country_code')}>
              <div className="flex items-center">
                Country {getSortIndicator('country_code')}
              </div>
            </th>
            <th className="px-4 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {airports.map((airport) => (
            <tr key={airport.iata_code} className="border-b border-white/5 hover:bg-white/5">
              <td className="px-4 py-3 font-medium">{airport.name}</td>
              <td className="px-4 py-3 text-gray-light">{airport.iata_code}</td>
              <td className="px-4 py-3">{airport.city}</td>
              <td className="px-4 py-3">{airport.country_code}</td>
              <td className="px-4 py-3 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAirportSelect(airport)}
                  className="bg-[#8B0000]/20 text-white hover:bg-[#8B0000] border-[#8B0000]/50"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AirportTable;
