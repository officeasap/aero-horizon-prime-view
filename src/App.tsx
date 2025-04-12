
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import LiveFlightTracker from "./pages/LiveFlightTracker";
import FlightStatus from "./pages/FlightStatus";
import AirportsAirlines from "./pages/AirportsAirlines";
import GlobalWeather from "./pages/GlobalWeather";
import Contact from "./pages/Contact";
import WorldClockPage from "./pages/WorldClock";
import FlightSchedulePage from "./pages/FlightSchedulePage";
import { useState } from "react";

const App = () => {
  // Create a client inside the component using useState to ensure it's only created once
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/live-tracker" element={<LiveFlightTracker />} />
            <Route path="/flight-status" element={<FlightStatus />} />
            <Route path="/airports-airlines" element={<AirportsAirlines />} />
            <Route path="/weather" element={<GlobalWeather />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/world-clock" element={<WorldClockPage />} />
            <Route path="/flight-schedule" element={<FlightSchedulePage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
