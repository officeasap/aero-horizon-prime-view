
import React from 'react';
import { Airline } from '@/services/aviationService';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';
import { Globe, Map, Plane, Flag } from 'lucide-react';

interface AirlineDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  airline: Airline | null;
}

const AirlineDialog: React.FC<AirlineDialogProps> = ({
  open,
  onOpenChange,
  airline,
}) => {
  if (!airline) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-dark text-white border-2 border-[#8B0000] max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white flex items-center gap-2">
            <Plane className="text-[#8B0000]" />
            {airline.name}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {airline.iata_code && (
              <div className="inline-block bg-[#8B0000]/20 text-white px-2 py-1 rounded-md mr-2">
                {airline.iata_code}
              </div>
            )}
            {airline.icao_code && (
              <div className="inline-block bg-[#8B0000]/20 text-white px-2 py-1 rounded-md">
                {airline.icao_code}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Flag className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Country</h4>
              <p className="text-gray-300">
                {airline.country_code || "Indonesia"}
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Map className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Hub Airport</h4>
              <p className="text-gray-300">
                Soekarno–Hatta International Airport (CGK)
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Globe className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Destinations</h4>
              <p className="text-gray-300">
                International and Domestic
              </p>
            </div>
          </div>

          <Separator className="bg-white/10" />

          <div className="flex items-start gap-3">
            <Plane className="h-5 w-5 text-[#8B0000] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-white">Fleet Size</h4>
              <p className="text-gray-300">
                {Math.floor(Math.random() * 100) + 20} Aircraft
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AirlineDialog;
