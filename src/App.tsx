
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
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { registerServiceWorker } from "./services/notificationService";

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
  }, []);

  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </StrictMode>
  );
}

export default App;
