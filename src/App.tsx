
import { StrictMode } from "react";
import "./App.css";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import WorldClock from "./pages/WorldClock";
import GlobalWeather from "./pages/GlobalWeather";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AirportsAirlinesPage from "./pages/AirportsAirlinesPage";
import FlightSchedulePage from "./pages/FlightSchedulePage";
import LiveFlightTracker from "./pages/LiveFlightTracker";
import FlightStatusDetailPage from "./pages/FlightStatusDetailPage";
import FlightAlertsSignup from "./pages/FlightAlertsSignup";
import AviationInfo from "./pages/AviationInfo";
import AirportInfoPage from "./pages/AirportInfoPage";
import FlightStatus from "./pages/FlightStatus";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookiePolicy from "./pages/CookiePolicy";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { registerServiceWorker } from "./services/notificationService";
import ASAPAgentButton from "./components/ASAPAgent/ASAPAgentButton";

// Import fetch and Headers for global definition
import fetch from 'node-fetch';

// Define global fetch and Headers if not already defined (for SSR compatibility)
if (!globalThis.fetch) {
  // @ts-ignore
  globalThis.fetch = fetch;
  // @ts-ignore
  globalThis.Headers = fetch.Headers;
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />
  },
  {
    path: "/world-clock",
    element: <WorldClock />
  },
  {
    path: "/global-weather",
    element: <GlobalWeather />
  },
  {
    path: "/weather",
    element: <Navigate to="/global-weather" replace />
  },
  {
    path: "/flight-schedule",
    element: <FlightSchedulePage />
  },
  {
    path: "/airports-airlines",
    element: <AirportsAirlinesPage />
  },
  {
    path: "/live-flight-tracker",
    element: <LiveFlightTracker />
  },
  {
    path: "/live-tracker",
    element: <Navigate to="/live-flight-tracker" replace />
  },
  {
    path: "/flight/:flightId",
    element: <FlightStatusDetailPage />
  },
  {
    path: "/contact",
    element: <Contact />
  },
  {
    path: "/flight-alerts",
    element: <FlightAlertsSignup />
  },
  {
    path: "/aviation-info",
    element: <AviationInfo />
  },
  {
    path: "/airport-info",
    element: <AirportInfoPage />
  },
  {
    path: "/flight-status",
    element: <FlightStatus />
  },
  {
    path: "/privacy",
    element: <PrivacyPolicy />
  },
  {
    path: "/terms",
    element: <TermsOfService />
  },
  {
    path: "/cookies",
    element: <CookiePolicy />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());

  useEffect(() => {
    // Register service worker on app load
    if ('serviceWorker' in navigator) {
      registerServiceWorker().catch(error => {
        console.error('Service worker registration failed:', error);
      });
    }
    
    // Update the document title
    document.title = "ASAP Tracker - Real-Time Flight Services";
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
        <ASAPAgentButton />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
