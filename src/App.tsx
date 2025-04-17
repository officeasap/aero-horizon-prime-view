
import "./App.css";
import "./index.css";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import WorldClock from "./pages/WorldClock";
import GlobalWeather from "./pages/GlobalWeather";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import FlightStatus from "./pages/FlightStatus";
import FlightSchedulePage from "./pages/FlightSchedulePage";
import LiveFlightTracker from "./pages/LiveFlightTracker";
import FlightStatusDetailPage from "./pages/FlightStatusDetailPage";
import NearbyAirportsPage from "./pages/NearbyAirportsPage";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

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
    path: "/flight-status",
    element: <FlightStatus />
  },
  {
    path: "/flight-schedule",
    element: <FlightSchedulePage />
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
    element: <Navigate to="/flight-status" replace />
  },
  {
    path: "*",
    element: <NotFound />
  }
]);

function App() {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
