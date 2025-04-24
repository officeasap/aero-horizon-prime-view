
import React from 'react';
import { Airline } from '@/services/aviationService';
import { Button } from '@/components/ui/button';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AirlineTableProps {
  airlines: Airline[];
  onSort: (key: string) => void;
  sortConfig: { key: string; direction: 'asc' | 'desc' } | null;
  onAirlineSelect: (airline: Airline) => void;
}

const AirlineTable: React.FC<AirlineTableProps> = ({
  airlines,
  onSort,
  sortConfig,
  onAirlineSelect,
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
                Airline Name {getSortIndicator('name')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('iata_code')}>
              <div className="flex items-center">
                IATA {getSortIndicator('iata_code')}
              </div>
            </th>
            <th className="px-4 py-3 cursor-pointer" onClick={() => onSort('icao_code')}>
              <div className="flex items-center">
                ICAO {getSortIndicator('icao_code')}
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
          {airlines.map((airline) => (
            <tr key={airline.iata_code} className="border-b border-white/5 hover:bg-white/5">
              <td className="px-4 py-3 font-medium">{airline.name}</td>
              <td className="px-4 py-3 text-gray-light">{airline.iata_code}</td>
              <td className="px-4 py-3">{airline.icao_code}</td>
              <td className="px-4 py-3">{airline.country_code}</td>
              <td className="px-4 py-3 text-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onAirlineSelect(airline)}
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

export default AirlineTable;
