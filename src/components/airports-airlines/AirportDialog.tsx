
import React from 'react';
import { Airport } from '@/services/aviationService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Globe, Building, Navigation } from 'lucide-react';

interface AirportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airport: Airport | null;
}

const AirportDialog: React.FC<AirportDialogProps> = ({
  open,
  onOpenChange,
  airport,
}) => {
  if (!airport) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark text-white border-2 border-[#8B0000] max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <Building className="text-[#8B0000]" />
            {airport.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {airport.iata_code && (
              <div className="inline-block bg-[#8B0000]/20 text-white px-2 py-1 rounded-md mr-2">
                {airport.iata_code}
              </div>
            )}
            {airport.icao_code && (
              <div className="inline-block bg-[#8B0000]/20 text-white px-2 py-1 rounded-md">
                {airport.icao_code}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Location</h4>
              <p className="text-gray-300">
                {airport.city}, {airport.country_code || "Unknown"}
              </p>
              {airport.lat && airport.lon && (
                <p className="text-xs text-gray-400 mt-1">
                  Coordinates: {airport.lat.toFixed(4)}, {airport.lon.toFixed(4)}
                </p>
              )}
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Navigation className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Timezone</h4>
              <p className="text-gray-300">{airport.timezone || "Asia/Jakarta"}</p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Region</h4>
              <p className="text-gray-300">
                {airport.region || "Asia"}
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Local Time</h4>
              <p className="text-gray-300">
                {new Date().toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZone: airport.timezone || 'Asia/Jakarta',
                })}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AirportDialog;
